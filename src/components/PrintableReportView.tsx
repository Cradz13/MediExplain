/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReportAnalysisResult } from '../types';
import { Language, translations } from '../utils/i18n';
import { BrandLogo } from './BrandLogo';
import { toArray } from '../utils/format';

interface PrintableReportViewProps {
  analysis: ReportAnalysisResult;
  language?: Language;
}

export const PrintableReportView: React.FC<PrintableReportViewProps> = ({ analysis, language = 'en' }) => {
  const t = translations[language];

  const statusLabel = (status: string): string => {
    if (status === 'normal') return t.statusNormal;
    if (status === 'discussion') return t.statusDiscussion;
    if (status === 'attention') return t.statusAttention;
    return status;
  };

  return (
    <div id="printable-area" className="hidden print:block bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Print Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-10 h-10" iconClassName="w-6 h-6" withBackground={false} alt={t.brandTitle} />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.brandTitle}</h1>
            <p className="text-xs text-slate-500">{t.printSubtitle}</p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-600">
          <div>{t.reportDateLabel} {analysis.patientInfo?.date || new Date().toLocaleDateString()}</div>
          <div>{t.printDocumentLabel} {analysis.fileName}</div>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 italic border border-slate-300">
        {t.printDisclaimer}
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <h2 className="text-base font-bold border-b border-slate-300 pb-1 uppercase tracking-wide">
          {t.printSection1}
        </h2>
        <p className="text-sm leading-relaxed">{analysis.shortSummary}</p>
      </div>

      {/* Layman Explanation */}
      <div className="space-y-2">
        <h2 className="text-base font-bold border-b border-slate-300 pb-1 uppercase tracking-wide">
          {t.printSection2}
        </h2>
        <p className="text-sm leading-relaxed">{analysis.laymanExplanation}</p>
      </div>

      {/* Lab Values Table */}
      <div className="space-y-2">
        <h2 className="text-base font-bold border-b border-slate-300 pb-1 uppercase tracking-wide">
          {t.printSection3}
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-400 bg-slate-50">
              <th className="py-2 px-1">{t.thTestName}</th>
              <th className="py-2 px-1">{t.thResult}</th>
              <th className="py-2 px-1">{t.thReferenceRange}</th>
              <th className="py-2 px-1">{t.thStatus}</th>
            </tr>
          </thead>
          <tbody>
            {toArray(analysis.labValues).map((v, idx) => (
              <tr key={v.id || `lab-${idx}`} className="border-b border-slate-200">
                <td className="py-2 px-1 font-semibold">{v.name}</td>
                <td className="py-2 px-1 font-bold">{v.value} {v.unit}</td>
                <td className="py-2 px-1">{v.referenceRange}</td>
                <td className="py-2 px-1 font-semibold uppercase">{statusLabel(v.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Questions for Doctor */}
      <div className="space-y-2">
        <h2 className="text-base font-bold border-b border-slate-300 pb-1 uppercase tracking-wide">
          {t.printSection4}
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 text-xs">
          {toArray(analysis.doctorPrep?.topQuestions).map((q, idx) => (
            <li key={q.id || `q-${idx}`} className="font-medium">
              "{q.question}" <span className="text-slate-500">({q.context})</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
};
