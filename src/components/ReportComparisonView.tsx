/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GitCompare, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Sparkles, 
  FileSpreadsheet
} from 'lucide-react';
import { ReportAnalysisResult, LabValueItem } from '../types';
import { getSampleReports, SampleReport } from '../data/sampleReports';
import { Language, translations } from '../utils/i18n';
import { toArray, toNumber, toText } from '../utils/format';

interface ReportComparisonViewProps {
  currentAnalysis: ReportAnalysisResult;
  language?: Language;
}

export const ReportComparisonView: React.FC<ReportComparisonViewProps> = ({
  currentAnalysis,
  language = 'en',
}) => {
  const t = translations[language];

  // Sample reports follow the active UI language
  const sampleReports = useMemo(() => getSampleReports(language as Language), [language]);

  // Pick a comparison report (defaults to second sample report if available)
  const availableSamples = sampleReports.filter((s) => s.analysis.id !== currentAnalysis.id);
  const [selectedComparisonSampleId, setSelectedComparisonSampleId] = useState<string>(
    (availableSamples[0] || sampleReports[0])?.id || ''
  );

  const selectedComparisonSample: SampleReport | null =
    sampleReports.find((s) => s.id === selectedComparisonSampleId) ||
    availableSamples[0] ||
    sampleReports[0] ||
    null;

  // Keep the selection valid if the language (and therefore the list) changes
  useEffect(() => {
    if (!sampleReports.some((s) => s.id === selectedComparisonSampleId)) {
      setSelectedComparisonSampleId((availableSamples[0] || sampleReports[0])?.id || '');
    }
  }, [sampleReports]);

  const comparisonAnalysis = selectedComparisonSample?.analysis;

  // Compute matched lab items.
  //
  // Every field here is model-generated, so names, values and units are coerced
  // to text before any string comparison: a numeric `value` used to crash this
  // whole tab on `.replace()`.
  const matchedValues = toArray(currentAnalysis.labValues).map((curr) => {
    const currName = toText(curr.name);

    const prev = toArray(comparisonAnalysis?.labValues).find(
      (p) =>
        toText(p.name).toLowerCase() === currName.toLowerCase() ||
        (Boolean(curr.category) && toText(p.category) === toText(curr.category))
    );

    const currNum = toNumber(curr.value);
    const prevNum = prev ? toNumber(prev.value) : NaN;

    let deltaStr = t.notAvailableShort;
    let trend: 'improved' | 'elevated' | 'same' | 'unknown' = 'unknown';

    if (!isNaN(currNum) && !isNaN(prevNum)) {
      const delta = currNum - prevNum;
      deltaStr = `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${toText(curr.unit)}`;

      const lowerName = currName.toLowerCase();

      if (curr.status === 'normal' && prev?.status !== 'normal') {
        trend = 'improved';
      } else if (curr.status !== 'normal' && prev?.status === 'normal') {
        trend = 'elevated';
      } else if (Math.abs(delta) < 0.1) {
        trend = 'same';
      } else if (
        delta < 0 &&
        (lowerName.includes('cholesterol') ||
          lowerName.includes('ldl') ||
          lowerName.includes('triglycerides') ||
          lowerName.includes('hba1c'))
      ) {
        trend = 'improved'; // Lower is better for LDL / Glucose / HbA1c
      } else if (delta > 0 && lowerName.includes('hdl')) {
        trend = 'improved'; // Higher is better for HDL
      } else if (delta > 0) {
        trend = 'elevated';
      } else {
        trend = 'improved';
      }
    }

    return {
      current: curr,
      previous: prev,
      deltaStr,
      trend,
    };
  });

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* Top Banner & Selector */}
      <div className="card-elevated rounded-[1.75rem] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200/70 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-2.5">
              <GitCompare className="w-3.5 h-3.5" />
              <span>{t.historicalTrendBadge}</span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">
              {t.compareLabTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {t.compareLabSubtitle}
            </p>
          </div>

          {/* Select Comparison Benchmark */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ps-2 shrink-0">{t.compareWithLabel}</span>
            <select
              value={selectedComparisonSample?.id || ''}
              onChange={(e) => setSelectedComparisonSampleId(e.target.value)}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              {sampleReports.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.title} ({sample.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Health Progress Summary Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/90 via-white to-indigo-50/60 dark:from-cyan-950/30 dark:via-white/[0.03] dark:to-indigo-950/20 border border-cyan-200/60 dark:border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-[0.14em]">
            <Sparkles className="w-4 h-4 text-cyan-500" /> {t.keyComparisonInsights}
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-body">
            {t.comparingWord} <strong className="text-cyan-700 dark:text-cyan-400">{currentAnalysis.fileName}</strong> {t.againstWord} <strong className="text-indigo-600 dark:text-indigo-400">{comparisonAnalysis?.fileName || t.previousTestLabel}</strong>. {t.outOfWord} {matchedValues.length} {t.comparisonSummaryTail}
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards / Table */}
      <div className="card-elevated rounded-[1.75rem] p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-display">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <FileSpreadsheet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </span>
          {t.sideBySideTitle}
        </h3>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] text-[10px] font-bold">
                <th className="py-3 px-4 text-start">{t.thLabParameter}</th>
                <th className="py-3 px-4 text-start">{t.currentValueLabel} ({currentAnalysis.patientInfo?.date || t.todayLabel})</th>
                <th className="py-3 px-4 text-start">{t.previousValueLabel} ({comparisonAnalysis?.patientInfo?.date || t.priorLabel})</th>
                <th className="py-3 px-4 text-start">{t.differenceLabel}</th>
                <th className="py-3 px-4 text-start">{t.thProgressTrend}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-body">
              {matchedValues.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                    <div>{item.current.name}</div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal font-data">{t.refLabel} {item.current.referenceRange} {item.current.unit}</span>
                  </td>
                  
                  {/* Current Value */}
                  <td className="py-4 px-4 font-data font-semibold text-slate-900 dark:text-white">
                    {item.current.value} <span className="text-[11px] font-body font-normal text-slate-500">{item.current.unit}</span>
                  </td>

                  {/* Previous Value */}
                  <td className="py-4 px-4 font-data text-slate-600 dark:text-slate-400">
                    {item.previous ? `${item.previous.value} ${item.previous.unit}` : t.notAvailableShort}
                  </td>

                  {/* Delta */}
                  <td className="py-4 px-4 font-data font-semibold text-slate-700 dark:text-slate-300">
                    {item.deltaStr}
                  </td>

                  {/* Trend Indicator Badge */}
                  <td className="py-4 px-4">
                    {item.trend === 'improved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                        <TrendingDown className="w-3.5 h-3.5" /> {t.trendImproved}
                      </span>
                    )}
                    {item.trend === 'elevated' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                        <TrendingUp className="w-3.5 h-3.5" /> {t.trendElevated}
                      </span>
                    )}
                    {item.trend === 'same' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                        <Minus className="w-3.5 h-3.5" /> {t.trendStable}
                      </span>
                    )}
                    {item.trend === 'unknown' && (
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">{t.baselineLabel}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
