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
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { DoctorPrepData, DoctorQuestion } from '../types';
import { Language, translations } from '../utils/i18n';

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
          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/20">
            {t.highPriority}
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/20">
            {t.recommendedPriority}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
            {t.standardPriority}
          </span>
        );
    }
  };

  const questionsList: DoctorQuestion[] = doctorPrep?.topQuestions || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 dark:text-white flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            {t.doctorPrepHeader}
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            {t.doctorPrepSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all glow-blue shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <Printer className="w-4 h-4" />
          <span>{t.printChecklist}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Top 10 Questions Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                {t.topQuestionsTitle}
              </h3>
              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">
                {Object.values(checkedQuestions).filter(Boolean).length} of {questionsList.length + userQuestions.length} {t.checkedCount}
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questionsList.map((q) => {
                const isChecked = Boolean(checkedQuestions[q.id]);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleCheck(q.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-blue-50/40 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 opacity-75'
                        : 'bg-slate-50/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-500/40'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            isChecked
                              ? 'line-through text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          "{q.question}"
                        </span>
                        {getPriorityBadge(q.priority)}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>Why ask:</strong> {q.context}
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
                    className="p-4 rounded-xl border bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => toggleCheck(id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                      <span className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        "{qText}"
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
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
                placeholder="Add your own custom question for the doctor..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Discussion Points, Things to Monitor, Personal Notes */}
        <div className="space-y-6">
          
          {/* Key Discussion Topics */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
              Key Discussion Points
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(doctorPrep?.discussionPoints || []).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Monitor */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Things to Monitor
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(doctorPrep?.thingsToMonitor || []).map((mon, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">&bull;</span>
                  <span>{mon}</span>
                </li>
              ))}
            </ul>
            {doctorPrep?.followUpTimeline && (
              <div className="pt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{doctorPrep.followUpTimeline}</span>
              </div>
            )}
          </div>

          {/* Personal Notes Textarea */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Appointment Notes
            </h3>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Jot down symptoms, medication notes, or doctor responses during your appointment..."
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
