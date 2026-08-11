/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Printer, 
  HelpCircle, 
  CheckSquare, 
  Square, 
  Clock, 
  Plus, 
  Trash2, 
  Calendar,
  BookmarkCheck
} from 'lucide-react';
import { DoctorPrepData, DoctorQuestion } from '../types';
import { Language, translations } from '../utils/i18n';
import { toArray } from '../utils/format';

interface DoctorPrepSectionProps {
  doctorPrep: DoctorPrepData;
  onPrint: () => void;
  language?: Language;
}

export const DoctorPrepSection: React.FC<DoctorPrepSectionProps> = ({
  doctorPrep,
  onPrint,
  language = 'en',
}) => {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [customNotes, setCustomNotes] = useState<string>('');
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState<string>('');

  const t = translations[language];

  const toggleCheck = (id: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setUserQuestions((prev) => [...prev, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setUserQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'standard') => {
    switch (priority) {
      case 'high':
        return (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/25 shrink-0">
            {t.highPriority}
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/25 shrink-0">
            {t.recommendedPriority}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10 shrink-0">
            {t.standardPriority}
          </span>
        );
    }
  };

  const questionsList: DoctorQuestion[] = toArray(doctorPrep?.topQuestions);

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* Header Banner */}
      <div className="card-elevated rounded-[1.75rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <ClipboardList className="w-4 h-4" />
            </span>
            {t.doctorPrepHeader}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ps-[2.75rem]">
            {t.doctorPrepSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-primary shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>{t.printChecklist}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Top 10 Questions Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated rounded-[1.75rem] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/8 pb-3 gap-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <HelpCircle className="w-5 h-5 text-cyan-500" />
                {t.topQuestionsTitle}
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8">
                {/* "3 / 10 Checked" reads correctly in EN, FR and RTL Arabic,
                    unlike the hardcoded English word "of" used before. */}
                {Object.values(checkedQuestions).filter(Boolean).length} / {questionsList.length + userQuestions.length}{' '}
                {t.checkedCount}
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questionsList.map((q, idx) => {
                // Fall back to the index when the model omits an id, otherwise
                // every question would share the key "undefined" and ticking
                // one checkbox would appear to tick several.
                const questionId = q.id || `ai-q-${idx}`;
                const isChecked = Boolean(checkedQuestions[questionId]);
                return (
                  <div
                    key={questionId}
                    onClick={() => toggleCheck(questionId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-cyan-50/50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/25 opacity-80'
                        : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/8 hover:border-cyan-500/40'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-400">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            isChecked
                              ? 'line-through text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          &ldquo;{q.question}&rdquo;
                        </span>
                        {getPriorityBadge(q.priority)}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>{t.whyAskLabel}</strong> {q.context}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* User Added Questions */}
              {userQuestions.map((qText, idx) => {
                const id = `user-q-${idx}`;
                const isChecked = Boolean(checkedQuestions[id]);
                return (
                  <div
                    key={id}
                    className="p-4 rounded-2xl border bg-indigo-50/40 dark:bg-indigo-500/10 border-indigo-200/70 dark:border-indigo-500/25 flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => toggleCheck(id)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-cyan-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs font-semibold truncate ${isChecked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        &ldquo;{qText}&rdquo;
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Question Form */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                placeholder={t.customQuestionPlaceholder}
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2.5 rounded-2xl btn-primary text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> {t.addLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Discussion Points, Things to Monitor, Personal Notes */}
        <div className="space-y-6">
          
          {/* Key Discussion Topics */}
          <div className="card-elevated rounded-[1.5rem] p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <BookmarkCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </span>
              {t.keyDiscussionPoints}
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {toArray(doctorPrep?.discussionPoints).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold mt-0.5">&bull;</span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Monitor */}
          <div className="card-elevated rounded-[1.5rem] p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </span>
              {t.thingsToMonitor}
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {toArray(doctorPrep?.thingsToMonitor).map((mon, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">&bull;</span>
                  <span className="leading-relaxed">{mon}</span>
                </li>
              ))}
            </ul>
            {doctorPrep?.followUpTimeline && (
              <div className="pt-2 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-50/80 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 w-fit">
                <Calendar className="w-3.5 h-3.5" />
                <span>{doctorPrep.followUpTimeline}</span>
              </div>
            )}
          </div>

          {/* Personal Notes Textarea */}
          <div className="card-elevated rounded-[1.5rem] p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.personalAppointmentNotes}
            </h3>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={t.appointmentNotesPlaceholder}
              rows={4}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
