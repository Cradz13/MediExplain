/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCw, 
  Scan, 
  HelpCircle, 
  Check, 
  Loader2,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';
import { analyzeLiveCameraFrame } from '../services/api';
import { LiveCameraAnalysis } from '../types';
import { Language, translations } from '../utils/i18n';

interface LiveCameraScannerProps {
  onClose: () => void;
  onCaptureFrameAsReport: (base64Image: string) => void;
  language?: Language;
}

export const LiveCameraScanner: React.FC<LiveCameraScannerProps> = ({
  onClose,
  onCaptureFrameAsReport,
  language = 'en',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations[language];

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveCameraAnalysis | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const PRESET_QUESTIONS = language === 'fr'
    ? [
        'Que signifie cette valeur de cholestérol ?',
        'Qu\'y a-t-il d\'anormal dans cette vue ?',
        'Expliquez ce rapport simplement.',
        'Quelles valeurs devrais-je discuter avec mon médecin ?'
      ]
    : [
        'What does this cholesterol value mean?',
        'What is abnormal in this view?',
        'Explain this report simply.',
        'Which values should I discuss with my doctor?'
      ];

  // Start Camera Stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        setCameraError('Unable to access camera. Please check camera permissions in your browser.');
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Capture Base64 Frame
  const captureCurrentFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Speak response using Web Speech API
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Trigger Gemini Vision Live Analysis
  const handleScanQuestion = async (question?: string) => {
    const frameBase64 = captureCurrentFrame();
    if (!frameBase64) {
      setCameraError('Failed to capture video frame.');
      return;
    }

    setIsAnalyzingFrame(true);
    setCameraError(null);

    try {
      const qText = question || customQuery;
      const result = await analyzeLiveCameraFrame(frameBase64, qText, language);
      setLiveAnalysis(result);

      if (result.keyObservation) {
        speakText(result.keyObservation);
      }
    } catch (err: any) {
      setCameraError(err.message || 'Error analyzing camera frame');
    } finally {
      setIsAnalyzingFrame(false);
    }
  };

  // Capture frame as full medical report
  const handleCaptureFullReport = () => {
    const frameBase64 = captureCurrentFrame();
    if (frameBase64) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onCaptureFrameAsReport(frameBase64);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="p-4 flex items-center justify-between text-white border-b border-slate-800 bg-slate-900/80 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              Live Camera Scanner
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-[11px] text-slate-400">Point phone camera at document & ask questions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TTS Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking && window.speechSynthesis) window.speechSynthesis.cancel();
              setSpeechEnabled(!speechEnabled);
            }}
            className={`p-2 rounded-lg border transition-colors ${
              speechEnabled
                ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={speechEnabled ? 'Mute Speech Output' : 'Enable Speech Output'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close Scanner */}
          <button
            type="button"
            onClick={() => {
              if (stream) stream.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        <canvas ref={canvasRef} className="hidden" />

        {cameraError ? (
          <div className="text-center p-6 space-y-3 max-w-md text-red-300 bg-red-950/40 border border-red-800/60 rounded-2xl">
            <p className="text-sm">{cameraError}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold"
            >
              Return to Upload
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />

            {/* Bounding Scanner Frame Overlay */}
            <div className="absolute inset-8 sm:inset-16 border-2 border-blue-500/40 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
              </div>
              
              {isAnalyzingFrame && (
                <div className="text-center space-y-2 py-4 bg-slate-900/80 backdrop-blur rounded-xl border border-blue-500/50 p-4 animate-pulse">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-blue-300">
                    Gemini 3.6 Flash analyzing report frame...
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
              </div>
            </div>
          </div>
        )}

        {/* Live Analysis Overlay Box */}
        {liveAnalysis && (
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-2xl p-4 text-white space-y-3 shadow-2xl z-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Live Camera Insights
              </span>
              {isSpeaking && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" /> Speaking
                </span>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {liveAnalysis.keyObservation}
            </p>

            {liveAnalysis.detectedValues && liveAnalysis.detectedValues.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Detected Values in Frame:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {liveAnalysis.detectedValues.map((val, idx) => (
                    <span
                      key={idx}
                      className={`text-[11px] px-2 py-1 rounded-md font-semibold border ${
                        val.status === 'attention'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : val.status === 'discussion'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {val.name}: {val.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls & Preset Questions */}
      <div className="bg-[#050505] border-t border-white/10 p-4 space-y-3 z-10">
        
        {/* Preset Question Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs text-gray-400 font-semibold shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Presets:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnalyzingFrame}
              onClick={() => {
                setCustomQuery(q);
                handleScanQuestion(q);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-200 bg-white/5 hover:bg-blue-500/20 hover:text-blue-300 border border-white/10 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScanQuestion()}
            placeholder="Ask a question about what you're pointing the camera at..."
            className="flex-1 bg-white/5 border border-white/10 text-white text-xs rounded-full px-5 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          />

          <button
            type="button"
            disabled={isAnalyzingFrame}
            onClick={() => handleScanQuestion()}
            className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all glow-blue shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
          >
            <Scan className="w-4 h-4" />
            <span>Analyze Frame</span>
          </button>

          <button
            type="button"
            onClick={handleCaptureFullReport}
            className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-lg shadow-emerald-600/20"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Process Full Report</span>
          </button>
        </div>
      </div>

    </div>
  );
};
