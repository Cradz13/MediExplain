/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, HeartPulse } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface DisclaimerBannerProps {
  hasCriticalFindings?: boolean;
  language?: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  hasCriticalFindings,
  language = 'en',
}) => {
  const t = translations[language];

  return (
    <div className="space-y-3 animate-fade-up">
      {hasCriticalFindings && (
        <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/30 border border-red-200/80 dark:border-red-500/25 rounded-2xl p-4 flex items-start gap-3.5 text-red-700 dark:text-red-300 shadow-sm">
          <div className="absolute inset-y-0 start-0 w-1 bg-red-500" />
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
          <div className="text-sm leading-relaxed">
            <strong className="font-semibold block text-base mb-0.5 text-red-800 dark:text-red-200">
              {t.criticalAlertTitle}
            </strong>
            {t.criticalAlertDesc}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="leading-relaxed">
            <strong className="font-semibold text-slate-900 dark:text-white">
              {t.disclaimerTitle}
            </strong>
            {t.disclaimerDesc}
          </span>
        </div>
        <div className="shrink-0 hidden md:block">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-400/20">
            {t.nonDiagnosticBadge}
          </span>
        </div>
      </div>
    </div>
  );
};
