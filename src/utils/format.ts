/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Defensive helpers for rendering model-generated report data.
 *
 * Every field in a `ReportAnalysisResult` originates from a language model, so
 * even with a schema in the prompt the shape is never guaranteed: a lab result
 * can arrive as a number instead of a string, an array can be a single string,
 * and optional sections are sometimes omitted entirely.
 *
 * The server normalizes its own responses, but reports also arrive from
 * `localStorage`, from older cached analyses, and straight from the translation
 * endpoint. These helpers keep a bad payload from turning into a blank screen.
 */

/** Renders any scalar as display text. Objects, arrays, null and undefined become ''. */
export function toText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return String(value);
  return fallback;
}

/** Always returns an array, so `.map()` is safe on a missing or scalar field. */
export function toArray<T>(value: T[] | T | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

/** Returns an array of renderable, non-empty strings. */
export function toTextArray(value: unknown): string[] {
  return toArray(value as unknown[])
    .map((entry) => toText(entry))
    .filter((entry) => entry.trim() !== '');
}

/** Parses the leading number out of a lab value such as `"238"`, `238` or `"< 5.0"`. */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  const match = /-?\d+(\.\d+)?/.exec(toText(value).replace(/,/g, ''));
  return match ? parseFloat(match[0]) : NaN;
}
