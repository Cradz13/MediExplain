/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LabRangeGaugeProps {
  valueStr: string;
  referenceRangeStr: string;
  unit: string;
  status: 'normal' | 'discussion' | 'attention';
  compact?: boolean;
}

export const LabRangeGauge: React.FC<LabRangeGaugeProps> = ({
  valueStr,
  referenceRangeStr,
  unit,
  status,
  compact = false,
}) => {
  // Parse numerical value
  const numVal = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
  if (isNaN(numVal)) return null;

  // Parse reference range
  let minRef = 0;
  let maxRef = 100;
  let isLessThanType = false;
  let isGreaterThanType = false;

  const rangeClean = referenceRangeStr.trim();
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
        return 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      case 'discussion':
        return 'bg-amber-500 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'attention':
        return 'bg-red-500 border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    }
  };

  if (compact) {
    return (
      <div className="w-full space-y-1 pt-1">
        <div className="relative h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden flex">
          {/* Low / Normal / High zones */}
          <div className="w-1/4 bg-slate-200 dark:bg-slate-700/50" />
          <div className="w-1/2 bg-emerald-500/20 dark:bg-emerald-500/30 border-x border-emerald-500/30" />
          <div className="w-1/4 bg-amber-500/20 dark:bg-amber-500/30" />
          
          {/* Result Pin */}
          <div
            className={`absolute top-0 bottom-0 w-2.5 rounded-full -ml-1 border transition-all ${getPinColor()}`}
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-gray-500 font-mono">
          <span>Low</span>
          <span>Normal ({referenceRangeStr})</span>
          <span>High</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-gray-300">
        <span>Reference Spectrum</span>
        <span className="font-mono text-[11px] text-slate-500 dark:text-gray-400">
          Range: <strong className="text-slate-900 dark:text-white">{referenceRangeStr} {unit}</strong>
        </span>
      </div>

      <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex my-2">
        {/* Low zone */}
        <div className="w-1/4 bg-amber-400/20 dark:bg-amber-500/20 text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center border-r border-amber-300/30">
          Low
        </div>
        {/* Target Normal Zone */}
        <div className="w-2/4 bg-emerald-500/25 dark:bg-emerald-500/30 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center border-r border-emerald-400/30">
          Target Range
        </div>
        {/* High zone */}
        <div className="w-1/4 bg-red-500/20 dark:bg-red-500/20 text-[9px] font-bold text-red-600 dark:text-red-400 flex items-center justify-center">
          High
        </div>

        {/* Dynamic Indicator Pin */}
        <div
          className={`absolute top-0 bottom-0 w-3 rounded-full -ml-1.5 border-2 transition-all ${getPinColor()}`}
          style={{ left: `${percent}%` }}
          title={`Measured Value: ${numVal} ${unit}`}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-gray-400 font-mono">
        <span>0</span>
        <span className="font-sans font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
          Your Value: <strong className="text-slate-900 dark:text-white">{valueStr} {unit}</strong>
        </span>
        <span>High +</span>
      </div>
    </div>
  );
};
