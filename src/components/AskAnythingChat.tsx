/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  ShieldAlert, 
  Loader2 
} from 'lucide-react';
import { ReportAnalysisResult, ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';
import { Language, translations } from '../utils/i18n';
import { speak, cancelSpeech, isSpeechSupported } from '../utils/speech';

interface AskAnythingChatProps {
  reportContext: ReportAnalysisResult | null;
  language?: Language;
}

export const AskAnythingChat: React.FC<AskAnythingChatProps> = ({ reportContext, language = 'en' }) => {
  const t = translations[language];

  const createWelcomeMessage = (): ChatMessage => ({
    id: `welcome-${language}-${reportContext?.id ?? 'no-report'}`,
    sender: 'ai',
    text: reportContext
      ? `${t.askAnythingHeader} (${reportContext.fileName}).`
      : t.askAnythingHeader,
    timestamp: Date.now(),
  });

  // Lazy initializer must return the array itself - passing `createWelcomeMessage`
  // directly seeded state with a bare object, so the first `messages.map()`
  // threw and the Ask Anything tab rendered as a blank screen.
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = language === 'fr' 
    ? [
        'Que signifie le cholestérol HDL et pourquoi est-il important ?',
        'Dois-je m\'inquiéter de mes résultats ?',
        'Que dois-je demander à mon médecin lors de ma visite ?',
        'Pouvez-vous expliquer mes valeurs de laboratoire simplement ?',
      ]
    : language === 'ar'
    ? [
        'ماذا يعني الكوليسترول النافع HDL ولماذا هو مهم؟',
        'هل يجب أن أقلق بشأن هذه النتائج؟',
        'ما الذي يجب أن أسأله لطبيبي أثناء الزيارة؟',
        'هل يمكنك شرح نتيجتي بلغة بسيطة؟',
      ]
    : [
        'What is HDL and why is it important?',
        'Should I worry about my results?',
        'What should I ask my doctor during my visit?',
        'Can you explain my lab values in simple terms?',
      ];

  // A conversation belongs to the selected language and report. Reset it when
  // either changes so the welcome text, future answers, and read-aloud voice
  // never stay in the language from the previous page.
  useEffect(() => {
    cancelSpeech();
    setSpeakingMsgId(null);
    setMessages([createWelcomeMessage()]);
    setInputMessage('');
  }, [language, reportContext?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const answer = await sendChatMessage(reportContext, messages, text.trim(), language);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `${t.chatErrorPrefix} ${err.message || t.tryAgain}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const speakMessage = (msgId: string, text: string) => {
    if (!isSpeechSupported()) return;

    if (speakingMsgId === msgId) {
      cancelSpeech();
      setSpeakingMsgId(null);
      return;
    }

    speak(text, language, {
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null),
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-fade-up">
      
      {/* Educational Safety Banner */}
      <div className="glass rounded-[1.5rem] p-4 sm:p-5 flex items-center gap-3.5 text-xs text-slate-600 dark:text-slate-300">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
          <ShieldAlert className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        </div>
        <span className="leading-relaxed">
          <strong className="font-semibold text-slate-900 dark:text-white">{t.chatSafetyBannerTitle}: </strong>
          {t.chatSafetyBannerText}
        </span>
      </div>

      {/* Main Chat Box Container */}
      <div className="card-elevated rounded-[1.75rem] overflow-hidden flex flex-col h-[560px]">
        
        {/* Chat Messages Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-slate-50/40 dark:to-white/[0.015]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.55)]'
                    : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-tr-sm shadow-[0_8px_24px_-8px_rgba(6,182,212,0.45)]'
                    : 'bg-white dark:bg-white/5 text-slate-900 dark:text-white rounded-tl-sm border border-slate-200/80 dark:border-white/10 shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Read Aloud Button for AI responses */}
                {msg.sender === 'ai' && (
                  <button
                    type="button"
                    onClick={() => speakMessage(msg.id, msg.text)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-1"
                  >
                    {speakingMsgId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 animate-pulse" /> {t.stopAudio}
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" /> {t.listenAudio}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-3 text-slate-500 text-xs py-2">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">{t.aiAnalyzingQuery}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/8 bg-slate-50/80 dark:bg-white/[0.03] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> {t.suggestedPrompts}
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSending}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white/60 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/8 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            placeholder={t.askAnythingPlaceholder}
            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-shadow"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-3 rounded-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
