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
    <div className="space-y-3">
      {hasCriticalFindings && (
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4 flex items-start gap-3.5 text-red-400 shadow-sm animate-pulse">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <strong className="font-semibold block text-base mb-0.5 text-red-300">
              {t.criticalAlertTitle}
            </strong>
            {t.criticalAlertDesc}
          </div>
        </div>
      )}

      <div className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-gray-300 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong className="font-semibold text-slate-900 dark:text-white">
              {t.disclaimerTitle}
            </strong>
            {t.disclaimerDesc}
          </span>
        </div>
        <div className="shrink-0 hidden md:block">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-400/20">
            Non-Diagnostic AI
          </span>
        </div>
      </div>
    </div>
  );
};
