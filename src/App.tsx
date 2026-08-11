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
import { ArrowLeft } from 'lucide-react';
import { analyzeReportFile, translateReportResult } from './services/api';
import { prepareFileForUpload } from './utils/fileProcessing';
import { Language, translations } from './utils/i18n';

export default function App() {
  // Keep the original analysis separate from the localized version on screen.
  // This means switching from English to French, then Arabic, always translates
  // from the original report instead of translating an already-translated copy.
  const [sourceAnalysis, setSourceAnalysis] = useState<ReportAnalysisResult | null>(null);
  const [analysis, setAnalysis] = useState<ReportAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showLiveCamera, setShowLiveCamera] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medi_explain_lang');
    return (saved === 'fr' || saved === 'ar') ? saved : 'en';
  });

  const t = translations[language];

  // Apply the selected language to every page, including browser accessibility
  // metadata and right-to-left layout. Reports are localized from their source
  // copy whenever the user changes language.
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('medi_explain_lang', language);

    if (!sourceAnalysis) return;

    let cancelled = false;
    if (sourceAnalysis.fileType === 'sample') {
      const sampleId = sourceAnalysis.id.replace('-analysis', '');
      const updatedSample = getSampleReportById(sampleId, language);
      if (updatedSample && !cancelled) setAnalysis(updatedSample.analysis);
    } else {
      translateReportResult(sourceAnalysis, language)
        .then((translated) => {
          if (translated && !cancelled) setAnalysis(translated);
        })
        .catch((err) => {
          console.warn('Failed to translate custom report:', err);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [language, sourceAnalysis]);

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
    setSourceAnalysis(sample.analysis);
    setAnalysis(sample.analysis);
    setActiveTab('summary');
    setErrorMessage(null);
  };

  // Reset application
  const handleReset = () => {
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-[#F9FAFB] font-sans transition-colors flex flex-col selection:bg-blue-500 selection:text-white">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
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
          <div className="space-y-4">
            {/* Top Navigation Back Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
                <span>{t.backToUpload}</span>
              </button>

              <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                {t.viewingLabel} <strong className="text-slate-900 dark:text-white font-serif">{analysis.fileName}</strong>
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
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>{t.footerText}</span>
        </div>
      </footer>

    </div>
  );
}
