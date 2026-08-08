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
├── server.ts                  # Express backend proxying Gemini API calls
├── src
│   ├── App.tsx                # Main React state router & dark mode provider
│   ├── main.tsx
│   ├── index.css              # Tailwind CSS styling & print layout rules
│   ├── types.ts               # TypeScript types for reports, labs, glossary
│   ├── services
│   │   └── api.ts             # API client service for server communication
│   ├── data
│   │   ├── sampleReports.ts   # Pre-loaded sample medical reports
│   │   └── medicalGlossary.ts # Common medical terms, analogies, definitions
│   └── components
│       ├── Header.tsx text    # Apple-level navbar with theme toggle
│       ├── DisclaimerBanner.tsx # Universal non-diagnostic disclaimer
│       ├── UploadSection.tsx  # Drag & drop upload & demo selector
│       ├── LiveCameraScanner.tsx # Real-time camera scanner modal
│       ├── ReportSummaryView.tsx # Executive summary & layman guide
│       ├── LabValuesGrid.tsx  # Color-coded lab value cards & modals
│       ├── MedicalVocabulary.tsx # Searchable glossary with analogies
│       ├── AskAnythingChat.tsx # Context-aware report assistant
│       ├── DoctorPrepSection.tsx # Doctor visit checklist
│       └── PrintableReportView.tsx # Print/PDF output layout
├── tsconfig.json
└── vite.config.ts
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
# GEMINI_API_KEY: Required for Gemini API calls.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

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

## Safety & Compliance

> **Educational Disclaimer**: This application provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare professional. Never diagnose or self-medicate based on AI tools.
