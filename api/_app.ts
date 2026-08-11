/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// High payload limit for PDF/image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Body-parser errors (payload too large / malformed JSON) must be returned as
// JSON, otherwise the browser gets an HTML error page and `response.json()`
// throws an unhelpful "Unexpected token <" in the upload flow.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'The uploaded file is too large. Please upload a file under 20 MB.',
    });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'The upload request was malformed. Please try again.' });
  }
  return next(err);
});

// Lazy Gemini AI initialization helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// MIME types Gemini accepts as inline document/image data.
const SUPPORTED_INLINE_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

// Map of common aliases / browser quirks to a canonical supported MIME type.
const MIME_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
  'application/x-pdf': 'application/pdf',
  'application/acrobat': 'application/pdf',
  'text/pdf': 'application/pdf',
};

/**
 * Detects the real media type from the raw base64 payload by inspecting magic
 * bytes. Browsers frequently report an empty or wrong MIME type, and sending a
 * mismatched one makes the Gemini call fail with an opaque 400.
 */
function detectMimeFromBase64(base64: string): string | null {
  // 24 base64 chars ≈ 18 bytes, enough for every signature we check.
  const header = Buffer.from(base64.slice(0, 64), 'base64');
  if (header.length < 4) return null;

  // %PDF
  if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
    return 'application/pdf';
  }
  // JPEG: FF D8 FF
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return 'image/png';
  }
  // WEBP: "RIFF"...."WEBP"
  if (header.slice(0, 4).toString('ascii') === 'RIFF' && header.slice(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }
  // HEIC/HEIF: ....ftyp{heic,heix,hevc,mif1,heif}
  if (header.slice(4, 8).toString('ascii') === 'ftyp') {
    const brand = header.slice(8, 12).toString('ascii');
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heif'].includes(brand)) {
      return 'image/heic';
    }
  }
  // GIF
  if (header.slice(0, 3).toString('ascii') === 'GIF') return 'image/gif';

  return null;
}

/**
 * Normalizes an incoming upload: strips the data-URL prefix, validates the
 * base64 payload, and resolves a MIME type Gemini will actually accept.
 */
function normalizeInlineUpload(fileData: string, declaredMimeType?: string) {
  if (typeof fileData !== 'string' || fileData.trim() === '') {
    return { error: 'The uploaded file is empty or could not be read.' };
  }

  // Accept both raw base64 and full data URLs.
  const dataUrlMatch = /^data:([^;,]+)?(;base64)?,/.exec(fileData);
  const base64 = fileData.replace(/^data:[^;,]*(;base64)?,/, '').replace(/\s/g, '');

  if (!base64) {
    return { error: 'The uploaded file is empty or could not be read.' };
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    return { error: 'The uploaded file could not be decoded. Please try uploading it again.' };
  }

  const sizeBytes = Math.floor((base64.length * 3) / 4);
  if (sizeBytes < 64) {
    return { error: 'The uploaded file is too small or corrupted. Please choose another file.' };
  }
  if (sizeBytes > 25 * 1024 * 1024) {
    return { error: 'The uploaded file is too large. Please upload a file under 20 MB.' };
  }

  // Priority: real bytes > data-URL type > declared type.
  const detected = detectMimeFromBase64(base64);
  const fromDataUrl = dataUrlMatch?.[1]?.toLowerCase().trim();
  const declared = declaredMimeType?.toLowerCase().trim();

  const candidates = [detected, fromDataUrl, declared].filter(Boolean) as string[];

  let mimeType: string | undefined;
  for (const candidate of candidates) {
    const canonical = MIME_ALIASES[candidate] || candidate;
    if (SUPPORTED_INLINE_MIME_TYPES.has(canonical)) {
      mimeType = canonical;
      break;
    }
  }

  if (!mimeType) {
    return {
      error:
        'Unsupported file format. Please upload a PDF or an image file (JPG, PNG, WEBP, or HEIC).',
    };
  }

  return { base64, mimeType, sizeBytes };
}

/**
 * Turns a raw Gemini/SDK error into a user-facing message and HTTP status,
 * instead of leaking stack traces or unhelpful "[500] undefined" strings.
 */
function describeUploadError(err: any): { status: number; message: string } {
  const raw = String(err?.message || err || '');

  // NOTE: configuration failures deliberately use 500, not 503. The client
  // retries 502/503/504 as transient, and re-uploading a multi-megabyte report
  // two more times cannot fix a missing or invalid key - it just triples the
  // payload and the latency before the user sees the real message.
  if (raw.includes('GEMINI_API_KEY')) {
    return {
      status: 500,
      message:
        'The AI service is not configured on the server (missing GEMINI_API_KEY). Add the key in your hosting provider\'s environment variables (or .env for local development) and redeploy.',
    };
  }
  if (raw.includes('API key not valid') || raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return { status: 500, message: 'The configured AI API key is invalid or lacks permission. Please check GEMINI_API_KEY.' };
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota')) {
    return { status: 429, message: 'The AI service is rate-limited right now. Please wait a moment and try again.' };
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('Overloaded')) {
    return { status: 503, message: 'The AI service is temporarily overloaded. Please try again in a few seconds.' };
  }
  if (raw.includes('unsupported') || raw.includes('Unsupported MIME') || raw.includes('INVALID_ARGUMENT')) {
    return {
      status: 400,
      message: 'The AI service could not read this file. Please try a clearer photo, or export the report as PDF/JPG.',
    };
  }
  if (raw.includes('SAFETY') || raw.includes('blocked')) {
    return { status: 400, message: 'This document could not be processed by the safety filters. Please try a different file.' };
  }

  return { status: 500, message: raw || 'An unexpected error occurred while analyzing the report.' };
}

// Helper to clean and parse JSON strings that may contain markdown block formatting
function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

// Robust Gemini API caller with retries, exponential backoff, and fallback model candidate handling
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.1-flash-lite'];

interface GenerateOptions {
  ai: GoogleGenAI;
  model?: string;
  contents: any;
  config?: any;
  maxRetries?: number;
}

async function generateContentWithRetry(options: GenerateOptions) {
  const { ai, model = 'gemini-3.6-flash', contents, config, maxRetries = 3 } = options;

  // Prioritize target model, then candidate fallback models
  const modelsToTry = [model];
  for (const candidate of FALLBACK_MODELS) {
    if (!modelsToTry.includes(candidate)) {
      modelsToTry.push(candidate);
    }
  }

  let lastError: any = null;

  for (const currentModel of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMessage = String(err?.message || err);
        const errStatus = String(err?.status || '');
        const fullErrText = `${errMessage} ${errStatus}`;

        const isTransient =
          fullErrText.includes('503') ||
          fullErrText.includes('UNAVAILABLE') ||
          fullErrText.includes('high demand') ||
          fullErrText.includes('429') ||
          fullErrText.includes('RESOURCE_EXHAUSTED') ||
          fullErrText.includes('Overloaded') ||
          fullErrText.includes('FetchError') ||
          fullErrText.includes('ETIMEDOUT');

        if (isTransient) {
          if (attempt < maxRetries) {
            const delayMs = attempt * 1200;
            console.warn(`[Gemini API] ${currentModel} attempt ${attempt} failed with high demand / 503. Retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          } else {
            console.warn(`[Gemini API] ${currentModel} exhausted ${maxRetries} retries. Trying fallback model if available...`);
          }
        } else {
          // Throw non-transient errors immediately
          throw err;
        }
      }
    }
  }

  throw lastError;
}

// System safety disclaimer prompt
const SAFETY_SYSTEM_PROMPT = `You are MediExplain AI, an expert medical report simplification system built to make medical lab reports, radiology findings, and clinical documents clear and accessible for patients.

CRITICAL SAFETY DIRECTIVES:
1. NEVER diagnose any disease, syndrome, or medical condition.
2. NEVER prescribe, recommend, or suggest changing any medication or treatment plan.
3. Keep all language educational, empathetic, and neutral.
4. Categorize values into:
   - "normal": value is within standard reference range
   - "discussion": value is slightly outside reference range or warrants routine discussion with a doctor
   - "attention": value is significantly out of range or requires prompt medical review
5. If the document contains severe critical abnormalities (e.g., troponin spike, severe anemia, acute kidney failure flags), set hasCriticalFindings to true and include an explicit, urgent safety alert urging immediate contact with a healthcare provider or emergency service.
6. Provide relatable, everyday analogies for complex medical terms (e.g. comparing kidneys to water filters, LDL to cargo trucks, HDL to street sweepers).
7. Suggest targeted, empowering questions for the patient to ask their doctor.`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Analyze Medical Report (PDF or Image or Text)
app.post('/api/analyze-report', async (req, res) => {
  try {
    const { fileData, mimeType, fileName, fileType, language = 'en' } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'No file was received. Please select a file and try again.' });
    }

    // Validate + normalize the payload before spending a Gemini call on it.
    const normalized = normalizeInlineUpload(fileData, mimeType);
    if ('error' in normalized) {
      console.warn('[analyze-report] Rejected upload:', normalized.error);
      return res.status(400).json({ error: normalized.error });
    }

    console.log(
      `[analyze-report] Received "${fileName || 'unnamed'}" (${normalized.mimeType}, ${(normalized.sizeBytes / 1024).toFixed(0)} KB)`
    );

    const ai = getGeminiClient();

    const parts: any[] = [];

    // Attach inline media
    parts.push({
      inlineData: {
        mimeType: normalized.mimeType,
        data: normalized.base64,
      },
    });

    const targetLangName = language === 'fr' ? 'French (Français)' : language === 'ar' ? 'Arabic (العربية)' : 'English';

    parts.push({
      text: `Analyze this medical document thoroughly. Extract all medical tests, reference ranges, patient lab values, clinical impressions, and medical terminology.
IMPORTANT: You MUST write all explanations, summaries, whatItMeasures, whyItMatters, questionsToAsk, definitions, analogies, and doctor prep content in ${targetLangName}.
      
Return a JSON object following this exact structure:
{
  "patientInfo": {
    "date": "Extracted date or unknown",
    "reportType": "Type of report e.g. Lipid Panel, Complete Blood Count, Radiology",
    "laboratory": "Name of clinic/lab if present"
  },
  "shortSummary": "A concise 2-sentence summary of the main outcome of this report in ${targetLangName}.",
  "laymanExplanation": "A friendly, easy-to-understand explanation of what this report means for a non-medical person, using clear analogies in ${targetLangName}.",
  "importantFindings": ["Key finding 1 in ${targetLangName}", "Key finding 2 in ${targetLangName}"],
  "safetyAlerts": ["Important safety note or recommendation for doctor discussion in ${targetLangName}"],
  "hasCriticalFindings": boolean (true if any value requires immediate or urgent medical attention),
  "labValues": [
    {
      "id": "val-1",
      "name": "Test name e.g. Total Cholesterol",
      "value": "238",
      "unit": "mg/dL",
      "referenceRange": "120 - 200",
      "status": "normal" | "discussion" | "attention",
      "category": "Category name in ${targetLangName}",
      "whatItMeasures": "What this test measures in plain language in ${targetLangName}",
      "whyItMatters": "Why this result is important for body health in ${targetLangName}",
      "questionsToAsk": ["Question 1 to ask doctor in ${targetLangName}", "Question 2 in ${targetLangName}"],
      "isAbnormal": boolean
    }
  ],
  "vocabulary": [
    {
      "term": "Medical term used in report",
      "definition": "Simple definition in ${targetLangName}",
      "whyItMatters": "Relevance to this report in ${targetLangName}",
      "analogy": "Relatable real-world analogy in ${targetLangName}"
    }
  ],
  "doctorPrep": {
    "topQuestions": [
      {
        "id": "q1",
        "question": "Specific question for doctor in ${targetLangName}",
        "context": "Context for why to ask in ${targetLangName}",
        "priority": "high" | "medium" | "standard",
        "category": "Category in ${targetLangName}"
      }
    ],
    "discussionPoints": ["Topic 1 to talk about in ${targetLangName}"],
    "thingsToMonitor": ["Metric or symptom to track in ${targetLangName}"],
    "followUpTimeline": "Follow-up timeline in ${targetLangName}"
  }
}`
    });

    const response = await generateContentWithRetry({
      ai,
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction: `${SAFETY_SYSTEM_PROMPT}\nTarget Output Language: ${targetLangName}.`,
        responseMimeType: 'application/json',
      },
    });

    const textResult = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = cleanAndParseJSON(textResult);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', textResult);
      return res.status(500).json({ error: 'Failed to format medical report analysis result.' });
    }

    const result = {
      id: `report-${Date.now()}`,
      fileName: fileName || 'Uploaded_Medical_Report',
      fileType: fileType || 'pdf',
      patientInfo: parsedData.patientInfo || {},
      shortSummary: parsedData.shortSummary || 'Medical report analyzed.',
      laymanExplanation: parsedData.laymanExplanation || 'No detailed explanation generated.',
      importantFindings: parsedData.importantFindings || [],
      safetyAlerts: parsedData.safetyAlerts || ['Discuss these findings with your doctor.'],
      hasCriticalFindings: Boolean(parsedData.hasCriticalFindings),
      labValues: parsedData.labValues || [],
      vocabulary: parsedData.vocabulary || [],
      doctorPrep: parsedData.doctorPrep || {
        topQuestions: [],
        discussionPoints: [],
        thingsToMonitor: [],
        followUpTimeline: 'Consult your doctor.',
      },
      timestamp: Date.now(),
    };

    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Error in /api/analyze-report:', err);
    const { status, message } = describeUploadError(err);
    res.status(status).json({ error: message });
  }
});

// 2. Camera Live Scanner endpoint (for real-time snapshot / query analysis)
app.post('/api/camera-frame-live', async (req, res) => {
  try {
    const { imageBase64, userQuestion, language = 'en' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No camera frame was received.' });
    }

    const normalizedFrame = normalizeInlineUpload(imageBase64, 'image/jpeg');
    if ('error' in normalizedFrame) {
      return res.status(400).json({ error: normalizedFrame.error });
    }

    const ai = getGeminiClient();

    const targetLangName = language === 'fr' ? 'French (Français)' : language === 'ar' ? 'Arabic (العربية)' : 'English';

    const promptText = userQuestion
      ? `The user is pointing their camera at a medical report and asks in ${targetLangName}: "${userQuestion}". Analyze the visible report in the frame, read any visible text, tables, or notes, and answer the user's question directly, clearly, and accessibly in ${targetLangName}.`
      : `The user is pointing their camera at a medical document. Identify the document type, detect any visible lab values or clinical text, and give a quick 2-sentence breakdown in ${targetLangName} of what is shown and any key values to note.`;

    const response = await generateContentWithRetry({
      ai,
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: normalizedFrame.mimeType,
              data: normalizedFrame.base64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: `${SAFETY_SYSTEM_PROMPT}\nTarget Output Language: ${targetLangName}.\nKeep live responses succinct and easy to listen to or read on camera.`,
        responseMimeType: 'application/json',
      },
    });

    const textResult = response.text || '{}';
    let parsed: any = {};
    try {
      parsed = cleanAndParseJSON(textResult);
    } catch {
      parsed = {
        detectedTextSummary: 'Analyzed visible report frame.',
        keyObservation: response.text || 'Document scanned successfully.',
        detectedValues: [],
        suggestedDoctorQuestions: ['What do these readings mean for my care plan?'],
        spokenResponse: response.text || 'Document scanned successfully.',
      };
    }

    res.json({ success: true, analysis: parsed });
  } catch (err: any) {
    console.error('Error in /api/camera-frame-live:', err);
    const { status, message } = describeUploadError(err);
    res.status(status).json({ error: message });
  }
});

// 3. Chat with Report Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { reportContext, messages, userMessage, language = 'en' } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required.' });
    }

    const ai = getGeminiClient();

    const targetLangName = language === 'fr' ? 'French (Français)' : language === 'ar' ? 'Arabic (العربية)' : 'English';

    const systemInstruction = `${SAFETY_SYSTEM_PROMPT}

You are helping the patient understand their uploaded medical report.
Context of the uploaded report:
${JSON.stringify(reportContext || {}, null, 2)}

Instructions for Chat:
- IMPORTANT: You MUST reply strictly in ${targetLangName}.
- Answer the user's questions specifically referencing their report values when relevant.
- Be clear, kind, educational, and easy to understand.
- Never give a medical diagnosis, treatment plan, or drug dosage.
- Always include a brief reminder in ${targetLangName} that this is educational information and not medical advice.`;

    // Construct contents history
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      messages.forEach((msg) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await generateContentWithRetry({
      ai,
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      answer: response.text || 'I analyzed your query based on your report.',
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Chat service encountered an error.' });
  }
});

// 4. Text to Speech API endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const ai = getGeminiClient();

    const response = await generateContentWithRetry({
      ai,
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say clearly in a calm tone: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio });
    } else {
      return res.json({ success: false, message: 'Audio generation unavailable.' });
    }
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    res.status(500).json({ error: err.message || 'Speech generation failed.' });
  }
});

// 5. Translate existing report analysis into target language
app.post('/api/translate-report', async (req, res) => {
  try {
    const { report, targetLanguage = 'en' } = req.body;
    if (!report) {
      return res.status(400).json({ error: 'report object is required.' });
    }

    const ai = getGeminiClient();
    const targetLangName = targetLanguage === 'fr' ? 'French (Français)' : targetLanguage === 'ar' ? 'Arabic (العربية)' : 'English';

    const promptText = `Translate all text explanations in the following medical report analysis into ${targetLangName}.
Preserve exact structural schema and keys:
- Keep IDs, numeric values, units, reference ranges, status strings ("normal", "discussion", "attention"), fileType, and boolean values unchanged.
- Translate: shortSummary, laymanExplanation, importantFindings, safetyAlerts, labValues (category, whatItMeasures, whyItMatters, questionsToAsk), vocabulary (term, definition, whyItMatters, analogy, category), doctorPrep (topQuestions, discussionPoints, thingsToMonitor, followUpTimeline), and patientInfo (reportType, laboratory).

Report JSON to translate:
${JSON.stringify(report, null, 2)}`;

    const response = await generateContentWithRetry({
      ai,
      model: 'gemini-3.6-flash',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        systemInstruction: `${SAFETY_SYSTEM_PROMPT}\nTarget Output Language: ${targetLangName}.\nOutput strictly valid JSON matching the input schema with translated text fields.`,
        responseMimeType: 'application/json',
      },
    });

    const textResult = response.text || '{}';
    let parsed: any;
    try {
      parsed = cleanAndParseJSON(textResult);
    } catch {
      parsed = report;
    }

    const translatedResult = {
      ...report,
      patientInfo: parsed.patientInfo || report.patientInfo,
      shortSummary: parsed.shortSummary || report.shortSummary,
      laymanExplanation: parsed.laymanExplanation || report.laymanExplanation,
      importantFindings: parsed.importantFindings || report.importantFindings,
      safetyAlerts: parsed.safetyAlerts || report.safetyAlerts,
      labValues: Array.isArray(parsed.labValues) && parsed.labValues.length === report.labValues.length ? parsed.labValues : report.labValues,
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : report.vocabulary,
      doctorPrep: parsed.doctorPrep || report.doctorPrep,
    };

    res.json({ success: true, result: translatedResult });
  } catch (err: any) {
    console.error('Error in /api/translate-report:', err);
    res.status(500).json({ error: err.message || 'Translation failed.' });
  }
});

export default app;
