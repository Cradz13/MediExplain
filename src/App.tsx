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
import { Language, translations } from './utils/i18n';

export default function App() {
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

  // Sync Dark mode & Document Language & translate active analysis
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('medi_explain_lang', language);

    if (analysis) {
      if (analysis.fileType === 'sample') {
        const sampleId = analysis.id.replace('-analysis', '');
        const updatedSample = getSampleReportById(sampleId, language);
        if (updatedSample) {
          setAnalysis(updatedSample.analysis);
        }
      } else {
        translateReportResult(analysis, language)
          .then((translated) => {
            if (translated) setAnalysis(translated);
          })
          .catch((err) => {
            console.warn('Failed to translate custom report:', err);
          });
      }
    }
  }, [language]);

  // Handle local File Upload (PDF, JPG, PNG, etc.)
  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalyzingStep('Reading document and processing image/PDF bytes...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Data = reader.result as string;
        setAnalyzingStep('Gemini 3.6 Flash analyzing medical tables & terminology...');

        try {
          const result = await analyzeReportFile(
            base64Data,
            file.type || 'application/pdf',
            file.name,
            file.type.startsWith('image/') ? 'image' : 'pdf',
            language
          );

          setAnalysis(result);
          setActiveTab('summary');
        } catch (err: any) {
          console.error('Analysis error:', err);
          setErrorMessage(err.message || 'Failed to analyze medical report.');
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage('Failed to read selected file.');
        setIsAnalyzing(false);
      };
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred uploading file.');
      setIsAnalyzing(false);
    }
  };

  // Handle Camera frame process as full report
  const handleCaptureFrameAsReport = async (base64Image: string) => {
    setShowLiveCamera(false);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalyzingStep('Processing camera snapshot with Gemini Vision...');

    try {
      const result = await analyzeReportFile(
        base64Image,
        'image/jpeg',
        'Camera_Captured_Report.jpg',
        'camera_capture',
        language
      );
      setAnalysis(result);
      setActiveTab('summary');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze camera photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load sample demo report
  const handleSelectSample = (sample: SampleReport) => {
    setAnalysis(sample.analysis);
    setActiveTab('summary');
    setErrorMessage(null);
  };

  // Reset application
  const handleReset = () => {
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
                Viewing: <strong className="text-slate-900 dark:text-white font-serif">{analysis.fileName}</strong>
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
      {analysis && <PrintableReportView analysis={analysis} />}

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
          <span>MediExplain &copy; 2026. Educational Medical Report Assistant.</span>
        </div>
      </footer>

    </div>
  );
}
