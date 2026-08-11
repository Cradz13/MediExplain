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
  FileSpreadsheet,
  Shield,
  Languages,
  MessageCircle
} from 'lucide-react';
import { getSampleReports, SampleReport } from '../data/sampleReports';
import { UPLOAD_ACCEPT_ATTRIBUTE } from '../utils/fileProcessing';
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
    e.stopPropagation();
    setIsDragging(false);

    if (isAnalyzing) return;

    const dt = e.dataTransfer;

    // Prefer the items API: it exposes the real File for dragged items and
    // ignores dragged text/URLs that would otherwise produce an empty upload.
    if (dt.items && dt.items.length > 0) {
      for (let i = 0; i < dt.items.length; i++) {
        const item = dt.items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            onFileUpload(file);
            return;
          }
        }
      }
    }

    if (dt.files && dt.files.length > 0) {
      onFileUpload(dt.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Reset the input so choosing the SAME file again still fires onChange.
    e.target.value = '';

    if (file) {
      onFileUpload(file);
    }
  };

  const openFilePicker = () => {
    if (isAnalyzing) return;
    fileInputRef.current?.click();
  };

  const featurePills = [
    { icon: Shield, label: t.ocrVisionBadge },
    { icon: CheckCircle2, label: t.rangeCheckBadge },
    { icon: MessageCircle, label: t.doctorPrepBadge },
    { icon: Languages, label: 'EN · FR · AR' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4 sm:py-8 px-1 animate-fade-up">
      
      {/* Hero Welcome Section */}
      <div className="text-center space-y-5 relative">
        <div className="absolute inset-x-0 -top-8 h-40 bg-gradient-to-b from-cyan-400/10 via-indigo-400/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50/90 dark:bg-cyan-500/10 border border-cyan-200/70 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{t.poweredByGemini}</span>
        </div>
        
        <h1 className="relative text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-3xl mx-auto">
          <span className="text-gradient">{t.heroTitle}</span>
        </h1>
        
        <p className="relative text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Feature chips under hero */}
        <div className="relative flex flex-wrap items-center justify-center gap-2 pt-1">
          {featurePills.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-sm"
            >
              <Icon className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Main Upload Dropzone / Processing Box */}
      {isAnalyzing ? (
        <div className="relative overflow-hidden card-elevated rounded-[1.75rem] p-10 sm:p-14 text-center space-y-7">
          <div className="absolute inset-0 shimmer opacity-60 pointer-events-none" />
          
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-pulse-ring" />
            <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 text-cyan-500 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/25 shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>
          
          <div className="relative space-y-2">
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">
              {t.analyzingReportTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {analyzingStep || t.analyzingReportStep}
            </p>
          </div>
          
          <div className="relative max-w-lg mx-auto grid grid-cols-3 gap-2.5 pt-1 text-xs">
            {[t.ocrVisionBadge, t.rangeCheckBadge, t.doctorPrepBadge].map((label) => (
              <div
                key={label}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={t.dragDropPrompt}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFilePicker();
            }
          }}
          className={`relative overflow-hidden rounded-[1.75rem] p-8 sm:p-12 border-2 border-dashed transition-all cursor-pointer group ${
            isDragging
              ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-500/10 scale-[1.01] shadow-[0_0_0_4px_rgba(6,182,212,0.12)]'
              : 'card-elevated border-slate-300/90 dark:border-white/12 hover:border-cyan-500/50'
          }`}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 end-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/8 to-transparent pointer-events-none" />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={UPLOAD_ACCEPT_ATTRIBUTE}
            className="hidden"
          />

          <div className="relative flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-gradient-to-br from-cyan-500/15 via-cyan-500/10 to-indigo-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200/70 dark:border-cyan-500/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.45)] transition-all duration-300">
              <FileUp className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {t.dragDropPrompt}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.supportedFormats}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-primary"
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-secondary"
              >
                <Camera className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                {t.takePhotoBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-300 text-xs flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Sample Reports Bar for instant testing */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </span>
            {t.demoReportsTitle}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent ms-3 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getSampleReports(language).map((sample, index) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="card-elevated rounded-3xl p-5 hover:border-cyan-500/40 transition-all cursor-pointer flex items-start gap-4 group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-indigo-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-500/20 group-hover:scale-105 group-hover:shadow-[0_8px_20px_-6px_rgba(6,182,212,0.4)] transition-all shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 overflow-hidden flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                  <span>{t.viewSampleReport}</span>
                  <span className="rtl:rotate-180">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
