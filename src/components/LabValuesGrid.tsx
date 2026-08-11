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
  ChevronRight, 
  X, 
  HelpCircle as QuestionIcon, 
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t.statusNormal}
          </span>
        );
      case 'discussion':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
            <HelpCircle className="w-3.5 h-3.5" /> {t.statusDiscussion}
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25">
            <AlertCircle className="w-3.5 h-3.5" /> {t.statusAttention}
          </span>
        );
    }
  };

  const getCardExtras = (status: LabStatus) => {
    switch (status) {
      case 'normal':
        return 'status-bar-normal hover:border-emerald-500/35';
      case 'discussion':
        return 'status-bar-discussion hover:border-amber-500/35';
      case 'attention':
        return 'status-bar-attention hover:border-red-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* Title & Filter Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-elevated p-6 rounded-[1.75rem]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            {t.labValuesHeader}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ps-[2.75rem]">
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
                ? 'tab-active'
                : 'btn-secondary'
            }`}
          >
            {t.allStatuses} ({allValues.length})
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedFilter('discussion')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'discussion'
                ? 'bg-amber-500 text-white shadow-[0_6px_18px_-4px_rgba(245,158,11,0.5)]'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20'
            }`}
          >
            {t.statusDiscussion} ({allValues.filter((v) => v.status === 'discussion').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('attention')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'attention'
                ? 'bg-red-500 text-white shadow-[0_6px_18px_-4px_rgba(239,68,68,0.5)]'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 hover:bg-red-500/20'
            }`}
          >
            {t.statusAttention} ({allValues.filter((v) => v.status === 'attention').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('normal')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'normal'
                ? 'bg-emerald-500 text-white shadow-[0_6px_18px_-4px_rgba(16,185,129,0.5)]'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20'
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
            className={`card-elevated rounded-[1.75rem] p-6 transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${getCardExtras(
              item.status
            )}`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    {item.category || t.generalCategory}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.name}
                  </h3>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Measured Value Display */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl font-data font-semibold text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.unit}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ms-auto font-data">
                  {t.refLabel} <strong className="text-slate-700 dark:text-slate-300 font-medium">{item.referenceRange}</strong>
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
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-body">
                <strong className="text-slate-800 dark:text-slate-200">{t.whatItMeasures}</strong> {item.whatItMeasures}
              </p>
            </div>

            {/* Questions to ask Doctor Preview */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/8 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-1 transition-all">
              <span>{t.viewWhyItMatters}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal Drawer */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="card-elevated rounded-[1.75rem] max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/8 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  {activeModalItem.category}
                </span>
                <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">
                  {activeModalItem.name}
                </h3>
                <div className="mt-2">{getStatusBadge(activeModalItem.status)}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-full btn-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Value summary */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/8 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.yourReportedResult}</div>
                <div className="text-2xl font-data font-semibold text-slate-900 dark:text-white">
                  {activeModalItem.value} <span className="text-xs font-body text-slate-500 dark:text-slate-400 font-medium">{activeModalItem.unit}</span>
                </div>
              </div>
              <div className="text-end">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.standardReferenceRange}</div>
                <div className="text-sm font-data font-semibold text-slate-700 dark:text-slate-300">
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-500" />
                {t.whatThisValueMeasures}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-cyan-50/70 dark:bg-cyan-500/10 p-3.5 rounded-2xl border border-cyan-100 dark:border-cyan-500/20">
                {activeModalItem.whatItMeasures}
              </p>
            </div>

            {/* Why it matters */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-500" />
                {t.whyItMattersHealth}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10">
                {activeModalItem.whyItMatters}
              </p>
            </div>

            {/* Questions to ask healthcare professional */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <QuestionIcon className="w-4 h-4 text-amber-500" />
                {t.questionsToAskDoctor}
              </h4>
              <ul className="space-y-2">
                {toArray(activeModalItem.questionsToAsk).map((q, idx) => (
                  <li key={idx} className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/20 text-xs font-medium text-amber-950 dark:text-amber-100 flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">&bull;</span>
                    <span>&ldquo;{q}&rdquo;</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-full py-3 rounded-full btn-primary text-xs font-semibold"
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
