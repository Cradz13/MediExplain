/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: Array<{ code: Language; nativeName: string; flag: string }> = [
  { code: 'en', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', nativeName: 'العربية', flag: '🇸🇦' },
];

/**
 * A native select is used intentionally here. It works reliably with touch,
 * keyboard and assistive technology and cannot be hidden underneath the sticky
 * header (which was possible with the old custom popover on small screens).
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const t = translations[currentLanguage];
  const selectedLanguage = LANGUAGES.find((language) => language.code === currentLanguage) ?? LANGUAGES[0];

  return (
    <label
      className="relative flex items-center gap-1.5 rounded-full text-xs font-semibold btn-secondary"
      title={t.selectLanguageLabel}
    >
      <Globe className="absolute start-3 w-4 h-4 text-cyan-600 dark:text-cyan-400 pointer-events-none z-10" />
      <span className="absolute start-8 text-sm leading-none pointer-events-none z-10" aria-hidden="true">
        {selectedLanguage.flag}
      </span>
      <span className="sr-only">{t.selectLanguageLabel}</span>
      <select
        value={currentLanguage}
        onChange={(event) => onLanguageChange(event.target.value as Language)}
        aria-label={t.selectLanguageLabel}
        className="appearance-none cursor-pointer bg-transparent text-slate-700 dark:text-slate-200 py-2 ps-[3.45rem] pe-8 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-cyan-500 min-w-[6.7rem] sm:min-w-[8.6rem]"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code} className="bg-white text-slate-900">
            {language.nativeName}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute end-2.5 w-3.5 h-3.5 opacity-60 pointer-events-none" />
    </label>
  );
};
