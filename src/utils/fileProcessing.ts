/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client-side file validation and normalization helpers for medical report uploads.
 *
 * Browsers report inconsistent MIME types (empty strings on Android, `image/heic`
 * on iOS, `application/octet-stream` for some scanners), and Gemini only accepts a
 * specific set of inline media types. These helpers normalize whatever the user
 * picked into something the API reliably accepts.
 */

/** Maximum accepted source file size (before any downscaling). */
export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

/** Largest edge (px) we send to the model. Bigger adds latency without accuracy. */
const MAX_IMAGE_EDGE = 2200;

/** JPEG quality used when re-encoding photos. */
const JPEG_QUALITY = 0.88;

/** Image MIME types Gemini accepts inline. */
const GEMINI_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

/** Extensions we accept, mapped to the MIME type we should send. */
const EXTENSION_MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  pjpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  avif: 'image/avif',
};

export type UploadKind = 'pdf' | 'image';

export interface PreparedUpload {
  /** Full data URL (`data:<mime>;base64,<data>`). */
  dataUrl: string;
  /** MIME type that matches the bytes actually being sent. */
  mimeType: string;
  /** Coarse file kind used by the backend prompt. */
  kind: UploadKind;
  /** Original file name. */
  fileName: string;
  /** True when the image was re-encoded/downscaled in the browser. */
  wasOptimized: boolean;
}

export type ValidationError =
  | 'unsupportedType'
  | 'tooLarge'
  | 'empty';

export interface ValidationResult {
  ok: boolean;
  error?: ValidationError;
  kind?: UploadKind;
  /** Best-guess MIME type for the file. */
  mimeType?: string;
}

function getExtension(fileName: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return match ? match[1].toLowerCase() : '';
}

/**
 * Resolves the MIME type of a file, falling back to its extension when the
 * browser reports nothing useful (empty string or a generic binary type).
 */
export function resolveMimeType(file: File): string {
  const reported = (file.type || '').toLowerCase().trim();
  const isUseful =
    reported.startsWith('image/') || reported === 'application/pdf';

  if (isUseful) return reported;

  const fromExtension = EXTENSION_MIME_MAP[getExtension(file.name)];
  return fromExtension || reported || 'application/octet-stream';
}

/** Validates size and type before any expensive work happens. */
export function validateFile(file: File): ValidationResult {
  if (!file || file.size === 0) {
    return { ok: false, error: 'empty' };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'tooLarge' };
  }

  const mimeType = resolveMimeType(file);

  if (mimeType === 'application/pdf') {
    return { ok: true, kind: 'pdf', mimeType };
  }

  if (mimeType.startsWith('image/')) {
    return { ok: true, kind: 'image', mimeType };
  }

  return { ok: false, error: 'unsupportedType' };
}

/** Reads a File into a base64 data URL. */
function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string' && result.length > 0) {
        resolve(result);
      } else {
        reject(new Error('FileReader returned an empty result.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed.'));
    reader.onabort = () => reject(new Error('File reading was aborted.'));
    reader.readAsDataURL(file);
  });
}

/** Decodes an image blob into a bitmap, preferring the fast native path. */
async function decodeImage(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> path (e.g. Safari with certain formats).
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Browser could not decode this image.'));
      img.src = objectUrl;
    });
  } finally {
    // Revoke on the next tick so decoding has definitely finished.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}

/**
 * Re-encodes an image to JPEG and downscales it if needed.
 *
 * This does three important things:
 *  1. Converts formats Gemini rejects (HEIC, TIFF, BMP, AVIF, GIF) into JPEG.
 *  2. Shrinks huge phone photos so the request stays well under the body limit.
 *  3. Strips EXIF weirdness by drawing to a canvas.
 *
 * If decoding fails (e.g. HEIC on a browser that can't decode it), the original
 * bytes are returned untouched so the server can still try.
 */
async function optimizeImage(
  file: File,
  mimeType: string
): Promise<{ dataUrl: string; mimeType: string; wasOptimized: boolean }> {
  const needsConversion = !GEMINI_IMAGE_MIME_TYPES.includes(mimeType);
  const isLarge = file.size > 3 * 1024 * 1024;

  // Small file already in a supported format: send as-is, no quality loss.
  if (!needsConversion && !isLarge) {
    return { dataUrl: await readAsDataURL(file), mimeType, wasOptimized: false };
  }

  try {
    const bitmap = await decodeImage(file);
    const sourceWidth = 'width' in bitmap ? bitmap.width : 0;
    const sourceHeight = 'height' in bitmap ? bitmap.height : 0;

    if (!sourceWidth || !sourceHeight) {
      throw new Error('Decoded image had no dimensions.');
    }

    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(sourceWidth, sourceHeight));
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');

    // White backdrop so transparent PNGs don't become black rectangles in JPEG.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, targetWidth, targetHeight);

    if ('close' in bitmap && typeof bitmap.close === 'function') {
      bitmap.close();
    }

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    if (!dataUrl || dataUrl === 'data:,') {
      throw new Error('Canvas produced an empty image.');
    }

    return { dataUrl, mimeType: 'image/jpeg', wasOptimized: true };
  } catch (err) {
    console.warn('Image optimization failed, sending original bytes.', err);
    return { dataUrl: await readAsDataURL(file), mimeType, wasOptimized: false };
  }
}

/**
 * Validates, reads, and normalizes a user-selected file so it can be sent to
 * `/api/analyze-report`. Throws a `ValidationError` code as the message when the
 * file is rejected, so callers can map it to a localized string.
 */
export async function prepareFileForUpload(
  file: File,
  onProgress?: (stage: 'reading' | 'optimizing') => void
): Promise<PreparedUpload> {
  const validation = validateFile(file);

  if (!validation.ok || !validation.kind || !validation.mimeType) {
    throw new Error(validation.error || 'unsupportedType');
  }

  const { kind, mimeType } = validation;

  if (kind === 'pdf') {
    onProgress?.('reading');
    return {
      dataUrl: await readAsDataURL(file),
      mimeType: 'application/pdf',
      kind: 'pdf',
      fileName: file.name,
      wasOptimized: false,
    };
  }

  onProgress?.('optimizing');
  const optimized = await optimizeImage(file, mimeType);

  return {
    dataUrl: optimized.dataUrl,
    mimeType: optimized.mimeType,
    kind: 'image',
    fileName: file.name,
    wasOptimized: optimized.wasOptimized,
  };
}

/** File input `accept` string covering everything we handle. */
export const UPLOAD_ACCEPT_ATTRIBUTE =
  'application/pdf,.pdf,image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.bmp,.tif,.tiff,.avif';
