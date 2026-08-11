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
    criticalAlertDesc: 'This report contains one or more values that may require prompt medical review. Please contact your doctor or emergency services without delay.'
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
    criticalAlertDesc: 'Ce rapport contient une ou plusieurs valeurs pouvant nécessiter un avis médical rapide. Contactez votre médecin ou les services d\'urgence sans tarder.'
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
    criticalAlertDesc: 'يحتوي هذا التقرير على قيمة أو أكثر قد تتطلب مراجعة طبية عاجلة. يرجى الاتصال بطبيبك أو خدمات الطوارئ دون تأخير.'
  }
};
