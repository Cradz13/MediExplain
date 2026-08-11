/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language, translations } from '../utils/i18n';
import { toText } from '../utils/format';

interface LabRangeGaugeProps {
  valueStr: string;
  referenceRangeStr: string;
  unit: string;
  status: 'normal' | 'discussion' | 'attention';
  compact?: boolean;
  language?: Language;
}

export const LabRangeGauge: React.FC<LabRangeGaugeProps> = ({
  valueStr,
  referenceRangeStr,
  unit,
  status,
  compact = false,
  language = 'en',
}) => {
  const t = translations[language];

  // The analysis is model-generated, so a lab result can arrive as a number
  // (`238`) rather than a string (`"238"`), and the reference range can be
  // missing entirely. Coerce both before any string work: calling `.replace()`
  // on a number used to crash the whole Lab Values tab.
  const safeValue = toText(valueStr);
  const safeRange = toText(referenceRangeStr);
  const safeUnit = toText(unit);

  // Parse numerical value
  const numVal = parseFloat(safeValue.replace(/[^0-9.]/g, ''));
  if (isNaN(numVal)) return null;

  // Parse reference range
  let minRef = 0;
  let maxRef = 100;
  let isLessThanType = false;
  let isGreaterThanType = false;

  const rangeClean = safeRange.trim();
  if (rangeClean.includes('-')) {
    const parts = rangeClean.split('-').map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      minRef = parts[0];
      maxRef = parts[1];
    }
  } else if (rangeClean.startsWith('<')) {
    isLessThanType = true;
    maxRef = parseFloat(rangeClean.replace(/[^0-9.]/g, '')) || 100;
    minRef = 0;
  } else if (rangeClean.startsWith('>')) {
    isGreaterThanType = true;
    minRef = parseFloat(rangeClean.replace(/[^0-9.]/g, '')) || 0;
    maxRef = minRef * 2.5 || 100;
  }

  // Determine relative position (0% to 100%) on the visual spectrum bar
  let percent = 50;
  if (isLessThanType) {
    percent = Math.min(100, Math.max(0, (numVal / (maxRef * 1.5)) * 100));
  } else if (isGreaterThanType) {
    percent = Math.min(100, Math.max(0, (numVal / (minRef * 1.8)) * 100));
  } else {
    const rangeSpan = maxRef - minRef;
    if (rangeSpan > 0) {
      // Add padding buffer on both ends (25% buffer)
      const buffer = rangeSpan * 0.4;
      const displayMin = Math.max(0, minRef - buffer);
      const displayMax = maxRef + buffer;
      percent = Math.min(95, Math.max(5, ((numVal - displayMin) / (displayMax - displayMin)) * 100));
    }
  }

  const getPinColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500 border-white dark:border-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.55)]';
      case 'discussion':
        return 'bg-amber-500 border-white dark:border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.55)]';
      case 'attention':
        return 'bg-red-500 border-white dark:border-red-200 shadow-[0_0_12px_rgba(239,68,68,0.55)]';
    }
  };

  if (compact) {
    return (
      <div className="w-full space-y-1.5 pt-1">
        <div className="relative h-2.5 w-full bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden flex">
          {/* Low / Normal / High zones */}
          <div className="w-1/4 bg-slate-200/80 dark:bg-slate-700/40" />
          <div className="w-1/2 bg-emerald-500/25 dark:bg-emerald-500/30 border-x border-emerald-500/25" />
          <div className="w-1/4 bg-amber-500/20 dark:bg-amber-500/25" />
          
          {/* Result Pin */}
          <div
            className={`absolute top-0 bottom-0 w-2.5 rounded-full -ms-1 border-2 transition-all ${getPinColor()}`}
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-data">
          <span>{t.lowLabel}</span>
          <span>{t.normalLabel} ({safeRange})</span>
          <span>{t.highLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>{t.referenceSpectrum}</span>
        <span className="font-data text-[11px] text-slate-500 dark:text-slate-400">
          {t.rangeLabel} <strong className="text-slate-900 dark:text-white font-medium">{safeRange} {safeUnit}</strong>
        </span>
      </div>

      <div className="relative h-3.5 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden flex my-2">
        {/* Low zone */}
        <div className="w-1/4 bg-amber-400/25 dark:bg-amber-500/20 text-[9px] font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center border-e border-amber-300/30">
          {t.lowLabel}
        </div>
        {/* Target Normal Zone */}
        <div className="w-2/4 bg-emerald-500/30 dark:bg-emerald-500/30 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center border-e border-emerald-400/30">
          {t.targetRange}
        </div>
        {/* High zone */}
        <div className="w-1/4 bg-red-500/20 dark:bg-red-500/20 text-[9px] font-bold text-red-700 dark:text-red-400 flex items-center justify-center">
          {t.highLabel}
        </div>

        {/* Dynamic Indicator Pin */}
        <div
          className={`absolute top-0 bottom-0 w-3.5 rounded-full -ms-1.5 border-2 transition-all ${getPinColor()}`}
          style={{ left: `${percent}%` }}
          title={`${t.measuredValueLabel} ${numVal} ${safeUnit}`}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-data">
        <span>0</span>
        <span className="font-body font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
          {t.yourValueLabel} <strong className="text-slate-900 dark:text-white font-data font-medium">{safeValue} {safeUnit}</strong>
        </span>
        <span>{t.highLabel} +</span>
      </div>
    </div>
  );
};
