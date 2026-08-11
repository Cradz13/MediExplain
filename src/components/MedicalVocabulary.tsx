/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Lightbulb
} from 'lucide-react';
import { MedicalTerm } from '../types';
import { getMedicalGlossary } from '../data/medicalGlossary';
import { Language, translations } from '../utils/i18n';
import { toArray, toText } from '../utils/format';

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
  // `reportTerms` is model-generated and can be missing on a sparse analysis.
  const termsFromReport: MedicalTerm[] = toArray(reportTerms).filter(
    (term): term is MedicalTerm => Boolean(term) && typeof term === 'object'
  );
  const allTerms: MedicalTerm[] = [...termsFromReport];
  
  glossary.forEach((commonTerm) => {
    if (!allTerms.some((t) => toText(t.term).toLowerCase() === toText(commonTerm.term).toLowerCase())) {
      allTerms.push(commonTerm);
    }
  });

  // Unique categories
  const categories = ['all', ...Array.from(new Set(allTerms.map((t) => t.category).filter(Boolean)))];

  const filteredTerms = allTerms.filter((term) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      toText(term.term).toLowerCase().includes(query) ||
      toText(term.definition).toLowerCase().includes(query) ||
      toText(term.analogy).toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* Search & Filter Header Bar */}
      <div className="card-elevated rounded-[1.75rem] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <BookOpen className="w-4 h-4" />
              </span>
              {t.vocabularyHeader}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ps-[2.75rem]">
              {t.vocabularySubtitle}
            </p>
          </div>

          <div className="text-xs text-cyan-700 dark:text-cyan-300 font-semibold bg-cyan-50 dark:bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-200/70 dark:border-cyan-500/25">
            {termsFromReport.length} {t.termsExtracted}
          </div>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchVocabPlaceholder}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full ps-10 pe-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                    ? 'tab-active'
                    : 'btn-secondary'
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
          const isFromReport = termsFromReport.some(
            (rt) => toText(rt.term).toLowerCase() === toText(item.term).toLowerCase()
          );

          return (
            <div
              key={idx}
              className="card-elevated rounded-[1.75rem] p-6 space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-white/8 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.term}
                    </h3>
                    {isFromReport && (
                      <span className="text-[10px] font-bold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t.fromReportBadge}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Definition */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] text-[10px] block">
                  {t.definitionLabel}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item.definition}
                </p>
              </div>

              {/* Analogy */}
              {item.analogy && (
                <div className="bg-gradient-to-br from-cyan-50/90 to-indigo-50/50 dark:from-cyan-500/10 dark:to-indigo-500/5 border border-cyan-100 dark:border-cyan-500/20 p-4 rounded-2xl text-xs space-y-1.5 text-cyan-950 dark:text-cyan-100">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-700 dark:text-cyan-300 uppercase text-[10px] tracking-[0.12em]">
                    <Lightbulb className="w-3.5 h-3.5" /> {t.everydayAnalogy}
                  </div>
                  <p className="leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                    &ldquo;{item.analogy}&rdquo;
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
