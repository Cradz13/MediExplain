# MediExplain AI

**MediExplain AI** is an advanced full-stack medical report translation, live camera scanner, and patient education platform powered by **Gemini 3.6 Flash** and **Gemini Vision**.

It translates complex medical documents (blood work, lipid panels, comprehensive metabolic panels, radiology reports) into clear, non-medical language with analogies, color-coded lab cards, interactive medical glossaries, and doctor visit preparation checklists.

---

## Features

1. **Upload Medical Report**:
   - Drag & drop or upload PDF files, JPEGs, PNGs, or photos of medical documents.
   - Includes pre-loaded demo medical reports (Lipid Panel, Metabolic Panel) for instant testing without uploading files.

2. **Live Camera Scanner (Gemini Live Mode)**:
   - Points phone or webcam toward a physical medical report.
   - Real-time Gemini Vision analysis extracts text, tables, and notes.
   - Responds to spoken or written questions ("What does this cholesterol value mean?", "What is abnormal?", "Which values should I discuss with my doctor?").
   - Voice audio playback using Web Speech API or Gemini TTS.

3. **AI Report Summary**:
   - Executive short summary.
   - Friendly non-medical explanation with everyday analogies.
   - Bulleted key findings.
   - Safety notes and critical finding alerts.

4. **Highlight Important Values**:
   - Color-coded cards: **Green** (Normal), **Orange** (Needs Discussion), **Red** (Potentially Important / Attention).
   - Explains what each value measures, why it matters, and specific questions to ask your doctor.

5. **Medical Vocabulary & Glossary**:
   - Interactive term glossary with simple analogies (e.g., comparing kidneys to water filters, HDL to street sweepers).
   - Searchable medical terms database.

6. **Ask Anything Chat**:
   - Interactive medical assistant strictly bound to the context of the uploaded report.
   - Pre-built quick prompt pills.
   - Continuous educational non-diagnostic disclaimers.

7. **Doctor Visit Preparation**:
   - Top 10 custom questions to ask your doctor with priority tags (**High**, **Recommended**, **Standard**).
   - Key discussion points and metrics to monitor over time.
   - Personal appointment notes pad.

8. **Share & Print**:
   - Clean printable view optimized for `@media print` or exporting to doctor notes.

---

## Folder Structure

```
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts                  # Local entry point (Express + Vite middleware)
├── api
│   ├── _app.ts                # Shared Express app: all Gemini-backed routes
│   └── index.ts               # Vercel serverless entry point
├── src
│   ├── App.tsx                # Main React state router & dark mode provider
│   ├── main.tsx
│   ├── index.css              # Tailwind CSS styling & print layout rules
│   ├── types.ts               # TypeScript types for reports, labs, glossary
│   ├── services
│   │   └── api.ts             # API client service for server communication
│   ├── utils
│   │   ├── i18n.ts            # EN / FR / AR interface translations
│   │   ├── format.ts          # Defensive coercion for model-generated data
│   │   ├── fileProcessing.ts  # Client-side validation, HEIC/TIFF conversion
│   │   └── speech.ts          # Browser SpeechSynthesis voice selection
│   ├── data
│   │   ├── sampleReports.ts   # Pre-loaded sample medical reports
│   │   └── medicalGlossary.ts # Common medical terms, analogies, definitions
│   └── components
│       ├── Header.tsx         # Navbar with theme toggle, language and tabs
│       ├── DisclaimerBanner.tsx # Universal non-diagnostic disclaimer
│       ├── UploadSection.tsx  # Drag & drop upload & demo selector
│       ├── LiveCameraScanner.tsx # Real-time camera scanner modal
│       ├── ReportSummaryView.tsx # Executive summary & layman guide
│       ├── LabValuesGrid.tsx  # Color-coded lab value cards & modals
│       ├── MedicalVocabulary.tsx # Searchable glossary with analogies
│       ├── AskAnythingChat.tsx # Context-aware report assistant
│       ├── DoctorPrepSection.tsx # Doctor visit checklist
│       ├── ReportComparisonView.tsx # Trend comparison against a benchmark
│       └── PrintableReportView.tsx # Print/PDF output layout
├── tsconfig.json
└── vite.config.ts
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
# GEMINI_API_KEY: Required for Gemini API calls.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> **Note**: Uploads will fail with *"The AI service is not configured on the server"* until a valid
> `GEMINI_API_KEY` is present in `.env`. Restart the dev server after adding it.

---

## Supported Upload Formats

| Type   | Formats                                        | Notes                                              |
| ------ | ---------------------------------------------- | -------------------------------------------------- |
| PDF    | `.pdf`                                         | Sent to Gemini as-is                                |
| Images | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`      | Sent natively                                       |
| Images | `.heif`, `.tiff`, `.bmp`, `.gif`, `.avif`      | Auto-converted to JPEG in the browser               |

- Maximum source file size: **20 MB** for images, **~4 MB** for PDFs.
- Photos larger than 2200 px on the longest edge are downscaled client-side before upload,
  which keeps requests fast and well under the server body limit.
- Images are re-encoded at progressively lower quality until the request body fits under
  **3.8 MB**. Serverless hosts cap request bodies (Vercel rejects anything over 4.5 MB with
  `413: FUNCTION_PAYLOAD_TOO_LARGE` before the request reaches the app), so a 12 MB phone
  photo is compressed rather than rejected. PDFs cannot be re-compressed in the browser, so
  oversized ones are rejected up front with a clear message instead of failing at the edge.
- The MIME type is detected from the file's actual magic bytes on the server, so uploads still
  work when the browser reports an empty or incorrect type (common on iOS and Android).

---

## Installation & Setup Guide

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## Deployment (Vercel)

The API routes live in `api/_app.ts` and are shared by two entry points:

- **`server.ts`** — local/self-hosted. A long-running Express server that also serves the
  frontend (Vite middleware in dev, static `dist/` in production).
- **`api/index.ts`** — Vercel. The same Express app exported as a serverless function.

`vercel.json` builds the frontend with `vite build`, serves it from `dist/`, and rewrites
every `/api/*` request to the function. Without this the project would be detected as a
plain Vite static site, `server.ts` would never run, and **every API call would 404** no
matter how the environment variables are set.

**Required:** add `GEMINI_API_KEY` in *Project → Settings → Environment Variables* (select
Production, Preview, and Development), then **redeploy** — Vercel only applies environment
variables to builds started after they are saved. Verify with `/api/health`, which should
return `{"status":"ok"}`.

---

## Safety & Compliance

> **Educational Disclaimer**: This application provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare professional. Never diagnose or self-medicate based on AI tools.
