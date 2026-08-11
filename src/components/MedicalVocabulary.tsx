/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Tag, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { MedicalTerm } from '../types';
import { getMedicalGlossary } from '../data/medicalGlossary';
import { Language, translations } from '../utils/i18n';

interface MedicalVocabularyProps {
  reportTerms: MedicalTerm[];
  language?: Language;
}

export const MedicalVocabulary: React.FC<MedicalVocabularyProps> = ({ reportTerms, language }) => {
  const currentLang: Language = (language === 'fr' || language === 'ar') ? language : 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[currentLang];

  const glossary = getMedicalGlossary(currentLang);

  // Merge report terms with common glossary items without duplicates
  const allTerms: MedicalTerm[] = [...reportTerms];
  
  glossary.forEach((commonTerm) => {
    if (!allTerms.some((t) => t.term.toLowerCase() === commonTerm.term.toLowerCase())) {
      allTerms.push(commonTerm);
    }
  });

  // Unique categories
  const categories = ['all', ...Array.from(new Set(allTerms.map((t) => t.category).filter(Boolean)))];

  const filteredTerms = allTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.analogy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {t.vocabularyHeader}
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              {t.vocabularySubtitle}
            </p>
          </div>

          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
            {reportTerms.length} {t.termsExtracted}
          </div>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchVocabPlaceholder}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat as string)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Medical Vocabulary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map((item, idx) => {
          const isFromReport = reportTerms.some((rt) => rt.term.toLowerCase() === item.term.toLowerCase());

          return (
            <div
              key={idx}
              className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm space-y-4 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.term}
                    </h3>
                    {isFromReport && (
                      <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t.fromReportBadge}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <span className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Definition */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-[10px] block">
                  {t.definitionLabel}
                </span>
                <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                  {item.definition}
                </p>
              </div>

              {/* Analogy */}
              {item.analogy && (
                <div className="bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 rounded-2xl text-xs space-y-1 text-blue-900 dark:text-blue-300">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 uppercase text-[10px] tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5" /> {t.everydayAnalogy}
                  </div>
                  <p className="leading-relaxed font-medium text-slate-800 dark:text-gray-200">
                    "{item.analogy}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
