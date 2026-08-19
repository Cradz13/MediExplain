/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { UploadSection } from './components/UploadSection';
import { LiveCameraScanner } from './components/LiveCameraScanner';
import { ReportSummaryView } from './components/ReportSummaryView';
import { LabValuesGrid } from './components/LabValuesGrid';
import { MedicalVocabulary } from './components/MedicalVocabulary';
import { AskAnythingChat } from './components/AskAnythingChat';
import { DoctorPrepSection } from './components/DoctorPrepSection';
import { PrintableReportView } from './components/PrintableReportView';
import { ReportComparisonView } from './components/ReportComparisonView';
import { ReportAnalysisResult } from './types';
import { getSampleReports, getSampleReportById, SampleReport } from './data/sampleReports';
import { ArrowLeft, Loader2, FileText, Instagram, ExternalLink } from 'lucide-react';
import { analyzeReportFile, translateReportResult } from './services/api';
import { prepareFileForUpload } from './utils/fileProcessing';
import { Language, translations } from './utils/i18n';
import { Analytics } from '@vercel/analytics/react';

const INSTAGRAM_URL = 'https://www.instagram.com/medi.explain/';

export default function App() {
  // Keep the original analysis separate from the localized version on screen.
  // This means switching from English to French, then Arabic, always translates
  // from the original report instead of translating an already-translated copy.
  const [sourceAnalysis, setSourceAnalysis] = useState<ReportAnalysisResult | null>(null);
  // Language the source analysis was actually produced in. The report is
  // already written in the language selected at upload time, so re-translating
  // it into that same language is a wasted (billed) round-trip that can only
  // degrade the original wording.
  const [sourceLanguage, setSourceLanguage] = useState<Language>('en');
  const [analysis, setAnalysis] = useState<ReportAnalysisResult | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('medi_explain_theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    // No stored choice yet: follow the operating system preference.
    return !window.matchMedia?.('(prefers-color-scheme: light)').matches;
  });
  const [showLiveCamera, setShowLiveCamera] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medi_explain_lang');
    return (saved === 'fr' || saved === 'ar') ? saved : 'en';
  });

  const t = translations[language];

  // The whole UI is styled with Tailwind `dark:` variants, which key off this
  // class. It used to be added unconditionally, so the light theme (and the
  // toggle that selects it) could never actually be shown.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('medi_explain_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Apply the selected language to every page, including browser accessibility
  // metadata and right-to-left layout. Reports are localized from their source
  // copy whenever the user changes language.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('medi_explain_lang', language);

    if (!sourceAnalysis) return;

    let cancelled = false;

    if (sourceAnalysis.fileType === 'sample') {
      // Samples ship pre-translated; just swap in the localized copy.
      const sampleId = sourceAnalysis.id.replace('-analysis', '');
      const updatedSample = getSampleReportById(sampleId, language);
      if (updatedSample && !cancelled) setAnalysis(updatedSample.analysis);
      return () => {
        cancelled = true;
      };
    }

    // The analysis was generated in this language already - nothing to do.
    if (language === sourceLanguage) {
      setAnalysis(sourceAnalysis);
      return () => {
        cancelled = true;
      };
    }

    setIsTranslating(true);
    translateReportResult(sourceAnalysis, language)
      .then((translated) => {
        if (translated && !cancelled) setAnalysis(translated);
      })
      .catch((err) => {
        console.warn('Failed to translate custom report:', err);
        // Keep showing the untranslated report rather than a blank screen.
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, sourceAnalysis, sourceLanguage]);

  // Handle local File Upload (PDF, JPG, PNG, HEIC, etc.)
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalyzingStep(t.stepReadingFile);

    try {
      // Validate, decode, and normalize the file (converts HEIC/TIFF/etc. to
      // JPEG and downscales oversized phone photos) before hitting the API.
      const prepared = await prepareFileForUpload(file, (stage) => {
        setAnalyzingStep(stage === 'optimizing' ? t.stepOptimizingImage : t.stepReadingFile);
      });

      setAnalyzingStep(t.stepAnalyzing);

      const result = await analyzeReportFile(
        prepared.dataUrl,
        prepared.mimeType,
        prepared.fileName,
        prepared.kind,
        language
      );

      setSourceLanguage(language);
      setSourceAnalysis(result);
      setAnalysis(result);
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Upload/analysis error:', err);

      // Validation failures surface as short codes we can localize.
      const code = err?.message;
      if (code === 'unsupportedType') {
        setErrorMessage(t.errorUnsupportedType);
      } else if (code === 'tooLarge') {
        setErrorMessage(t.errorFileTooLarge);
      } else if (code === 'pdfTooLarge') {
        setErrorMessage(t.errorPdfTooLarge);
      } else if (code === 'empty') {
        setErrorMessage(t.errorEmptyFile);
      } else if (typeof code === 'string' && code.toLowerCase().includes('filereader')) {
        setErrorMessage(t.errorReadFailed);
      } else {
        setErrorMessage(code || t.errorAnalyzeFailed);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Camera frame process as full report
  const handleCaptureFrameAsReport = async (base64Image: string) => {
    setShowLiveCamera(false);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalyzingStep(t.stepAnalyzing);

    try {
      const result = await analyzeReportFile(
        base64Image,
        'image/jpeg',
        'Camera_Captured_Report.jpg',
        'camera_capture',
        language
      );
      setSourceLanguage(language);
      setSourceAnalysis(result);
      setAnalysis(result);
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Camera analysis error:', err);
      setErrorMessage(err.message || t.errorAnalyzeFailed);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load sample demo report
  const handleSelectSample = (sample: SampleReport) => {
    setSourceLanguage(language);
    setSourceAnalysis(sample.analysis);
    setAnalysis(sample.analysis);
    setActiveTab('summary');
    setErrorMessage(null);
  };

  // Reset application
  const handleReset = () => {
    setSourceLanguage(language);
    setSourceAnalysis(null);
    setAnalysis(null);
    setActiveTab('summary');
    setErrorMessage(null);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen app-mesh text-slate-900 dark:text-slate-100 font-body transition-colors flex flex-col selection:bg-cyan-500/30">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onSelectSample={handleSelectSample}
        onOpenLiveCamera={() => setShowLiveCamera(true)}
        onReset={handleReset}
        onPrint={handlePrint}
        hasReport={Boolean(analysis)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Universal Safety Disclaimer Banner */}
        <DisclaimerBanner hasCriticalFindings={analysis?.hasCriticalFindings} language={language} />

        {/* View Router */}
        {!analysis ? (
          <UploadSection
            onFileUpload={handleFileUpload}
            onSelectSample={handleSelectSample}
            onOpenLiveCamera={() => setShowLiveCamera(true)}
            isAnalyzing={isAnalyzing}
            analyzingStep={analyzingStep}
            errorMessage={errorMessage}
            language={language}
          />
        ) : (
          <div className="space-y-5 animate-fade-up">
            {/* Top Navigation Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary text-xs font-semibold shadow-sm group cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:translate-x-1 rtl:group-hover:-translate-x-0" />
                <span>{t.backToUpload}</span>
              </button>

              <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium px-3 py-2 rounded-2xl glass">
                {isTranslating ? (
                  <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.translatingReport}
                  </span>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>
                      {t.viewingLabel}{' '}
                      <strong className="text-slate-900 dark:text-white font-display font-medium">{analysis.fileName}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>

            {activeTab === 'summary' && (
              <ReportSummaryView analysis={analysis} onNavigateTab={setActiveTab} language={language} />
            )}

            {activeTab === 'labs' && (
              <LabValuesGrid labValues={analysis.labValues} language={language} />
            )}

            {activeTab === 'compare' && (
              <ReportComparisonView currentAnalysis={analysis} language={language} />
            )}

            {activeTab === 'vocabulary' && (
              <MedicalVocabulary reportTerms={analysis.vocabulary} language={language} />
            )}

            {activeTab === 'chat' && (
              <AskAnythingChat reportContext={analysis} language={language} />
            )}

            {activeTab === 'doctorPrep' && (
              <DoctorPrepSection doctorPrep={analysis.doctorPrep} onPrint={handlePrint} language={language} />
            )}
          </div>
        )}

      </main>

      {/* Printable Report Hidden Container */}
      {analysis && <PrintableReportView analysis={analysis} language={language} />}

      {/* Live Camera Scanner Modal */}
      {showLiveCamera && (
        <LiveCameraScanner
          onClose={() => setShowLiveCamera(false)}
          onCaptureFrameAsReport={handleCaptureFrameAsReport}
          language={language}
        />
      )}

      {/* Footer */}
      <footer className="relative mt-auto border-t border-slate-200/80 dark:border-white/8 bg-white/40 dark:bg-black/30 backdrop-blur-xl py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 opacity-80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
              {t.brandTitle}
            </span>
          </div>
          <span className="max-w-xl leading-relaxed">{t.footerText}</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.followOnInstagram}: @medi.explain`}
            className="group inline-flex items-center gap-3 rounded-full border border-pink-200/90 bg-white/70 px-4 py-2 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-md dark:border-pink-400/20 dark:bg-white/5 dark:hover:border-pink-400/40"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-pink-500 to-amber-400 text-white shadow-sm">
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {t.followOnInstagram}
              </span>
              <span className="mt-0.5 text-sm font-bold text-slate-800 dark:text-white">@medi.explain</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0" aria-hidden="true" />
          </a>
        </div>
      </footer>

      {/* Vercel Web Analytics (production tracking, no-op locally) */}
      <Analytics />

    </div>
  );
}
