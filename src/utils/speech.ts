/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './i18n';

/**
 * Shared browser SpeechSynthesis helper.
 *
 * Two problems this solves:
 *  1. Utterances used to be spoken without `lang`, so French / Arabic text was
 *     read aloud with the default (usually English) system voice.
 *  2. Browsers ship several voices per locale with very different quality.
 *     We score the available voices and pick the most natural sounding one
 *     (Google / Neural / Premium / Enhanced engines first, then any local
 *     voice for the requested locale).
 */

export const SPEECH_LOCALES: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

/** Locale prefixes we accept as a fallback for each app language. */
const LOCALE_PREFIX: Record<Language, string> = {
  en: 'en',
  fr: 'fr',
  ar: 'ar',
};

/**
 * Voice names known to sound noticeably more natural, highest priority first.
 * Matching is case-insensitive and per-substring.
 */
const PREFERRED_VOICE_HINTS: Record<Language, string[]> = {
  en: [
    'google us english',
    'microsoft aria',
    'microsoft jenny',
    'microsoft guy',
    'samantha',
    'ava',
    'allison',
    'google uk english female',
  ],
  fr: [
    'google français',
    'google francais',
    'microsoft denise',
    'microsoft henri',
    'audrey',
    'thomas',
    'amelie',
    'amélie',
    'juliette',
  ],
  ar: [
    'google arabic',
    'microsoft hamed',
    'microsoft salma',
    'microsoft naayf',
    'maged',
    'tarik',
    'laila',
  ],
};

/** Generic quality markers used when no named voice matches. */
const QUALITY_HINTS = ['neural', 'premium', 'enhanced', 'natural', 'google', 'siri'];

/** Normalizes any loose language string coming from props/localStorage. */
export const toLanguage = (value: string | Language | undefined): Language => {
  if (value === 'fr' || value === 'ar' || value === 'en') return value;
  const prefix = (value || '').slice(0, 2).toLowerCase();
  if (prefix === 'fr') return 'fr';
  if (prefix === 'ar') return 'ar';
  return 'en';
};

const isSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Cached voice list; refreshed when the browser fires `voiceschanged`. */
let cachedVoices: SpeechSynthesisVoice[] = [];

const readVoices = (): SpeechSynthesisVoice[] => {
  if (!isSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length) cachedVoices = voices;
  return cachedVoices;
};

if (isSupported() && typeof window.speechSynthesis.addEventListener === 'function') {
  // Chrome loads voices asynchronously; keep the cache warm.
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    readVoices();
  });
  readVoices();
}

const scoreVoice = (voice: SpeechSynthesisVoice, language: Language): number => {
  const target = SPEECH_LOCALES[language].toLowerCase();
  const prefix = LOCALE_PREFIX[language];
  const voiceLang = (voice.lang || '').toLowerCase().replace('_', '-');

  if (!voiceLang.startsWith(prefix)) return -1;

  let score = 0;

  // Exact locale match (en-US vs en-IN) is worth a lot.
  if (voiceLang === target) score += 60;
  else score += 20;

  const name = (voice.name || '').toLowerCase();

  const hintIndex = PREFERRED_VOICE_HINTS[language].findIndex((hint) =>
    name.includes(hint)
  );
  if (hintIndex >= 0) score += 100 - hintIndex * 5;

  QUALITY_HINTS.forEach((hint) => {
    if (name.includes(hint)) score += 12;
  });

  // Compact / low-quality system voices sound robotic.
  if (name.includes('compact') || name.includes('eloquence')) score -= 25;

  if (voice.localService) score += 5;
  if (voice.default) score += 3;

  return score;
};

/** Returns the best available voice for the given app language, if any. */
export const getBestVoice = (lang: Language | string): SpeechSynthesisVoice | null => {
  const language = toLanguage(lang);
  const voices = readVoices();
  if (!voices.length) return null;

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  voices.forEach((voice) => {
    const score = scoreVoice(voice, language);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  });

  return bestScore >= 0 ? best : null;
};

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
  /** Speaking rate; Arabic reads more naturally slightly slower. */
  rate?: number;
  pitch?: number;
}

export const cancelSpeech = (): void => {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
};

/**
 * Speaks `text` in the given app language using the best matching voice.
 * Any in-flight utterance is cancelled first.
 */
export const speak = (
  text: string,
  lang: Language | string,
  options: SpeakOptions = {}
): SpeechSynthesisUtterance | null => {
  if (!isSupported() || !text || !text.trim()) return null;

  const language = toLanguage(lang);

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LOCALES[language];

  const voice = getBestVoice(language);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || SPEECH_LOCALES[language];
  }

  utterance.rate = options.rate ?? (language === 'ar' ? 0.9 : 0.98);
  utterance.pitch = options.pitch ?? 1.02;
  utterance.volume = 1;

  if (options.onStart) utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => (options.onError ?? options.onEnd)?.();

  // Safari/Chrome occasionally stall right after cancel(); a micro delay helps.
  window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 60);

  return utterance;
};

export const isSpeechSupported = isSupported;
