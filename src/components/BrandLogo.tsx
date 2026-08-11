/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

/**
 * App brand mark.
 *
 * Renders the custom logo from `/logo.png` (drop your file in `public/logo.png`).
 * If that file is missing or fails to load, it gracefully falls back to the
 * original stethoscope badge so the header never breaks.
 */

export const BRAND_LOGO_SRC = '/logo.png';

interface BrandLogoProps {
  /** Tailwind size classes for the badge, e.g. "w-10 h-10". */
  className?: string;
  /** Icon size classes used by the fallback stethoscope. */
  iconClassName?: string;
  /** Set false to drop the blue badge background (useful for print). */
  withBackground?: boolean;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-10 h-10',
  iconClassName = 'w-5 h-5',
  withBackground = true,
  alt = 'MediExplain',
}) => {
  const [logoFailed, setLogoFailed] = useState(false);

  if (!logoFailed) {
    return (
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        onError={() => setLogoFailed(true)}
        className={`${className} rounded-2xl object-contain shrink-0 ring-1 ring-slate-200/80 dark:ring-white/10 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-2xl flex items-center justify-center shrink-0 ${
        withBackground
          ? 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 text-white shadow-[0_8px_24px_-6px_rgba(6,182,212,0.55)] ring-1 ring-white/20'
          : 'bg-cyan-600 text-white'
      }`}
    >
      <Stethoscope className={iconClassName} strokeWidth={2.25} />
    </div>
  );
};
