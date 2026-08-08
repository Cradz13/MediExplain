/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LabStatus = 'normal' | 'discussion' | 'attention';

export interface LabValueItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  category: string;
  whatItMeasures: string;
  whyItMatters: string;
  questionsToAsk: string[];
  isAbnormal: boolean;
}

export interface MedicalTerm {
  term: string;
  definition: string;
  whyItMatters: string;
  analogy: string;
  category?: string;
}

export interface DoctorQuestion {
  id: string;
  question: string;
  context: string;
  priority: 'high' | 'medium' | 'standard';
  category: string;
}

export interface DoctorPrepData {
  topQuestions: DoctorQuestion[];
  discussionPoints: string[];
  thingsToMonitor: string[];
  followUpTimeline: string;
}

export interface ReportAnalysisResult {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'camera_capture' | 'sample';
  patientInfo?: {
    date?: string;
    reportType?: string;
    laboratory?: string;
  };
  shortSummary: string;
  laymanExplanation: string;
  importantFindings: string[];
  safetyAlerts: string[];
  hasCriticalFindings: boolean;
  labValues: LabValueItem[];
  vocabulary: MedicalTerm[];
  doctorPrep: DoctorPrepData;
  rawExtractedText?: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  sources?: string[];
  suggestedQuestions?: string[];
}

export interface LiveCameraAnalysis {
  timestamp: number;
  detectedTextSummary: string;
  keyObservation: string;
  detectedValues: Array<{
    name: string;
    value: string;
    status: LabStatus;
  }>;
  suggestedDoctorQuestions: string[];
  spokenResponse?: string;
}
