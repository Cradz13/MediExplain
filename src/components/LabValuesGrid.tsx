/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Filter, 
  ChevronRight, 
  X, 
  HelpCircle as QuestionIcon, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { LabValueItem, LabStatus } from '../types';
import { LabRangeGauge } from './LabRangeGauge';
import { Language, translations } from '../utils/i18n';
import { toArray } from '../utils/format';

interface LabValuesGridProps {
  labValues: LabValueItem[];
  language?: Language;
}

export const LabValuesGrid: React.FC<LabValuesGridProps> = ({ labValues, language = 'en' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'normal' | 'discussion' | 'attention'>('all');
  const [activeModalItem, setActiveModalItem] = useState<LabValueItem | null>(null);
  const t = translations[language];

  // `labValues` comes from a model response, so it may be missing entirely.
  const allValues = toArray(labValues);

  const filteredValues = allValues.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  const getStatusBadge = (status: LabStatus) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t.statusNormal}
          </span>
        );
      case 'discussion':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> {t.statusDiscussion}
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> {t.statusAttention}
          </span>
        );
    }
  };

  const getCardBorder = (status: LabStatus) => {
    switch (status) {
      case 'normal':
        return 'border-emerald-500/20 hover:border-emerald-500/40 bg-white dark:bg-white/[0.03]';
      case 'discussion':
        return 'border-orange-500/20 hover:border-orange-500/40 bg-white dark:bg-white/[0.03]';
      case 'attention':
        return 'border-red-500/30 hover:border-red-500/50 bg-white dark:bg-white/[0.03]';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Filter Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-500" />
            {t.labValuesHeader}
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            {t.labValuesSubtitle}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {t.allStatuses} ({allValues.length})
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedFilter('discussion')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'discussion'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20'
            }`}
          >
            {t.statusDiscussion} ({allValues.filter((v) => v.status === 'discussion').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('attention')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'attention'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            {t.statusAttention} ({allValues.filter((v) => v.status === 'attention').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('normal')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {t.statusNormal} ({allValues.filter((v) => v.status === 'normal').length})
          </button>
        </div>
      </div>

      {/* Grid of Lab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredValues.map((item, idx) => (
          <div
            key={item.id || `${item.name}-${idx}`}
            onClick={() => setActiveModalItem(item)}
            className={`rounded-3xl p-6 border shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${getCardBorder(
              item.status
            )}`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                    {item.category || t.generalCategory}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h3>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Measured Value Display */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                  {item.unit}
                </span>
                <span className="text-xs text-slate-400 dark:text-gray-500 ml-auto font-mono">
                  {t.refLabel} <strong className="text-slate-700 dark:text-gray-300">{item.referenceRange}</strong>
                </span>
              </div>

              {/* Compact Visual Range Spectrum */}
              <LabRangeGauge
                valueStr={item.value}
                referenceRangeStr={item.referenceRange}
                unit={item.unit}
                status={item.status}
                compact={true}
                language={language}
              />

              {/* Explanatory summary preview */}
              <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-sans">
                <strong>{t.whatItMeasures}</strong> {item.whatItMeasures}
              </p>
            </div>

            {/* Questions to ask Doctor Preview */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>{t.viewWhyItMatters}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal Drawer */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                  {activeModalItem.category}
                </span>
                <h3 className="text-2xl font-serif text-slate-900 dark:text-white">
                  {activeModalItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:hover:border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Value summary */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-gray-400">{t.yourReportedResult}</div>
                <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {activeModalItem.value} <span className="text-xs font-sans text-slate-500 dark:text-gray-400">{activeModalItem.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-gray-400">{t.standardReferenceRange}</div>
                <div className="text-sm font-mono font-semibold text-slate-700 dark:text-gray-300">
                  {activeModalItem.referenceRange} {activeModalItem.unit}
                </div>
              </div>
            </div>

            {/* Detailed Visual Spectrum Gauge */}
            <LabRangeGauge
              valueStr={activeModalItem.value}
              referenceRangeStr={activeModalItem.referenceRange}
              unit={activeModalItem.unit}
              status={activeModalItem.status}
              compact={false}
              language={language}
            />

            {/* What it measures */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" />
                {t.whatThisValueMeasures}
              </h4>
              <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed bg-blue-50/50 dark:bg-blue-500/10 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                {activeModalItem.whatItMeasures}
              </p>
            </div>

            {/* Why it matters */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-500" />
                {t.whyItMattersHealth}
              </h4>
              <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10">
                {activeModalItem.whyItMatters}
              </p>
            </div>

            {/* Questions to ask healthcare professional */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <QuestionIcon className="w-4 h-4 text-amber-500" />
                {t.questionsToAskDoctor}
              </h4>
              <ul className="space-y-2">
                {toArray(activeModalItem.questionsToAsk).map((q, idx) => (
                  <li key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-orange-500/10 border border-amber-200/60 dark:border-orange-500/20 text-xs font-medium text-amber-900 dark:text-orange-200 flex items-start gap-2">
                    <span className="text-amber-600 dark:text-orange-400 font-bold">&bull;</span>
                    <span>"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {t.closeBreakdown}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
