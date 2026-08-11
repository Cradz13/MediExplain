/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Camera, 
  Printer, 
  FileText, 
  Sparkles,
  ChevronDown,
  RotateCcw,
  BookOpen,
  MessageSquare,
  ClipboardList,
  Activity,
  GitCompare,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { getSampleReports, SampleReport } from '../data/sampleReports';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../utils/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onSelectSample: (sample: SampleReport) => void;
  onOpenLiveCamera: () => void;
  onReset: () => void;
  onPrint: () => void;
  hasReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  onSelectSample,
  onOpenLiveCamera,
  onReset,
  onPrint,
  hasReport,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'summary', label: t.tabSummary, icon: FileText },
    { id: 'labs', label: t.tabLabValues, icon: Activity },
    { id: 'compare', label: t.tabCompare, icon: GitCompare },
    { id: 'vocabulary', label: t.tabVocabulary, icon: BookOpen },
    { id: 'chat', label: t.tabAskAnything, icon: MessageSquare },
    { id: 'doctorPrep', label: t.tabDoctorPrep, icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5 shrink-0 cursor-pointer" onClick={() => setActiveTab('summary')}>
            <BrandLogo className="w-10 h-10" iconClassName="w-5 h-5" alt={t.brandTitle} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t.brandTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 hidden sm:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Action Tools & Controllers */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Button */}
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
              title={darkMode ? t.lightMode : t.darkMode}
              aria-label={darkMode ? t.lightMode : t.darkMode}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Sample Reports Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">{t.tryDemoReport}</span>
                <span className="sm:hidden">{t.demos}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showSampleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                    {t.selectSampleReport}
                  </div>
                  {getSampleReports(language).map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        onSelectSample(sample);
                        setShowSampleDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-white/5 transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-white">
                        {sample.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                        {sample.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Camera Scanner Launcher */}
            <button
              type="button"
              onClick={onOpenLiveCamera}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.liveCameraScanner}</span>
              <span className="md:hidden">{t.camera}</span>
            </button>

            {hasReport && (
              <>
                {/* Back / Upload New Report Button */}
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
                  title={t.backToUpload}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">{t.backToUpload}</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={onPrint}
                  className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
                  title={t.printReport}
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu (Visible when report exists) */}
        {hasReport && (
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2.5 border-t border-slate-100 dark:border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
