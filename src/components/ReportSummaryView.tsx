/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  Building2, 
  Activity,
  Heart,
  Copy,
  Check,
  MessageSquare,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { ReportAnalysisResult } from '../types';
import { Language, translations } from '../utils/i18n';
import { speak, cancelSpeech, isSpeechSupported } from '../utils/speech';
import { toArray } from '../utils/format';

interface ReportSummaryViewProps {
  analysis: ReportAnalysisResult;
  onNavigateTab: (tab: string) => void;
  language?: Language;
}

export const ReportSummaryView: React.FC<ReportSummaryViewProps> = ({
  analysis,
  onNavigateTab,
  language = 'en',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  // Model responses can omit whole sections, so every list is normalized before
  // it is counted or mapped over.
  const labValues = toArray(analysis.labValues);
  const vocabulary = toArray(analysis.vocabulary);
  const importantFindings = toArray(analysis.importantFindings);
  const safetyAlerts = toArray(analysis.safetyAlerts);
  const topQuestions = toArray(analysis.doctorPrep?.topQuestions);

  // Audio Speech Narration for layman summary
  const toggleAudioNarration = () => {
    if (!isSpeechSupported()) return;

    if (isPlayingAudio) {
      cancelSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${analysis.shortSummary}. ${analysis.laymanExplanation}`;

    speak(textToSpeak, language, {
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const copySummaryToClipboard = () => {
    const text = `MediExplain - ${analysis.fileName}\n\n${analysis.shortSummary}\n\n${t.plainLanguageExplanation}\n${analysis.laymanExplanation}\n\n${t.importantFindingsTitle}\n${importantFindings.map((f) => `- ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* Patient & Report Metadata Header Card */}
      <div className="relative overflow-hidden card-elevated rounded-[1.75rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 end-0 w-56 h-56 bg-gradient-to-bl from-cyan-400/10 to-transparent pointer-events-none" />
        
        <div className="relative flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shrink-0 shadow-[0_10px_28px_-6px_rgba(6,182,212,0.55)] ring-1 ring-white/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-slate-900 dark:text-white tracking-tight">
                {analysis.patientInfo?.reportType || analysis.fileName}{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-display italic font-medium text-xl">
                  {t.analyzedPanel}
                </span>
              </h2>
              <span className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-400/25 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.12em] shrink-0">
                {t.patientReportBadge}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
              {analysis.patientInfo?.date && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  {t.reportDateLabel} {analysis.patientInfo.date}
                </span>
              )}
              {analysis.patientInfo?.laboratory && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8">
                  <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                  {t.facilityLabel} {analysis.patientInfo.laboratory}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8">
                <Activity className="w-3.5 h-3.5 text-cyan-500" />
                {labValues.length} {t.labTestsIdentified}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="relative flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={toggleAudioNarration}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'btn-primary border-transparent animate-pulse'
                : 'btn-secondary'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
            <span>{isPlayingAudio ? t.stopNarration : t.listenToSummary}</span>
          </button>

          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold btn-secondary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            <span>{copied ? t.copiedLabel : t.copyLabel}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Layman Explanation + Important Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Layman Explanation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Short Summary Box */}
          <div className="relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8 space-y-3 border border-cyan-500/25 dark:border-cyan-400/20 bg-gradient-to-br from-cyan-50/90 via-white to-indigo-50/60 dark:from-cyan-950/40 dark:via-slate-900/40 dark:to-indigo-950/30">
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-2 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-[0.14em]">
              <span className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              {t.executiveAiSummary}
            </div>
            <p className="relative text-base sm:text-lg font-body leading-relaxed text-slate-900 dark:text-white">
              &ldquo;{analysis.shortSummary}&rdquo;
            </p>
          </div>

          {/* Easy Non-Medical Explanation Card */}
          <div className="card-elevated rounded-[1.75rem] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                  <Heart className="w-4 h-4" />
                </span>
                {t.plainLanguageExplanation}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] shrink-0">
                {t.laymanGuideBadge}
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-body">
              {analysis.laymanExplanation}
            </p>
          </div>

          {/* Quick Action Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onNavigateTab('labs')}
              className="card-elevated p-5 rounded-2xl hover:border-cyan-500/45 transition-all text-start space-y-2 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </span>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center justify-between flex-1 gap-2">
                  <span>{t.labValuesLabel} ({labValues.length})</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 ps-[2.625rem]">
                {t.labValuesHint}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('vocabulary')}
              className="card-elevated p-5 rounded-2xl hover:border-cyan-500/45 transition-all text-start space-y-2 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center justify-between flex-1 gap-2">
                  <span>{t.medicalTermsLabel} ({vocabulary.length})</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 ps-[2.625rem]">
                {t.medicalTermsHint}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('doctorPrep')}
              className="card-elevated p-5 rounded-2xl hover:border-cyan-500/45 transition-all text-start space-y-2 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-4 h-4" />
                </span>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center justify-between flex-1 gap-2">
                  <span>{t.doctorQuestionsLabel} ({topQuestions.length})</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 ps-[2.625rem]">
                {t.doctorQuestionsHint}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('chat')}
              className="relative overflow-hidden p-5 rounded-2xl btn-primary text-start space-y-2 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> {t.tabAskAnything}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </div>
              <p className="relative text-[11px] text-cyan-50/90">
                {t.askAnythingHint}
              </p>
            </button>
          </div>

        </div>

        {/* Right Column (1 col): Key Findings & Safety Alerts */}
        <div className="space-y-6">
          
          {/* Key Findings List */}
          <div className="card-elevated rounded-[1.75rem] p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </span>
              {t.importantFindingsTitle}
            </h3>

            <ul className="space-y-3">
              {importantFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Alerts Box */}
          <div className="rounded-[1.75rem] p-6 border border-amber-200/80 dark:border-amber-500/25 bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/10 dark:to-orange-500/5 text-amber-950 dark:text-amber-100 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.14em] font-bold flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              {t.safetyNotesTitle}
            </h3>

            <ul className="space-y-2.5 text-xs leading-relaxed dark:text-slate-300">
              {safetyAlerts.map((alert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">&bull;</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
