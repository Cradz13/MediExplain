/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReportAnalysisResult, LiveCameraAnalysis, ChatMessage } from '../types';

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  let response = await fetch(url, options);
  for (let i = 0; i < retries; i++) {
    if (response.ok || (response.status !== 502 && response.status !== 503 && response.status !== 504)) {
      break;
    }
    await new Promise((r) => setTimeout(r, (i + 1) * 1500));
    response = await fetch(url, options);
  }
  return response;
}

export async function analyzeReportFile(
  fileData: string,
  mimeType: string,
  fileName: string,
  fileType: 'pdf' | 'image' | 'camera_capture',
  language: string = 'en'
): Promise<ReportAnalysisResult> {
  const response = await fetchWithRetry('/api/analyze-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileData, mimeType, fileName, fileType, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server returned error status ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

export async function analyzeLiveCameraFrame(
  imageBase64: string,
  userQuestion?: string,
  language: string = 'en'
): Promise<LiveCameraAnalysis> {
  const response = await fetchWithRetry('/api/camera-frame-live', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, userQuestion, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze camera frame');
  }

  const data = await response.json();
  return data.analysis;
}

export async function sendChatMessage(
  reportContext: ReportAnalysisResult | null,
  messages: ChatMessage[],
  userMessage: string,
  language: string = 'en'
): Promise<string> {
  const response = await fetchWithRetry('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportContext, messages, userMessage, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get chat response');
  }

  const data = await response.json();
  return data.answer;
}

export async function translateReportResult(
  report: ReportAnalysisResult,
  targetLanguage: string = 'en'
): Promise<ReportAnalysisResult> {
  const response = await fetchWithRetry('/api/translate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report, targetLanguage }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to translate report');
  }

  const data = await response.json();
  return data.result;
}

export async function generateSpeechAudio(text: string): Promise<string | null> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && data.audioBase64) {
      return data.audioBase64;
    }
  } catch (err) {
    console.warn('Backend TTS call fallback to browser SpeechSynthesis', err);
  }
  return null;
}
