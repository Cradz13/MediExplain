/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileUp, 
  Camera, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { SAMPLE_REPORTS, SampleReport } from '../data/sampleReports';
import { Language, translations } from '../utils/i18n';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  onSelectSample: (sample: SampleReport) => void;
  onOpenLiveCamera: () => void;
  isAnalyzing: boolean;
  analyzingStep?: string;
  errorMessage?: string | null;
  language: Language;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileUpload,
  onSelectSample,
  onOpenLiveCamera,
  isAnalyzing,
  analyzingStep,
  errorMessage,
  language,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      
      {/* Hero Welcome Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Powered by Gemini 3.6 Flash & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Main Upload Dropzone / Processing Box */}
      {isAnalyzing ? (
        <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-10 sm:p-14 border border-blue-500/30 shadow-2xl text-center space-y-6 backdrop-blur-md">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping opacity-75"></div>
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-slate-900 dark:text-white">
              {t.analyzingReportTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-md mx-auto">
              {analyzingStep || t.analyzingReportStep}
            </p>
          </div>
          
          <div className="max-w-md mx-auto grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>OCR & Vision</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Range Check</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Doctor Prep</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative bg-white dark:bg-white/[0.03] rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all cursor-pointer shadow-xl group ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-white/10 hover:border-blue-500/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileUp className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {t.dragDropPrompt}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {t.supportedFormats}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <Upload className="w-4 h-4" />
                {t.uploadPdfBtn}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLiveCamera();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-800 dark:text-gray-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
              >
                <Camera className="w-4 h-4 text-blue-500" />
                {t.takePhotoBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample Reports Bar for instant testing */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            {t.demoReportsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_REPORTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="bg-white dark:bg-white/[0.03] rounded-3xl p-5 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-start gap-4 group"
            >
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">
                  {sample.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  <span>{t.viewSampleReport}</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
