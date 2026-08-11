/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  // Common & Header
  brandTitle: string;
  brandSubtitle: string;
  tryDemoReport: string;
  demos: string;
  selectSampleReport: string;
  liveCameraScanner: string;
  camera: string;
  printReport: string;
  uploadNewReport: string;
  backToUpload: string;
  lightMode: string;
  darkMode: string;
  languageSelect: string;

  // Tabs
  tabSummary: string;
  tabLabValues: string;
  tabVocabulary: string;
  tabAskAnything: string;
  tabDoctorPrep: string;
  tabCompare: string;

  // Upload Section
  poweredBy: string;
  heroTitle: string;
  heroSubtitle: string;
  dragDropText: string;
  browseFiles: string;
  supportsFormat: string;
  uploadPdfImage: string;
  takePhotoCamera: string;
  analyzingReport: string;
  geminiAnalyzing: string;
  ocrVisionStep: string;
  rangeCheckStep: string;
  doctorPrepStep: string;
  orTestWithDemo: string;
  viewSampleReport: string;
  dragDropPrompt: string;
  supportedFormats: string;
  uploadPdfBtn: string;
  takePhotoBtn: string;
  analyzingReportTitle: string;
  analyzingReportStep: string;
  demoReportsTitle: string;

  // Upload steps & errors
  stepReadingFile: string;
  stepOptimizingImage: string;
  stepAnalyzing: string;
  errorUnsupportedType: string;
  errorFileTooLarge: string;
  errorPdfTooLarge: string;
  errorEmptyFile: string;
  errorReadFailed: string;
  errorAnalyzeFailed: string;

  // Report Summary View
  patientInfoDate: string;
  reportDate: string;
  laboratory: string;
  reportType: string;
  quickSummaryTitle: string;
  whatItMeansTitle: string;
  keyFindingsTitle: string;
  safetyGuidanceTitle: string;
  criticalAlert: string;
  standardReview: string;
  downloadPdf: string;
  printSummary: string;

  // Lab Values
  labValuesHeader: string;
  labValuesSubtitle: string;
  searchLabPlaceholder: string;
  allCategories: string;
  allStatuses: string;
  statusNormal: string;
  statusDiscussion: string;
  statusAttention: string;
  resultLabel: string;
  referenceRangeLabel: string;
  whatItMeasures: string;
  whyItMatters: string;
  questionsToAskDoctor: string;

  // Medical Vocabulary
  vocabularyHeader: string;
  vocabularySubtitle: string;
  searchVocabPlaceholder: string;
  termsExtracted: string;
  definitionLabel: string;
  everydayAnalogy: string;
  fromReportBadge: string;

  // Doctor Prep
  doctorPrepHeader: string;
  doctorPrepSubtitle: string;
  printChecklist: string;
  topQuestionsTitle: string;
  checkedCount: string;
  typeCustomQuestion: string;
  addQuestionBtn: string;
  topicsToDiscuss: string;
  thingsToMonitor: string;
  recommendedTimeline: string;
  highPriority: string;
  recommendedPriority: string;
  standardPriority: string;

  askAnythingHeader: string;
  askAnythingPlaceholder: string;

  // Ask Anything Chat
  chatSafetyBannerTitle: string;
  chatSafetyBannerText: string;
  suggestedPrompts: string;
  chatInputPlaceholder: string;
  listenAudio: string;
  stopAudio: string;
  aiAnalyzingQuery: string;
  
  // Live Camera Scanner
  cameraModalTitle: string;
  alignReportFrame: string;
  analyzingFrame: string;
  presetsLabel: string;
  cameraInputPlaceholder: string;
  analyzeFrameBtn: string;
  processFullReportBtn: string;

  // Disclaimer
  disclaimerTitle: string;
  disclaimerBody: string;
  disclaimerDesc: string;
  criticalAlertTitle: string;
  criticalAlertDesc: string;

  // Shared UI labels
  customQuestionPlaceholder: string;
  appointmentNotesPlaceholder: string;
  referenceSpectrum: string;
  yourReportedResult: string;
  standardReferenceRange: string;
  selectLanguageLabel: string;
  printSubtitle: string;
  thTestName: string;
  thResult: string;
  thReferenceRange: string;
  thStatus: string;
  thLabParameter: string;
  thProgressTrend: string;
  baselineLabel: string;
  analyzedPanel: string;
  rangeCheckBadge: string;
  doctorPrepBadge: string;
  nonDiagnosticBadge: string;
  footerText: string;
  viewingLabel: string;
  translatingReport: string;
  poweredByGemini: string;
  ocrVisionBadge: string;
  chatErrorPrefix: string;
  tryAgain: string;
  patientReportBadge: string;
  reportDateLabel: string;
  facilityLabel: string;
  labTestsIdentified: string;
  stopNarration: string;
  listenToSummary: string;
  copiedLabel: string;
  copyLabel: string;
  executiveAiSummary: string;
  plainLanguageExplanation: string;
  laymanGuideBadge: string;
  labValuesLabel: string;
  labValuesHint: string;
  medicalTermsLabel: string;
  medicalTermsHint: string;
  doctorQuestionsLabel: string;
  doctorQuestionsHint: string;
  askAnythingHint: string;
  importantFindingsTitle: string;
  safetyNotesTitle: string;
  generalCategory: string;
  refLabel: string;
  viewWhyItMatters: string;
  whatThisValueMeasures: string;
  whyItMattersHealth: string;
  closeBreakdown: string;
  lowLabel: string;
  normalLabel: string;
  highLabel: string;
  rangeLabel: string;
  targetRange: string;
  yourValueLabel: string;
  measuredValueLabel: string;
  whyAskLabel: string;
  addLabel: string;
  keyDiscussionPoints: string;
  personalAppointmentNotes: string;
  historicalTrendBadge: string;
  compareLabTitle: string;
  compareLabSubtitle: string;
  compareWithLabel: string;
  keyComparisonInsights: string;
  comparingWord: string;
  againstWord: string;
  previousTestLabel: string;
  comparisonSummaryTail: string;
  outOfWord: string;
  sideBySideTitle: string;
  currentValueLabel: string;
  previousValueLabel: string;
  differenceLabel: string;
  trendImproved: string;
  trendElevated: string;
  trendStable: string;
  notAvailableShort: string;
  todayLabel: string;
  priorLabel: string;
  printDocumentLabel: string;
  printDisclaimer: string;
  printSection1: string;
  printSection2: string;
  printSection3: string;
  printSection4: string;
  cameraScannerSubtitle: string;
  muteSpeech: string;
  enableSpeech: string;
  returnToUpload: string;
  liveCameraInsights: string;
  speakingLabel: string;
  detectedValuesInFrame: string;
  cameraAccessError: string;
  frameCaptureError: string;
  frameAnalyzeError: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandTitle: 'MediExplain',
    brandSubtitle: 'Patient-friendly medical report translator',
    tryDemoReport: 'Try Demo Report',
    demos: 'Demos',
    selectSampleReport: 'Select Sample Medical Test',
    liveCameraScanner: 'Live Camera Scanner',
    camera: 'Camera',
    printReport: 'Print / Save Report Summary',
    uploadNewReport: 'Upload New Report',
    backToUpload: 'Back to Upload',
    lightMode: 'Switch to Light Mode',
    darkMode: 'Switch to Dark Mode',
    languageSelect: 'Language',

    tabSummary: 'Report Summary',
    tabLabValues: 'Lab Values',
    tabVocabulary: 'Vocabulary',
    tabAskAnything: 'Ask Anything',
    tabDoctorPrep: 'Doctor Prep',
    tabCompare: 'Compare Trends',

    poweredBy: 'Powered by Gemini AI',
    heroTitle: 'Understand Your Medical Reports in Seconds',
    heroSubtitle: 'Upload any blood panel, lab test, or clinical document. MediExplain extracts lab values, explains complex terminology with analogies, and prepares questions for your doctor.',
    dragDropText: 'Drag & Drop medical report here, or',
    browseFiles: 'Browse files',
    supportsFormat: 'Supports PDF reports, JPEG, PNG lab sheets, or photos of medical documents',
    uploadPdfImage: 'Upload PDF / Image',
    takePhotoCamera: 'Take Photo / Camera Scanner',
    analyzingReport: 'Analyzing Medical Report...',
    geminiAnalyzing: 'Gemini Vision is reading medical tables, reference ranges, and clinical text...',
    ocrVisionStep: 'OCR & Vision',
    rangeCheckStep: 'Range Check',
    doctorPrepStep: 'Doctor Prep',
    orTestWithDemo: 'Or test instantly with pre-loaded demo medical reports:',
    viewSampleReport: 'View Sample Report',
    dragDropPrompt: 'Drag & drop your medical report here, or click to browse',
    supportedFormats: 'PDF, JPG, PNG, WEBP, HEIC — up to 20 MB',
    uploadPdfBtn: 'Upload PDF / Image',
    takePhotoBtn: 'Take Photo / Camera Scanner',
    analyzingReportTitle: 'Analyzing Medical Report...',
    analyzingReportStep: 'Gemini Vision is reading medical tables, reference ranges, and clinical text...',
    demoReportsTitle: 'Or test instantly with a demo report',

    stepReadingFile: 'Reading document and processing image/PDF bytes...',
    stepOptimizingImage: 'Optimizing image for analysis...',
    stepAnalyzing: 'Gemini is analyzing medical tables & terminology...',
    errorUnsupportedType: 'Unsupported file type. Please upload a PDF or an image (JPG, PNG, WEBP, HEIC).',
    errorFileTooLarge: 'This file is too large. Please upload a file under 20 MB.',
    errorPdfTooLarge: 'This PDF is too large to analyze (limit around 4 MB). Please upload a smaller PDF, or take a photo of the pages you want explained.',
    errorEmptyFile: 'This file appears to be empty. Please choose another file.',
    errorReadFailed: 'Failed to read the selected file. Please try again with another file.',
    errorAnalyzeFailed: 'Failed to analyze the medical report. Please try again.',

    patientInfoDate: 'Patient Info & Date',
    reportDate: 'Report Date',
    laboratory: 'Laboratory',
    reportType: 'Report Type',
    quickSummaryTitle: 'Quick Medical Summary',
    whatItMeansTitle: 'What This Report Means for You',
    keyFindingsTitle: 'Key Findings',
    safetyGuidanceTitle: 'Safety & Action Guidance',
    criticalAlert: 'Critical Findings Flagged',
    standardReview: 'Standard Health Review',
    downloadPdf: 'Download / Save PDF',
    printSummary: 'Print Summary',

    labValuesHeader: 'Extracted Lab Values & Test Results',
    labValuesSubtitle: 'Filter and inspect reference ranges, measures, and targeted questions',
    searchLabPlaceholder: 'Search test name e.g. Glucose, HDL, ALT...',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    statusNormal: 'Normal Range',
    statusDiscussion: 'Discuss with Doctor',
    statusAttention: 'Requires Attention',
    resultLabel: 'Result',
    referenceRangeLabel: 'Reference Range',
    whatItMeasures: 'What It Measures',
    whyItMatters: 'Why It Matters',
    questionsToAskDoctor: 'Questions to Ask Your Doctor',

    vocabularyHeader: 'Medical Vocabulary & Analogies',
    vocabularySubtitle: 'Click any medical jargon to uncover plain-language definitions and relatable analogies',
    searchVocabPlaceholder: 'Search medical terms e.g. HDL, Creatinine, eGFR, ALT...',
    termsExtracted: 'Terms Extracted From Report',
    definitionLabel: 'Definition',
    everydayAnalogy: 'Everyday Analogy',
    fromReportBadge: 'From Report',

    doctorPrepHeader: 'Doctor Visit Preparation Checklist',
    doctorPrepSubtitle: 'Empower yourself with tailored questions, discussion points, and monitoring targets for your next appointment',
    printChecklist: 'Print / Save Checklist',
    topQuestionsTitle: 'Top Questions to Ask Your Doctor',
    checkedCount: 'Checked',
    typeCustomQuestion: 'Type a custom question for your doctor...',
    addQuestionBtn: 'Add Question',
    topicsToDiscuss: 'Topics to Discuss',
    thingsToMonitor: 'Things to Monitor',
    recommendedTimeline: 'Recommended Follow-up Timeline',
    highPriority: 'High Priority',
    recommendedPriority: 'Recommended',
    standardPriority: 'Standard',

    askAnythingHeader: 'Hi! Ask me anything about your medical report',
    askAnythingPlaceholder: 'Ask anything about your report...',

    chatSafetyBannerTitle: 'Educational AI Assistant',
    chatSafetyBannerText: 'Answers are generated based solely on your uploaded report. This tool does not provide medical diagnosis, prescription advice, or treatment plans. Always consult your doctor.',
    suggestedPrompts: 'Suggested:',
    chatInputPlaceholder: 'Ask anything about your report (e.g. What is HDL? Should I worry?)...',
    listenAudio: 'Listen Audio',
    stopAudio: 'Stop Audio',
    aiAnalyzingQuery: 'MediExplain AI is analyzing your query...',

    cameraModalTitle: 'Live Medical Document Scanner',
    alignReportFrame: 'Align medical document inside the frame',
    analyzingFrame: 'Analyzing frame with Gemini...',
    presetsLabel: 'Presets:',
    cameraInputPlaceholder: "Ask a question about what you're pointing the camera at...",
    analyzeFrameBtn: 'Analyze Frame',
    processFullReportBtn: 'Process Full Report',

    disclaimerTitle: 'Educational Disclaimer',
    disclaimerBody: 'MediExplain is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.',
    disclaimerDesc: ' — MediExplain is for educational purposes only and does not replace professional medical advice, diagnosis, or treatment.',
    criticalAlertTitle: 'Critical findings detected',
    criticalAlertDesc: 'This report contains one or more values that may require prompt medical review. Please contact your doctor or emergency services without delay.',
    customQuestionPlaceholder: 'Add your own custom question for the doctor...',
    appointmentNotesPlaceholder: 'Jot down symptoms, medication notes, or doctor responses during your appointment...',
    referenceSpectrum: 'Reference Spectrum',
    yourReportedResult: 'Your Reported Result',
    standardReferenceRange: 'Standard Reference Range',
    selectLanguageLabel: 'Select Language',
    printSubtitle: 'Patient Educational Summary Sheet',
    thTestName: 'Test Name',
    thResult: 'Result',
    thReferenceRange: 'Reference Range',
    thStatus: 'Status',
    thLabParameter: 'Lab Parameter',
    thProgressTrend: 'Progress Trend',
    baselineLabel: 'Baseline',
    analyzedPanel: 'Analyzed Panel',
    rangeCheckBadge: 'Range Check',
    doctorPrepBadge: 'Doctor Prep',
    nonDiagnosticBadge: 'Non-Diagnostic AI',
    footerText: 'MediExplain © 2026. Educational Medical Report Assistant.',
    viewingLabel: 'Viewing:',
    translatingReport: 'Translating your report…',
    poweredByGemini: 'Powered by Gemini 3.6 Flash & Vision',
    ocrVisionBadge: 'OCR & Vision',
    chatErrorPrefix: 'I encountered an issue processing your request:',
    tryAgain: 'Please try again.',
    patientReportBadge: 'Patient Report',
    reportDateLabel: 'Report Date:',
    facilityLabel: 'Facility:',
    labTestsIdentified: 'Lab Tests Identified',
    stopNarration: 'Stop Narration',
    listenToSummary: 'Listen to Summary',
    copiedLabel: 'Copied',
    copyLabel: 'Copy',
    executiveAiSummary: 'Executive AI Summary',
    plainLanguageExplanation: 'Plain Language Explanation',
    laymanGuideBadge: 'Layman Guide',
    labValuesLabel: 'Lab Values',
    labValuesHint: 'View color-coded normal vs abnormal values',
    medicalTermsLabel: 'Medical Terms',
    medicalTermsHint: 'Click any term for simple analogies',
    doctorQuestionsLabel: 'Doctor Questions',
    doctorQuestionsHint: 'Printable top questions for visit',
    askAnythingHint: 'Open the report assistant and ask a question',
    importantFindingsTitle: 'Important Findings',
    safetyNotesTitle: 'Safety Notes & Guidelines',
    generalCategory: 'General',
    refLabel: 'Ref:',
    viewWhyItMatters: 'View Why It Matters & Doctor Questions',
    whatThisValueMeasures: 'What this value measures:',
    whyItMattersHealth: 'Why it matters for your health:',
    closeBreakdown: 'Close Breakdown',
    lowLabel: 'Low',
    normalLabel: 'Normal',
    highLabel: 'High',
    rangeLabel: 'Range:',
    targetRange: 'Target Range',
    yourValueLabel: 'Your Value:',
    measuredValueLabel: 'Measured Value:',
    whyAskLabel: 'Why ask:',
    addLabel: 'Add',
    keyDiscussionPoints: 'Key Discussion Points',
    personalAppointmentNotes: 'Personal Appointment Notes',
    historicalTrendBadge: 'Historical Trend & Multi-Report Comparison',
    compareLabTitle: 'Compare Lab Results & Track Health Progress',
    compareLabSubtitle: 'Compare your current report side-by-side with previous tests to spot improvements or values needing discussion',
    compareWithLabel: 'Compare with:',
    keyComparisonInsights: 'Key Comparison Insights',
    comparingWord: 'Comparing',
    againstWord: 'against',
    previousTestLabel: 'Previous Test',
    comparisonSummaryTail: 'lab tests evaluated, key progress trends indicate stable to positive shifts across core metabolic markers.',
    outOfWord: 'Out of',
    sideBySideTitle: 'Side-by-Side Lab Parameter Comparison',
    currentValueLabel: 'Current Value',
    previousValueLabel: 'Previous Value',
    differenceLabel: 'Difference (Delta)',
    trendImproved: 'Improved / Favorable',
    trendElevated: 'Elevated / Watch',
    trendStable: 'Stable',
    notAvailableShort: 'N/A',
    todayLabel: 'Today',
    priorLabel: 'Prior',
    printDocumentLabel: 'Document:',
    printDisclaimer: 'Educational Disclaimer: This AI-generated summary is for educational understanding only and is not a medical diagnosis. Always consult a licensed healthcare professional.',
    printSection1: '1. Executive Summary',
    printSection2: '2. Patient-Friendly Explanation',
    printSection3: '3. Extracted Lab Test Measurements',
    printSection4: '4. Recommended Questions for Your Healthcare Visit',
    cameraScannerSubtitle: 'Point phone camera at document & ask questions',
    muteSpeech: 'Mute Speech Output',
    enableSpeech: 'Enable Speech Output',
    returnToUpload: 'Return to Upload',
    liveCameraInsights: 'Live Camera Insights',
    speakingLabel: 'Speaking',
    detectedValuesInFrame: 'Detected Values in Frame:',
    cameraAccessError: 'Unable to access camera. Please grant permission and use HTTPS.',
    frameCaptureError: 'Failed to capture video frame.',
    frameAnalyzeError: 'Error analyzing camera frame',
  },
  fr: {
    brandTitle: 'MediExplain',
    brandSubtitle: 'Traducteur de rapports médicaux simple et accessible',
    tryDemoReport: 'Rapport de Démo',
    demos: 'Démos',
    selectSampleReport: 'Sélectionner un examen de démo',
    liveCameraScanner: 'Scanner Caméra en En direct',
    camera: 'Caméra',
    printReport: 'Imprimer / Sauvegarder',
    uploadNewReport: 'Nouveau Rapport',
    backToUpload: 'Retour au Téléversement',
    lightMode: 'Passer au Mode Clair',
    darkMode: 'Passer au Mode Sombre',
    languageSelect: 'Langue',

    tabSummary: 'Résumé du Rapport',
    tabLabValues: 'Analyses Médicales',
    tabVocabulary: 'Vocabulaire',
    tabAskAnything: 'Poser une Question',
    tabDoctorPrep: 'Préparer la Consultation',
    tabCompare: 'Comparer les Tendances',

    poweredBy: 'Propulsé par Gemini AI',
    heroTitle: 'Comprenez Vos Examens Médicaux en Quelques Secondes',
    heroSubtitle: 'Téléchargez vos prises de sang, bilans biologiques ou comptes-rendus. MediExplain extrait les valeurs, explique le jargon médical avec des analogies simples et prépare vos questions pour le médecin.',
    dragDropText: 'Glissez-déposez votre rapport ici, ou',
    browseFiles: 'Parcourir vos fichiers',
    supportsFormat: 'Prend en charge les fichiers PDF, images JPEG, PNG ou photos de documents',
    uploadPdfImage: 'Téléverser PDF / Image',
    takePhotoCamera: 'Prendre une Photo / Scanner',
    analyzingReport: 'Analyse du Rapport Médical en cours...',
    geminiAnalyzing: 'Gemini Vision lit les tableaux d\'analyse, les valeurs de référence et le texte clinique...',
    ocrVisionStep: 'OCR & Vision',
    rangeCheckStep: 'Vérification',
    doctorPrepStep: 'Préparation Docteur',
    orTestWithDemo: 'Ou testez immédiatement avec un rapport exemple préchargé :',
    viewSampleReport: 'Voir l\'Exemple',
    dragDropPrompt: 'Glissez-déposez votre rapport médical ici, ou cliquez pour parcourir',
    supportedFormats: 'PDF, JPG, PNG, WEBP, HEIC — jusqu\'à 20 Mo',
    uploadPdfBtn: 'Téléverser PDF / Image',
    takePhotoBtn: 'Prendre une Photo / Scanner',
    analyzingReportTitle: 'Analyse du rapport médical en cours...',
    analyzingReportStep: 'Gemini Vision lit les tableaux d\'analyse, les valeurs de référence et le texte clinique...',
    demoReportsTitle: 'Ou testez immédiatement avec un rapport de démonstration',

    stepReadingFile: 'Lecture du document et traitement des données image/PDF...',
    stepOptimizingImage: 'Optimisation de l\'image pour l\'analyse...',
    stepAnalyzing: 'Gemini analyse les tableaux et la terminologie médicale...',
    errorUnsupportedType: 'Type de fichier non pris en charge. Veuillez téléverser un PDF ou une image (JPG, PNG, WEBP, HEIC).',
    errorFileTooLarge: 'Ce fichier est trop volumineux. Veuillez téléverser un fichier de moins de 20 Mo.',
    errorPdfTooLarge: "Ce PDF est trop volumineux pour être analysé (limite d'environ 4 Mo). Veuillez téléverser un PDF plus petit, ou prendre une photo des pages à expliquer.",
    errorEmptyFile: 'Ce fichier semble vide. Veuillez choisir un autre fichier.',
    errorReadFailed: 'Impossible de lire le fichier sélectionné. Veuillez réessayer avec un autre fichier.',
    errorAnalyzeFailed: 'Échec de l\'analyse du rapport médical. Veuillez réessayer.',

    patientInfoDate: 'Informations Patient & Date',
    reportDate: 'Date du Rapport',
    laboratory: 'Laboratoire',
    reportType: 'Type d\'Examen',
    quickSummaryTitle: 'Résumé Médical Synthétique',
    whatItMeansTitle: 'Ce Que Ce Rapport Signifie Pour Vous',
    keyFindingsTitle: 'Constats Principaux',
    safetyGuidanceTitle: 'Consignes de Sécurité et Préconisations',
    criticalAlert: 'Résultats Nécessitant Attention Immédiate',
    standardReview: 'Bilan de Santé Standard',
    downloadPdf: 'Télécharger / Sauvegarder PDF',
    printSummary: 'Imprimer le Résumé',

    labValuesHeader: 'Valeurs de Laboratoire & Résultats',
    labValuesSubtitle: 'Filtrez et examinez les normes, la signification et les questions suggérées',
    searchLabPlaceholder: 'Rechercher un examen ex: Cholestérol, Glycémie, Transaminases...',
    allCategories: 'Toutes les Catégories',
    allStatuses: 'Tous les Statuts',
    statusNormal: 'Valeur Normale',
    statusDiscussion: 'À Discuter avec le Médecin',
    statusAttention: 'Nécessite Attention',
    resultLabel: 'Résultat',
    referenceRangeLabel: 'Valeurs de Référence',
    whatItMeasures: 'Ce Que Ça Mesure',
    whyItMatters: 'Pourquoi C\'est Important',
    questionsToAskDoctor: 'Questions à Poser à Votre Médecin',

    vocabularyHeader: 'Vocabulaire Médical & Analogies',
    vocabularySubtitle: 'Cliquez sur un terme médical pour obtenir une définition simple et une analogie de la vie courante',
    searchVocabPlaceholder: 'Rechercher un terme ex: HDL, Créatinine, Débit de Filtration...',
    termsExtracted: 'Termes Extraits du Rapport',
    definitionLabel: 'Définition',
    everydayAnalogy: 'Analogie du Quotidien',
    fromReportBadge: 'Du Rapport',

    doctorPrepHeader: 'Liste de Préparation à la Consultation',
    doctorPrepSubtitle: 'Préparez votre rendez-vous médical avec des questions ciblées et les éléments à surveiller',
    printChecklist: 'Imprimer / Sauvegarder la Liste',
    topQuestionsTitle: 'Questions Principales à Poser',
    checkedCount: 'Coché(e)s',
    typeCustomQuestion: 'Saisissez une question personnalisée...',
    addQuestionBtn: 'Ajouter',
    topicsToDiscuss: 'Sujets à Aborder',
    thingsToMonitor: 'Éléments à Surveiller',
    recommendedTimeline: 'Délai de Suivi Recommandé',
    highPriority: 'Priorité Haute',
    recommendedPriority: 'Recommandé',
    standardPriority: 'Standard',

    askAnythingHeader: 'Bonjour ! Posez-moi toutes vos questions sur votre rapport médical',
    askAnythingPlaceholder: 'Posez une question sur votre rapport...',

    chatSafetyBannerTitle: 'Assistant IA Éducatif',
    chatSafetyBannerText: 'Les réponses sont générées uniquement à partir de votre rapport. Cet outil ne fournit aucun diagnostic médical ni ordonnance. Consultez toujours votre médecin.',
    suggestedPrompts: 'Suggestions :',
    chatInputPlaceholder: 'Posez n\'importe quelle question (ex: Que signifie HDL ? Dois-je m\'inquiéter ?)...',
    listenAudio: 'Écouter Audio',
    stopAudio: 'Arrêter Audio',
    aiAnalyzingQuery: 'MediExplain analyse votre demande...',

    cameraModalTitle: 'Scanner Caméra de Document Médical',
    alignReportFrame: 'Cadrez le document médical dans l\'écran',
    analyzingFrame: 'Analyse de l\'image par Gemini...',
    presetsLabel: 'Questions Rapides :',
    cameraInputPlaceholder: 'Posez une question sur ce que vise la caméra...',
    analyzeFrameBtn: 'Analyser l\'Image',
    processFullReportBtn: 'Traiter le Rapport Complet',

    disclaimerTitle: 'Avertissement Éducatif',
    disclaimerBody: 'MediExplain est un outil purement éducatif et informatif. Il ne remplace en aucun cas l\'avis, le diagnostic ou le traitement d\'un professionnel de santé.',
    disclaimerDesc: ' — MediExplain est un outil éducatif uniquement et ne remplace pas l\'avis, le diagnostic ou le traitement d\'un professionnel de santé.',
    criticalAlertTitle: 'Résultats critiques détectés',
    criticalAlertDesc: 'Ce rapport contient une ou plusieurs valeurs pouvant nécessiter un avis médical rapide. Contactez votre médecin ou les services d\'urgence sans tarder.',
    customQuestionPlaceholder: 'Ajoutez votre propre question pour le médecin...',
    appointmentNotesPlaceholder: 'Notez les symptômes, les médicaments ou les réponses du médecin pendant votre rendez-vous...',
    referenceSpectrum: 'Spectre de Référence',
    yourReportedResult: 'Votre Résultat',
    standardReferenceRange: 'Plage de Référence Standard',
    selectLanguageLabel: 'Choisir la langue',
    printSubtitle: 'Fiche de Synthèse Éducative pour le Patient',
    thTestName: 'Nom du Test',
    thResult: 'Résultat',
    thReferenceRange: 'Plage de Référence',
    thStatus: 'Statut',
    thLabParameter: 'Paramètre de Laboratoire',
    thProgressTrend: 'Tendance',
    baselineLabel: 'Référence Initiale',
    analyzedPanel: 'Bilan Analysé',
    rangeCheckBadge: 'Vérification des Plages',
    doctorPrepBadge: 'Préparation Médecin',
    nonDiagnosticBadge: 'IA Non Diagnostique',
    footerText: 'MediExplain © 2026. Assistant éducatif de rapports médicaux.',
    viewingLabel: 'Affichage :',
    translatingReport: 'Traduction de votre rapport…',
    poweredByGemini: 'Propulsé par Gemini 3.6 Flash & Vision',
    ocrVisionBadge: 'OCR & Vision',
    chatErrorPrefix: 'J\'ai rencontré un problème lors du traitement de votre demande :',
    tryAgain: 'Veuillez réessayer.',
    patientReportBadge: 'Rapport Patient',
    reportDateLabel: 'Date du rapport :',
    facilityLabel: 'Établissement :',
    labTestsIdentified: 'Analyses identifiées',
    stopNarration: 'Arrêter la lecture',
    listenToSummary: 'Écouter le résumé',
    copiedLabel: 'Copié',
    copyLabel: 'Copier',
    executiveAiSummary: 'Synthèse IA',
    plainLanguageExplanation: 'Explication en langage simple',
    laymanGuideBadge: 'Guide Simplifié',
    labValuesLabel: 'Valeurs de Laboratoire',
    labValuesHint: 'Voir les valeurs normales et anormales par code couleur',
    medicalTermsLabel: 'Termes Médicaux',
    medicalTermsHint: 'Cliquez sur un terme pour une analogie simple',
    doctorQuestionsLabel: 'Questions au Médecin',
    doctorQuestionsHint: 'Questions clés imprimables pour la consultation',
    askAnythingHint: 'Ouvrez l’assistant et posez une question sur votre rapport',
    importantFindingsTitle: 'Constatations Importantes',
    safetyNotesTitle: 'Consignes de Sécurité',
    generalCategory: 'Général',
    refLabel: 'Réf. :',
    viewWhyItMatters: 'Voir pourquoi c\'est important & questions au médecin',
    whatThisValueMeasures: 'Ce que cette valeur mesure :',
    whyItMattersHealth: 'Pourquoi c\'est important pour votre santé :',
    closeBreakdown: 'Fermer le détail',
    lowLabel: 'Bas',
    normalLabel: 'Normal',
    highLabel: 'Élevé',
    rangeLabel: 'Plage :',
    targetRange: 'Plage Cible',
    yourValueLabel: 'Votre valeur :',
    measuredValueLabel: 'Valeur mesurée :',
    whyAskLabel: 'Pourquoi demander :',
    addLabel: 'Ajouter',
    keyDiscussionPoints: 'Points Clés à Discuter',
    personalAppointmentNotes: 'Notes Personnelles de Consultation',
    historicalTrendBadge: 'Tendance historique & comparaison multi-rapports',
    compareLabTitle: 'Comparez vos analyses et suivez votre progression',
    compareLabSubtitle: 'Comparez votre rapport actuel avec des analyses précédentes pour repérer les améliorations ou les valeurs à discuter',
    compareWithLabel: 'Comparer avec :',
    keyComparisonInsights: 'Points Clés de la Comparaison',
    comparingWord: 'Comparaison de',
    againstWord: 'avec',
    previousTestLabel: 'Analyse Précédente',
    comparisonSummaryTail: 'analyses évaluées, les tendances indiquent une évolution stable à positive des principaux marqueurs métaboliques.',
    outOfWord: 'Sur',
    sideBySideTitle: 'Comparaison Détaillée des Paramètres',
    currentValueLabel: 'Valeur Actuelle',
    previousValueLabel: 'Valeur Précédente',
    differenceLabel: 'Différence (Delta)',
    trendImproved: 'Amélioré / Favorable',
    trendElevated: 'Élevé / À surveiller',
    trendStable: 'Stable',
    notAvailableShort: 'N/D',
    todayLabel: "Aujourd'hui",
    priorLabel: 'Antérieur',
    printDocumentLabel: 'Document :',
    printDisclaimer: 'Avertissement éducatif : ce résumé généré par IA sert uniquement à la compréhension et ne constitue pas un diagnostic médical. Consultez toujours un professionnel de santé qualifié.',
    printSection1: '1. Synthèse Générale',
    printSection2: '2. Explication Simplifiée',
    printSection3: '3. Mesures de Laboratoire Extraites',
    printSection4: '4. Questions Recommandées pour Votre Consultation',
    cameraScannerSubtitle: 'Pointez la caméra vers le document et posez vos questions',
    muteSpeech: 'Couper la voix',
    enableSpeech: 'Activer la voix',
    returnToUpload: 'Retour au téléversement',
    liveCameraInsights: 'Analyse Caméra en Direct',
    speakingLabel: 'Lecture en cours',
    detectedValuesInFrame: 'Valeurs détectées dans l\'image :',
    cameraAccessError: 'Impossible d\'accéder à la caméra. Autorisez l\'accès et utilisez HTTPS.',
    frameCaptureError: 'Échec de la capture de l\'image vidéo.',
    frameAnalyzeError: 'Erreur lors de l\'analyse de l\'image',
  },
  ar: {
    brandTitle: 'MediExplain',
    brandSubtitle: 'مترجم التقارير الطبية بلغة بسيطة ومفهومة',
    tryDemoReport: 'تجربة تقرير توضيحي',
    demos: 'نماذج',
    selectSampleReport: 'اختر تقريراً طبياً نموذجياً',
    liveCameraScanner: 'ماسح الكاميرا المباشر',
    camera: 'الكاميرا',
    printReport: 'طباعة / حفظ ملخص التقرير',
    uploadNewReport: 'تحميل تقرير جديد',
    backToUpload: 'العودة للتحميل',
    lightMode: 'التبديل إلى الوضع الفاتح',
    darkMode: 'التبديل إلى الوضع الداكن',
    languageSelect: 'اللغة',

    tabSummary: 'ملخص التقرير',
    tabLabValues: 'النتائج والتحاليل',
    tabVocabulary: 'المصطلحات الطبية',
    tabAskAnything: 'اسأل أي سؤال',
    tabDoctorPrep: 'تحضير للزيارة',
    tabCompare: 'مقارنة الاتجاهات',

    poweredBy: 'مدعوم بـ Gemini AI',
    heroTitle: 'افهم تقاريرك الطبية في ثوانٍ',
    heroSubtitle: 'قم بتحميل أي تحليل دم، فحص مخبري، أو وثيقة سريرية. يقوم MediExplain باستخراج القيم المخبرية، وشرح المصطلحات المعقدة بأمثلة مبسطة، وتجهيز الأسئلة لطبيبك.',
    dragDropText: 'اسحب وأسقط التقرير الطبي هنا، أو',
    browseFiles: 'تصفح الملفات',
    supportsFormat: 'يدعم تقارير PDF، صور JPEG و PNG، أو صور المستندات الطبية',
    uploadPdfImage: 'تحميل ملف PDF / صورة',
    takePhotoCamera: 'التقاط صورة / ماسح الكاميرا',
    analyzingReport: 'جاري تحليل التقرير الطبي...',
    geminiAnalyzing: 'يقوم Gemini Vision بقراءة الجداول والمدى المرجعي والنصوص السريرية...',
    ocrVisionStep: 'التعرف البصري (OCR)',
    rangeCheckStep: 'فحص المدى المرجعي',
    doctorPrepStep: 'تحضير استشارة الطبيب',
    orTestWithDemo: 'أو جرب فوراً باستخدام تقارير نموذجية مسبقة التحميل:',
    viewSampleReport: 'عرض التقرير النموذج',
    dragDropPrompt: 'اسحب وأسقط تقريرك الطبي هنا، أو انقر للتصفح',
    supportedFormats: 'PDF، JPG، PNG، WEBP، HEIC — حتى 20 ميغابايت',
    uploadPdfBtn: 'تحميل ملف PDF / صورة',
    takePhotoBtn: 'التقاط صورة / ماسح الكاميرا',
    analyzingReportTitle: 'جاري تحليل التقرير الطبي...',
    analyzingReportStep: 'يقوم Gemini Vision بقراءة الجداول والمدى المرجعي والنصوص السريرية...',
    demoReportsTitle: 'أو جرب فوراً باستخدام تقرير نموذجي',

    stepReadingFile: 'جاري قراءة المستند ومعالجة بيانات الصورة/PDF...',
    stepOptimizingImage: 'جاري تحسين الصورة للتحليل...',
    stepAnalyzing: 'يقوم Gemini بتحليل الجداول والمصطلحات الطبية...',
    errorUnsupportedType: 'نوع الملف غير مدعوم. يرجى تحميل ملف PDF أو صورة (JPG، PNG، WEBP، HEIC).',
    errorFileTooLarge: 'حجم الملف كبير جداً. يرجى تحميل ملف أقل من 20 ميغابايت.',
    errorPdfTooLarge: 'ملف PDF هذا كبير جداً للتحليل (الحد الأقصى حوالي 4 ميغابايت). يرجى تحميل ملف أصغر، أو التقاط صورة للصفحات المطلوب شرحها.',
    errorEmptyFile: 'يبدو أن هذا الملف فارغ. يرجى اختيار ملف آخر.',
    errorReadFailed: 'تعذر قراءة الملف المحدد. يرجى المحاولة مرة أخرى بملف آخر.',
    errorAnalyzeFailed: 'فشل تحليل التقرير الطبي. يرجى المحاولة مرة أخرى.',

    patientInfoDate: 'معلومات المريض والتاريخ',
    reportDate: 'تاريخ التقرير',
    laboratory: 'المختبر',
    reportType: 'نوع التقرير',
    quickSummaryTitle: 'ملخص طبي سريع',
    whatItMeansTitle: 'ماذا يعني هذا التقرير بالنسبة لك',
    keyFindingsTitle: 'النتائج الرئيسية',
    safetyGuidanceTitle: 'إرشادات السلامة والإجراءات',
    criticalAlert: 'تم تحديد نتائج مهمة تستدعي الانتباه',
    standardReview: 'مراجعة صحية قياسية',
    downloadPdf: 'تحميل / حفظ ملف PDF',
    printSummary: 'طباعة الملخص',

    labValuesHeader: 'النتائج المخبرية المستخرجة',
    labValuesSubtitle: 'تصفح وتصفّح المدى المرجعي والمقاييس والأسئلة الموجهة لطبيبك',
    searchLabPlaceholder: 'ابحث عن اسم التحليل مثل السكر، الكوليسترول، ALT...',
    allCategories: 'جميع الفئات',
    allStatuses: 'جميع الحالات',
    statusNormal: 'ضمن المدى الطبيعي',
    statusDiscussion: 'للمناقشة مع الطبيب',
    statusAttention: 'يتطلب انتباهاً',
    resultLabel: 'النتيجة',
    referenceRangeLabel: 'المدى المرجعي',
    whatItMeasures: 'ما الذي يقيسه هذا الفحص',
    whyItMatters: 'لماذا هو مهم',
    questionsToAskDoctor: 'أسئلة لتطرحها على طبيبك',

    vocabularyHeader: 'المصطلحات الطبية والتشبيهات المبسطة',
    vocabularySubtitle: 'انقر على أي مصطلح طبي لاكتشاف تعريفه بلغة بسيطة وتشبيهات ملموسة',
    searchVocabPlaceholder: 'ابحث عن مصطلح طبي مثل HDL، الكرياتينين، eGFR...',
    termsExtracted: 'المصطلحات المستخرجة من التقرير',
    definitionLabel: 'التعريف',
    everydayAnalogy: 'تشبيه مبسط من الحياة اليومية',
    fromReportBadge: 'من التقرير',

    doctorPrepHeader: 'قائمة تحضير زيارة الطبيب',
    doctorPrepSubtitle: 'جهّز نفسك بالأسئلة المخصصة ونقاط النقاش والأهداف المراد متابعتها في موعدك القادم',
    printChecklist: 'طباعة / حفظ القائمة',
    topQuestionsTitle: 'أهم الأسئلة لتطرحها على طبيبك',
    checkedCount: 'تم اختياره',
    typeCustomQuestion: 'اكتب سؤالاً مخصصاً لطبيبك...',
    addQuestionBtn: 'إضافة سؤال',
    topicsToDiscuss: 'مواضيع لمناقشتها',
    thingsToMonitor: 'أمور يجب مراقبتها',
    recommendedTimeline: 'الجدول الزمني الموصى به للمتابعة',
    highPriority: 'أولوية عالية',
    recommendedPriority: 'موصى به',
    standardPriority: 'قياسي',

    askAnythingHeader: 'مرحباً! اسألني أي شيء عن تقريرك الطبي',
    askAnythingPlaceholder: 'اسأل أي سؤال عن تقريرك...',

    chatSafetyBannerTitle: 'مساعد الذكاء الاصطناعي التعليمي',
    chatSafetyBannerText: 'يتم توليد الإجابات بناءً على تقريرك المرفوع فقط. هذه الأداة لا تقدم تشخيصاً طبياً أو نصائح وصفات علاجية. استشر طبيبك دائماً.',
    suggestedPrompts: 'مقترحات:',
    chatInputPlaceholder: 'اسأل أي سؤال عن تقريرك (مثلاً: ما هو HDL؟ هل يجب أن أقلق؟)...',
    listenAudio: 'استماع للصوت',
    stopAudio: 'إيقاف الصوت',
    aiAnalyzingQuery: 'جاري تحليل استفسارك بواسطة MediExplain...',

    cameraModalTitle: 'ماسح المستندات الطبية المباشر',
    alignReportFrame: 'قم بضبط المستند الطبي داخل الإطار',
    analyzingFrame: 'جاري تحليل الإطار بواسطة Gemini...',
    presetsLabel: 'أسئلة سريعة:',
    cameraInputPlaceholder: 'اسأل سؤالاً عما توجه الكاميرا إليه...',
    analyzeFrameBtn: 'تحليل الإطار',
    processFullReportBtn: 'معالجة التقرير بالكامل',

    disclaimerTitle: 'إخلاء مسؤولية تعليمي',
    disclaimerBody: 'MediExplain مخصص لأغراض تعليمية وإعلامية فقط. لا يعد بديلاً عن الاستشارة الطبية الاحترافية أو التشخيص أو العلاج.',
    disclaimerDesc: ' — MediExplain أداة تعليمية فقط ولا تحل محل الاستشارة الطبية الاحترافية أو التشخيص أو العلاج.',
    criticalAlertTitle: 'تم اكتشاف نتائج حرجة',
    criticalAlertDesc: 'يحتوي هذا التقرير على قيمة أو أكثر قد تتطلب مراجعة طبية عاجلة. يرجى الاتصال بطبيبك أو خدمات الطوارئ دون تأخير.',
    customQuestionPlaceholder: 'أضف سؤالك الخاص للطبيب...',
    appointmentNotesPlaceholder: 'دوّن الأعراض أو الأدوية أو إجابات الطبيب أثناء موعدك...',
    referenceSpectrum: 'النطاق المرجعي',
    yourReportedResult: 'نتيجتك المسجلة',
    standardReferenceRange: 'النطاق المرجعي القياسي',
    selectLanguageLabel: 'اختر اللغة',
    printSubtitle: 'ورقة ملخص تعليمية للمريض',
    thTestName: 'اسم الفحص',
    thResult: 'النتيجة',
    thReferenceRange: 'النطاق المرجعي',
    thStatus: 'الحالة',
    thLabParameter: 'مؤشر المختبر',
    thProgressTrend: 'اتجاه التطور',
    baselineLabel: 'القياس الأساسي',
    analyzedPanel: 'التحليل المدروس',
    rangeCheckBadge: 'فحص النطاقات',
    doctorPrepBadge: 'تحضير الطبيب',
    nonDiagnosticBadge: 'ذكاء اصطناعي غير تشخيصي',
    footerText: 'MediExplain © 2026. مساعد تعليمي للتقارير الطبية.',
    viewingLabel: 'المعروض:',
    translatingReport: 'جارٍ ترجمة تقريرك…',
    poweredByGemini: 'مدعوم بـ Gemini 3.6 Flash والرؤية الحاسوبية',
    ocrVisionBadge: 'التعرف الضوئي والرؤية',
    chatErrorPrefix: 'واجهت مشكلة أثناء معالجة طلبك:',
    tryAgain: 'يرجى المحاولة مرة أخرى.',
    patientReportBadge: 'تقرير المريض',
    reportDateLabel: 'تاريخ التقرير:',
    facilityLabel: 'المختبر:',
    labTestsIdentified: 'تحاليل تم التعرف عليها',
    stopNarration: 'إيقاف القراءة',
    listenToSummary: 'استمع إلى الملخص',
    copiedLabel: 'تم النسخ',
    copyLabel: 'نسخ',
    executiveAiSummary: 'الملخص التنفيذي بالذكاء الاصطناعي',
    plainLanguageExplanation: 'شرح بلغة بسيطة',
    laymanGuideBadge: 'دليل مبسط',
    labValuesLabel: 'نتائج التحاليل',
    labValuesHint: 'اعرض القيم الطبيعية وغير الطبيعية بالألوان',
    medicalTermsLabel: 'المصطلحات الطبية',
    medicalTermsHint: 'اضغط على أي مصطلح للحصول على تشبيه مبسط',
    doctorQuestionsLabel: 'أسئلة للطبيب',
    doctorQuestionsHint: 'أهم الأسئلة القابلة للطباعة قبل الزيارة',
    askAnythingHint: 'افتح مساعد التقرير واطرح سؤالك',
    importantFindingsTitle: 'النتائج المهمة',
    safetyNotesTitle: 'ملاحظات وإرشادات السلامة',
    generalCategory: 'عام',
    refLabel: 'المرجع:',
    viewWhyItMatters: 'اعرض أهمية النتيجة وأسئلة الطبيب',
    whatThisValueMeasures: 'ما الذي تقيسه هذه النتيجة:',
    whyItMattersHealth: 'لماذا تهم صحتك:',
    closeBreakdown: 'إغلاق التفاصيل',
    lowLabel: 'منخفض',
    normalLabel: 'طبيعي',
    highLabel: 'مرتفع',
    rangeLabel: 'النطاق:',
    targetRange: 'النطاق المستهدف',
    yourValueLabel: 'قيمتك:',
    measuredValueLabel: 'القيمة المقاسة:',
    whyAskLabel: 'لماذا تسأل:',
    addLabel: 'إضافة',
    keyDiscussionPoints: 'نقاط النقاش الأساسية',
    personalAppointmentNotes: 'ملاحظات شخصية للموعد',
    historicalTrendBadge: 'التطور التاريخي ومقارنة عدة تقارير',
    compareLabTitle: 'قارن نتائج التحاليل وتابع تطور صحتك',
    compareLabSubtitle: 'قارن تقريرك الحالي مع التحاليل السابقة لاكتشاف التحسن أو القيم التي تحتاج مناقشة',
    compareWithLabel: 'قارن مع:',
    keyComparisonInsights: 'أبرز نتائج المقارنة',
    comparingWord: 'مقارنة',
    againstWord: 'مع',
    previousTestLabel: 'التحليل السابق',
    comparisonSummaryTail: 'تحليلاً تم تقييمها، وتشير المؤشرات إلى تطور مستقر أو إيجابي في المؤشرات الأيضية الأساسية.',
    outOfWord: 'من أصل',
    sideBySideTitle: 'مقارنة تفصيلية لمؤشرات المختبر',
    currentValueLabel: 'القيمة الحالية',
    previousValueLabel: 'القيمة السابقة',
    differenceLabel: 'الفارق',
    trendImproved: 'تحسّن / إيجابي',
    trendElevated: 'مرتفع / يستوجب المتابعة',
    trendStable: 'مستقر',
    notAvailableShort: 'غير متوفر',
    todayLabel: 'اليوم',
    priorLabel: 'سابق',
    printDocumentLabel: 'الملف:',
    printDisclaimer: 'تنويه تعليمي: هذا الملخص المُولَّد بالذكاء الاصطناعي لأغراض الفهم التعليمي فقط وليس تشخيصاً طبياً. استشر دائماً مختصاً صحياً مرخصاً.',
    printSection1: '1. الملخص التنفيذي',
    printSection2: '2. شرح مبسط للمريض',
    printSection3: '3. القياسات المستخرجة من التحاليل',
    printSection4: '4. أسئلة مقترحة لزيارتك الطبية',
    cameraScannerSubtitle: 'وجّه كاميرا هاتفك نحو المستند واطرح أسئلتك',
    muteSpeech: 'كتم الصوت',
    enableSpeech: 'تفعيل الصوت',
    returnToUpload: 'العودة إلى الرفع',
    liveCameraInsights: 'تحليلات الكاميرا المباشرة',
    speakingLabel: 'جارٍ التحدث',
    detectedValuesInFrame: 'القيم المكتشفة في الصورة:',
    cameraAccessError: 'تعذّر الوصول إلى الكاميرا. يرجى منح الإذن واستخدام HTTPS.',
    frameCaptureError: 'فشل التقاط صورة الفيديو.',
    frameAnalyzeError: 'خطأ أثناء تحليل صورة الكاميرا',
  }
};
