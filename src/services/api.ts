/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReportAnalysisResult, LiveCameraAnalysis, ChatMessage } from '../types';

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    // fetch() only rejects on network-level failures (offline, server down).
    throw new Error(
      'Could not reach the server. Please check your connection and make sure the app server is running.'
    );
  }

  for (let i = 0; i < retries; i++) {
    if (response.ok || (response.status !== 502 && response.status !== 503 && response.status !== 504)) {
      break;
    }
    await new Promise((r) => setTimeout(r, (i + 1) * 1500));
    try {
      response = await fetch(url, options);
    } catch {
      break;
    }
  }

  return response;
}

/**
 * Extracts a useful error message from a failed response, tolerating servers
 * that reply with HTML (proxy errors, 413 pages) instead of JSON.
 */
async function extractError(response: Response, fallback: string): Promise<string> {
  const text = await response.text().catch(() => '');

  if (text) {
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error) return parsed.error;
    } catch {
      // Non-JSON body (HTML error page); fall through to status-based message.
    }
  }

  if (response.status === 413) {
    return 'The uploaded file is too large. Please upload a file under 20 MB.';
  }
  if (response.status === 429) {
    return 'The AI service is busy right now. Please wait a moment and try again.';
  }
  if (response.status >= 500) {
    return 'The server had a problem processing this file. Please try again.';
  }

  return `${fallback} (HTTP ${response.status})`;
}

/**
 * De-duplicates concurrent analyses of the same report.
 *
 * React 18 StrictMode double-invokes effects in development, and users
 * double-click "Analyze" or re-drop the same file. Each of those would be a
 * separate multi-megabyte upload and a separate (billed) Gemini call for an
 * identical result, so identical in-flight requests share one promise.
 */
const inFlightAnalyses = new Map<string, Promise<ReportAnalysisResult>>();

export async function analyzeReportFile(
  fileData: string,
  mimeType: string,
  fileName: string,
  fileType: 'pdf' | 'image' | 'camera_capture',
  language: string = 'en'
): Promise<ReportAnalysisResult> {
  // Key on content length + a cheap prefix/suffix sample rather than the whole
  // base64 string, so we don't hash several megabytes on every upload.
  const key = [
    language,
    mimeType,
    fileType,
    fileData.length,
    fileData.slice(0, 64),
    fileData.slice(-64),
  ].join('|');

  const existing = inFlightAnalyses.get(key);
  if (existing) return existing;

  const request = performAnalyzeReport(fileData, mimeType, fileName, fileType, language).finally(
    () => {
      inFlightAnalyses.delete(key);
    }
  );

  inFlightAnalyses.set(key, request);
  return request;
}

async function performAnalyzeReport(
  fileData: string,
  mimeType: string,
  fileName: string,
  fileType: 'pdf' | 'image' | 'camera_capture',
  language: string
): Promise<ReportAnalysisResult> {
  const response = await fetchWithRetry('/api/analyze-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileData, mimeType, fileName, fileType, language }),
  });

  if (!response.ok) {
    throw new Error(await extractError(response, 'Failed to analyze the medical report.'));
  }

  const data = await response.json().catch(() => null);
  if (!data?.result) {
    throw new Error('The server returned an unexpected response. Please try again.');
  }

  return data.result;
}

export async function analyzeLiveCameraFrame(
  imageBase64: string,
  userQuestion?: string,
  language: string = 'en'
): Promise<LiveCameraAnalysis> {
  const response = await fetchWithRetry('/api/camera-frame-live', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, userQuestion, language }),
  });

  if (!response.ok) {
    throw new Error(await extractError(response, 'Failed to analyze camera frame.'));
  }

  const data = await response.json();
  return data.analysis;
}

export async function sendChatMessage(
  reportContext: ReportAnalysisResult | null,
  messages: ChatMessage[],
  userMessage: string,
  language: string = 'en'
): Promise<string> {
  const response = await fetchWithRetry('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportContext, messages, userMessage, language }),
  });

  if (!response.ok) {
    throw new Error(await extractError(response, 'Failed to get chat response.'));
  }

  const data = await response.json();
  return data.answer;
}

export async function translateReportResult(
  report: ReportAnalysisResult,
  targetLanguage: string = 'en'
): Promise<ReportAnalysisResult> {
  const response = await fetchWithRetry('/api/translate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report, targetLanguage }),
  });

  if (!response.ok) {
    throw new Error(await extractError(response, 'Failed to translate report.'));
  }

  const data = await response.json();
  return data.result;
}

export async function generateSpeechAudio(text: string): Promise<string | null> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && data.audioBase64) {
      return data.audioBase64;
    }
  } catch (err) {
    console.warn('Backend TTS call fallback to browser SpeechSynthesis', err);
  }
  return null;
}
