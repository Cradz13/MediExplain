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
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { ReportAnalysisResult } from '../types';
import { Language, translations } from '../utils/i18n';

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

  // Audio Speech Narration for layman summary
  const toggleAudioNarration = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${analysis.shortSummary}. ${analysis.laymanExplanation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const copySummaryToClipboard = () => {
    const text = `MediExplain AI Summary - ${analysis.fileName}\n\n${analysis.shortSummary}\n\nLayman Explanation:\n${analysis.laymanExplanation}\n\nKey Findings:\n${analysis.importantFindings.map((f) => `- ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Patient & Report Metadata Header Card */}
      <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-600 text-white shrink-0 glow-blue shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-slate-900 dark:text-white">
                {analysis.patientInfo?.reportType || analysis.fileName} <span className="text-blue-600 dark:text-blue-400 font-serif italic text-xl">{t.analyzedPanel}</span>
              </h2>
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                Patient Report
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-gray-400 mt-2">
              {analysis.patientInfo?.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Report Date: {analysis.patientInfo.date}
                </span>
              )}
              {analysis.patientInfo?.laboratory && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  Facility: {analysis.patientInfo.laboratory}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                {analysis.labValues.length} Lab Tests Identified
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={toggleAudioNarration}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'bg-blue-600 text-white border-blue-600 shadow-md animate-pulse glow-blue'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            <span>{isPlayingAudio ? 'Stop Narration' : 'Listen to Summary'}</span>
          </button>

          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-gray-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Layman Explanation + Important Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Layman Explanation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Short Summary Box */}
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 dark:bg-white/[0.04] border border-blue-500/30 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Executive AI Summary
            </div>
            <p className="text-base sm:text-lg font-sans leading-relaxed text-slate-900 dark:text-white">
              "{analysis.shortSummary}"
            </p>
          </div>

          {/* Easy Non-Medical Explanation Card */}
          <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Plain Language Explanation
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Layman Guide
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-sans">
              {analysis.laymanExplanation}
            </p>
          </div>

          {/* Quick Action Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onNavigateTab('labs')}
              className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left space-y-2 group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                <span>Lab Values ({analysis.labValues.length})</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                View color-coded normal vs abnormal values
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('vocabulary')}
              className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left space-y-2 group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                <span>Medical Terms ({analysis.vocabulary.length})</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                Click any term for simple analogies
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('doctorPrep')}
              className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left space-y-2 group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                <span>Doctor Questions ({analysis.doctorPrep?.topQuestions?.length || 5})</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                Printable top questions for visit
              </p>
            </button>
          </div>

        </div>

        {/* Right Column (1 col): Key Findings & Safety Alerts */}
        <div className="space-y-6">
          
          {/* Key Findings List */}
          <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Important Findings
            </h3>

            <ul className="space-y-3">
              {analysis.importantFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5 glow-blue"></span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Alerts Box */}
          <div className="bg-amber-50 dark:bg-orange-500/10 rounded-3xl p-6 border border-amber-200 dark:border-orange-500/20 text-amber-900 dark:text-orange-300 space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 text-amber-800 dark:text-orange-400">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-orange-400 shrink-0" />
              Safety Notes & Guidelines
            </h3>

            <ul className="space-y-2 text-xs leading-relaxed dark:text-gray-300">
              {analysis.safetyAlerts.map((alert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span>&bull;</span>
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
