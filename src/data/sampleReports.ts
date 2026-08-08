/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReportAnalysisResult } from '../types';
import { Language } from '../utils/i18n';

export interface SampleReport {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: string;
  rawText: string;
  analysis: ReportAnalysisResult;
}

export const SAMPLE_REPORTS_EN: SampleReport[] = [
  {
    id: 'lipid-panel-demo',
    title: 'Lipid Profile & Cardio Panel',
    subtitle: 'Comprehensive cholesterol and cardiovascular risk screen',
    date: '2026-07-28',
    type: 'Blood Test / Cardiology',
    rawText: `METROPOLITAN DIAGNOSTICS LAB
Patient: Demo Patient | Date: 2026-07-28 | Specimen: Blood
TEST NAME                   RESULT       REFERENCE RANGE    UNITS    FLAG
Total Cholesterol           238          120 - 200          mg/dL    HIGH
Triglycerides               195          35 - 150           mg/dL    HIGH
HDL Cholesterol             38           > 40               mg/dL    LOW
LDL Cholesterol (Calc)      161          < 100              mg/dL    HIGH
Non-HDL Cholesterol         200          < 130              mg/dL    HIGH
Cholesterol/HDL Ratio       6.26         < 5.0              ratio    HIGH
hs-CRP (Cardio CRP)         3.8          < 1.0              mg/L     HIGH`,
    analysis: {
      id: 'lipid-panel-demo-analysis',
      fileName: 'Lipid_Panel_Cardio_Report.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-28',
        reportType: 'Lipid Profile & Cardio Panel',
        laboratory: 'Metropolitan Diagnostics Lab',
      },
      shortSummary: 'This report shows elevated total cholesterol, high LDL ("bad") cholesterol, elevated triglycerides, low HDL ("good") cholesterol, and mild vascular inflammation (hs-CRP).',
      laymanExplanation: 'Think of cholesterol like traffic in your blood vessels. HDL acts as the clean-up tow truck that removes excess grease, while LDL and triglycerides are like extra cargo trucks. Your report shows that cargo levels (LDL & Triglycerides) are high while the clean-up team (HDL) is running low. hs-CRP shows mild irritation in the highway walls. These can usually be improved with dietary shifts, active routine, and doctor guidance.',
      importantFindings: [
        'Total Cholesterol is 238 mg/dL (Desirable is below 200 mg/dL).',
        'LDL ("bad") cholesterol is 161 mg/dL, which is considered high.',
        'HDL ("good") cholesterol is 38 mg/dL, slightly lower than target (>40 mg/dL).',
        'Triglycerides are elevated at 195 mg/dL (Desirable is under 150 mg/dL).',
        'hs-CRP is 3.8 mg/L, suggesting low-grade arterial inflammation to discuss with your doctor.'
      ],
      safetyAlerts: [
        'These results highlight cardiovascular risk factors. Schedule a routine appointment with your physician to discuss heart-healthy strategies.',
        'If you ever experience sudden chest tightness, shortness of breath, or arm numbness, seek immediate emergency medical care.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'val-1',
          name: 'Total Cholesterol',
          value: '238',
          unit: 'mg/dL',
          referenceRange: '120 - 200',
          status: 'discussion',
          category: 'Lipids',
          whatItMeasures: 'The combined total amount of cholesterol carried in all your blood lipoproteins.',
          whyItMatters: 'Higher total cholesterol means there is more waxy substance floating in your bloodstream that could contribute to arterial plaque over time.',
          questionsToAsk: [
            'How much does my overall cardiovascular risk increase with a total cholesterol of 238?',
            'Would lifestyle changes alone be sufficient to lower this number, or should we discuss medication options?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-2',
          name: 'LDL Cholesterol (Calculated)',
          value: '161',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'discussion',
          category: 'Lipids',
          whatItMeasures: 'Low-Density Lipoprotein, often called "bad cholesterol", which carries fatty particles from the liver out into tissue arteries.',
          whyItMatters: 'When LDL is high, excess particles can enter artery walls and form hard plaque deposits that restrict blood flow over time.',
          questionsToAsk: [
            'What is my personalized target LDL level based on my age and overall health history?',
            'What specific dietary adjustments have the biggest impact on lowering LDL?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-3',
          name: 'HDL Cholesterol',
          value: '38',
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: 'discussion',
          category: 'Lipids',
          whatItMeasures: 'High-Density Lipoprotein, often called "good cholesterol", which sweeps up excess cholesterol and returns it to the liver for recycling.',
          whyItMatters: 'Higher HDL levels protect your blood vessels by actively vacuuming up excess grease. A lower level means less protective activity.',
          questionsToAsk: [
            'How can regular aerobic exercise and dietary healthy fats help boost my HDL?',
            'Does smoking or sedentary activity lower HDL levels?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-4',
          name: 'Triglycerides',
          value: '195',
          unit: 'mg/dL',
          referenceRange: '35 - 150',
          status: 'discussion',
          category: 'Lipids',
          whatItMeasures: 'The most common type of fat stored in your body, derived from unused calories, sugars, and alcohol.',
          whyItMatters: 'Elevated triglycerides along with low HDL increase metabolic strain and can contribute to arterial thickening.',
          questionsToAsk: [
            'Should I reduce refined carbohydrates or alcohol intake to bring my triglycerides below 150?',
            'Could high triglycerides be linked to insulin sensitivity or blood sugar levels?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-5',
          name: 'hs-CRP (Cardio CRP)',
          value: '3.8',
          unit: 'mg/L',
          referenceRange: '< 1.0',
          status: 'discussion',
          category: 'Inflammation',
          whatItMeasures: 'High-sensitivity C-reactive protein, a protein produced by the liver when there is low-grade inflammation in blood vessel walls.',
          whyItMatters: 'Higher hs-CRP levels indicate that arterial tissues might be mildly inflamed, making plaque deposits more vulnerable to rupture.',
          questionsToAsk: [
            'Does this CRP level indicate cardiovascular strain or could a recent minor illness/infection have caused a temporary spike?',
            'Should we repeat the hs-CRP test in 4 to 6 weeks to see if it normalizes?'
          ],
          isAbnormal: true
        }
      ],
      vocabulary: [
        {
          term: 'Atherogenic',
          definition: 'Tending to cause or promote the formation of fatty plaques in the arteries.',
          whyItMatters: 'Identifies lipid combinations that encourage arterial hardening.',
          analogy: 'Like sticky mud that tends to cling to the inner walls of a plumbing pipe.',
          category: 'Cardiology'
        },
        {
          term: 'HDL (High-Density Lipoprotein)',
          definition: 'A lipoprotein that transports excess cholesterol from blood vessels back to the liver.',
          whyItMatters: 'Acts as a natural defense system against arterial plaque build-up.',
          analogy: 'A street sweeper truck sweeping up debris off arterial highways.',
          category: 'Lipids'
        },
        {
          term: 'hs-CRP',
          definition: 'High-sensitivity C-reactive protein test measuring low levels of inflammation in the cardiovascular system.',
          whyItMatters: 'Provides an extra layer of risk evaluation beyond standard cholesterol numbers.',
          analogy: 'A sensitive smoke detector alerting to low-grade heat in the arterial walls.',
          category: 'Inflammation'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'q1',
            question: 'What is my overall 10-year cardiovascular risk score based on these numbers?',
            context: 'Helps contextualize whether immediate medication or a 3-month lifestyle trial is recommended.',
            priority: 'high',
            category: 'Risk Assessment'
          },
          {
            id: 'q2',
            question: 'Should we re-test my lipid panel and hs-CRP in 8-12 weeks after diet and exercise changes?',
            context: 'Establishes a clear progress milestone.',
            priority: 'high',
            category: 'Follow-up'
          },
          {
            id: 'q3',
            question: 'Are my high triglycerides related to my carbohydrate intake or fasting state during the blood draw?',
            context: 'Differentiates dietary factors from metabolic issues.',
            priority: 'medium',
            category: 'Diet & Lifestyle'
          }
        ],
        discussionPoints: [
          'Current daily diet (saturated fat, refined sugars, fiber intake)',
          'Weekly exercise routine and aerobic activity levels',
          'Family history of premature heart disease or high cholesterol'
        ],
        thingsToMonitor: [
          'Fasting lipid panel repeat in 3 months',
          'Blood pressure check at home twice weekly',
          'Body weight and waist circumference changes'
        ],
        followUpTimeline: 'Schedule a routine follow-up with your primary physician within 2 to 4 weeks.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'metabolic-panel-demo',
    title: 'Comprehensive Metabolic Panel (CMP)',
    subtitle: 'Assessment of kidney function, liver health, blood sugar & electrolytes',
    date: '2026-07-15',
    type: 'Blood Test / General Health',
    rawText: `CITY HEALTH CLINIC
Patient: Demo Patient | Date: 2026-07-15
Glucose (Fasting) 112 mg/dL | ALT 58 U/L | AST 42 U/L | eGFR 98 mL/min`,
    analysis: {
      id: 'metabolic-panel-demo-analysis',
      fileName: 'Comprehensive_Metabolic_Panel.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-15',
        reportType: 'Comprehensive Metabolic Panel',
        laboratory: 'City Health Clinic',
      },
      shortSummary: 'Kidney function and electrolytes are healthy. Fasting blood sugar is slightly elevated (112 mg/dL) and liver enzymes (ALT and AST) show mild elevation.',
      laymanExplanation: 'Your kidneys and electrolyte filters are performing great! The two areas to discuss with your doctor are your fasting glucose (blood sugar) which is slightly above normal fasting threshold (99 mg/dL), and liver enzymes (ALT & AST) that are slightly higher than baseline.',
      importantFindings: [
        'Kidney filtration (eGFR 98) and electrolytes (Sodium 140, Potassium 4.3) are completely normal.',
        'Fasting Glucose is 112 mg/dL (Normal fasting is 70 - 99 mg/dL).',
        'ALT liver enzyme is 58 U/L (Reference 7-45 U/L).',
        'AST liver enzyme is 42 U/L (Reference 8-40 U/L).'
      ],
      safetyAlerts: [
        'Glucose and liver enzymes show mild elevations. Discuss an HbA1c test and routine liver health check with your doctor.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'cmp-1',
          name: 'Fasting Glucose',
          value: '112',
          unit: 'mg/dL',
          referenceRange: '70 - 99',
          status: 'discussion',
          category: 'Blood Sugar',
          whatItMeasures: 'The concentration of sugar circulating in your bloodstream after an overnight fast.',
          whyItMatters: 'Fasting glucose between 100-125 mg/dL indicates prediabetes, meaning your body takes longer to clear sugar.',
          questionsToAsk: [
            'Should we order an HbA1c test to see my average blood sugar over the past 3 months?',
            'What dietary adjustments can help lower my fasting sugar back under 100 mg/dL?'
          ],
          isAbnormal: true
        },
        {
          id: 'cmp-2',
          name: 'ALT (Alanine Aminotransferase)',
          value: '58',
          unit: 'U/L',
          referenceRange: '7 - 45',
          status: 'discussion',
          category: 'Liver Enzymes',
          whatItMeasures: 'An enzyme found mainly in liver cells.',
          whyItMatters: 'Mild increases occur when liver cells experience temporary stress or inflammation.',
          questionsToAsk: [
            'Could any of my current medications or supplements be causing this mild ALT rise?',
            'Would an abdominal ultrasound be helpful to check liver tissue?'
          ],
          isAbnormal: true
        },
        {
          id: 'cmp-3',
          name: 'eGFR (Estimated Glomerular Filtration)',
          value: '98',
          unit: 'mL/min',
          referenceRange: '> 60',
          status: 'normal',
          category: 'Kidney Function',
          whatItMeasures: 'A calculated estimate of how efficiently your kidney filters remove waste products.',
          whyItMatters: 'A score above 60 indicates excellent kidney filtering capacity.',
          questionsToAsk: [
            'How can I maintain healthy kidney function long term?'
          ],
          isAbnormal: false
        }
      ],
      vocabulary: [
        {
          term: 'Impaired Fasting Glucose',
          definition: 'Fasting blood sugar levels higher than normal but not high enough to be classified as diabetes.',
          whyItMatters: 'An early warning sign that gives you a great opportunity to make proactive lifestyle changes.',
          analogy: 'A yellow traffic light warning you to ease on the gas before reaching an intersection.',
          category: 'Endocrinology'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'cq1',
            question: 'Should we run an HbA1c test to get a 90-day average of my blood sugar levels?',
            context: 'Standard next step for elevated fasting glucose readings.',
            priority: 'high',
            category: 'Blood Sugar Evaluation'
          }
        ],
        discussionPoints: [
          'Review of all daily medications, supplements, and alcohol consumption',
          'Fasting habits prior to blood draw'
        ],
        thingsToMonitor: [
          'Fasting blood sugar repeat in 8 weeks',
          'Repeat liver panel in 4-8 weeks'
        ],
        followUpTimeline: 'Schedule a routine consultation within 2 to 3 weeks.'
      },
      timestamp: Date.now()
    }
  }
];

export const SAMPLE_REPORTS_FR: SampleReport[] = [
  {
    id: 'lipid-panel-demo',
    title: 'Bilan Lipidique & Cardiovasculaire',
    subtitle: 'Dépistage complet du cholestérol et du risque cardiovasculaire',
    date: '2026-07-28',
    type: 'Prise de Sang / Cardiologie',
    rawText: `LABORATOIRE DIAGNOSTIQUE METROPOLITAIN
Patient: Patient Démo | Date: 2026-07-28`,
    analysis: {
      id: 'lipid-panel-demo-analysis',
      fileName: 'Bilan_Lipidique_Cardio.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-28',
        reportType: 'Bilan Lipidique & Cardiovasculaire',
        laboratory: 'Laboratoire Métropolitain',
      },
      shortSummary: 'Ce rapport indique un cholestérol total élevé, un cholestérol LDL ("mauvais") élevé, des triglycérides élevés, un cholestérol HDL ("bon") bas et une légère inflammation vasculaire (hs-CRP).',
      laymanExplanation: 'Imaginez le cholestérol comme la circulation sanguine dans des tuyaux. Le HDL est la dépanneuse qui nettoie les graisses, tandis que le LDL et les triglycérides sont des camions de marchandises. Votre bilan montre trop de marchandises (LDL et Triglycérides) et pas assez de dépanneuses (HDL). La hs-CRP indique une légère irritation des parois artérielles à discuter avec votre médecin.',
      importantFindings: [
        'Le cholestérol total est de 238 mg/dL (Souhaitable inférieur à 200 mg/dL).',
        'Le cholestérol LDL ("mauvais") est de 161 mg/dL, considéré comme élevé.',
        'Le cholestérol HDL ("bon") est de 38 mg/dL, légèrement inférieur à l\'objectif (>40 mg/dL).',
        'Les triglycérides sont élevés à 195 mg/dL (Souhaitable sous 150 mg/dL).',
        'La hs-CRP est à 3,8 mg/L, suggérant une inflammation artérielle légère.'
      ],
      safetyAlerts: [
        'Ces résultats mettent en évidence des facteurs de risque cardiovasculaire. Prenez rendez-vous avec votre médecin pour discuter d\'une stratégie adaptée.',
        'En cas de douleur thoracique soudaine, d\'essoufflement ou d\'engourdissement, consultez immédiatement les urgences.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'val-1',
          name: 'Cholestérol Total',
          value: '238',
          unit: 'mg/dL',
          referenceRange: '120 - 200',
          status: 'discussion',
          category: 'Lipides',
          whatItMeasures: 'La quantité totale de cholestérol circulant dans votre sang.',
          whyItMatters: 'Un cholestérol total élevé signifie qu\'il y a plus de graisses susceptibles de former des plaques artérielles.',
          questionsToAsk: [
            'De combien ce taux augmente-t-il mon risque cardiovasculaire global ?',
            'Des changements d\'alimentation suffiront-ils ou devons-nous envisager un traitement ?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-2',
          name: 'Cholestérol LDL (Calculé)',
          value: '161',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'discussion',
          category: 'Lipides',
          whatItMeasures: 'Le "mauvais cholestérol" qui transporte les graisses du foie vers les artères.',
          whyItMatters: 'Un LDL élevé favorise le dépôt de plaques réduisant le calibre des artères.',
          questionsToAsk: [
            'Quel est mon objectif personnalisé de LDL selon mon âge et mes antécédents ?',
            'Quelles modifications alimentaires ciblées sont les plus efficaces pour réduire le LDL ?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-3',
          name: 'Cholestérol HDL',
          value: '38',
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: 'discussion',
          category: 'Lipides',
          whatItMeasures: 'Le "bon cholestérol" qui ramène l\'excès de graisse au foie pour élimination.',
          whyItMatters: 'Un taux élevé de HDL protège les vaisseaux sanguins en nettoyant les dépôts.',
          questionsToAsk: [
            'Comment l\'exercice aérobique et les bonnes graisses peuvent-ils faire remonter mon HDL ?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-4',
          name: 'Triglycérides',
          value: '195',
          unit: 'mg/dL',
          referenceRange: '35 - 150',
          status: 'discussion',
          category: 'Lipides',
          whatItMeasures: 'Type de graisse issu des calories et sucres non brûlés immédiatement.',
          whyItMatters: 'Des triglycérides élevés associés à un HDL bas augmentent la fatigue métabolique artérielle.',
          questionsToAsk: [
            'Devrais-je réduire les sucres raffinés ou l\'alcool pour abaisser mes triglycérides ?'
          ],
          isAbnormal: true
        },
        {
          id: 'val-5',
          name: 'hs-CRP (Protéine C-Réactive)',
          value: '3.8',
          unit: 'mg/L',
          referenceRange: '< 1.0',
          status: 'discussion',
          category: 'Inflammation',
          whatItMeasures: 'Protéine hépatique indiquant une inflammation vasculaire de faible intensité.',
          whyItMatters: 'Une hs-CRP élevée signale une légère irritation des parois vasculaires.',
          questionsToAsk: [
            'Ce niveau de CRP nécessite-t-il un contrôle dans 4 à 6 semaines ?'
          ],
          isAbnormal: true
        }
      ],
      vocabulary: [
        {
          term: 'Athérogène',
          definition: 'Qui favorise la formation de plaques de graisse dans les artères.',
          whyItMatters: 'Permet d\'identifier les profils favorisant le durcissement des artères.',
          analogy: 'Comme de la boue collante qui s\'accroche aux parois intérieures d\'un tuyau.',
          category: 'Cardiologie'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'q1',
            question: 'Quel est mon score de risque cardiovasculaire global à 10 ans ?',
            context: 'Permet d\'évaluer si un traitement ou un ajustement de mode de vie est prioritaire.',
            priority: 'high',
            category: 'Évaluation des Risques'
          }
        ],
        discussionPoints: [
          'Alimentation quotidienne (graisses saturées, sucres raffinés, fibres)',
          'Niveau d\'activité physique hebdomadaire'
        ],
        thingsToMonitor: [
          'Contrôle du bilan lipidique dans 3 mois',
          'Suivi de la tension artérielle'
        ],
        followUpTimeline: 'Prenez rendez-vous avec votre médecin traitant d\'ici 2 à 4 semaines.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'metabolic-panel-demo',
    title: 'Bilan Métabolique Complet',
    subtitle: 'Évaluation de la fonction rénale, hépatique, glycémie et électrolytes',
    date: '2026-07-15',
    type: 'Prise de Sang / Santé Générale',
    rawText: `CLINIQUE DE SANTE
Patient: Patient Démo | Date: 2026-07-15`,
    analysis: {
      id: 'metabolic-panel-demo-analysis',
      fileName: 'Bilan_Metabolique_Complet.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-15',
        reportType: 'Bilan Métabolique Complet',
        laboratory: 'Clinique Santé',
      },
      shortSummary: 'Les fonctions rénales et électrolytes sont très bons. La glycémie à jeun est légèrement élevée (112 mg/dL) ainsi que les enzymes hépatiques (ALT et AST).',
      laymanExplanation: 'Vos reins et filtres sanguins fonctionnent parfaitement ! Les deux points à aborder avec votre médecin sont la glycémie à jeun légèrement au-dessus du seuil normal (99 mg/dL) et les enzymes du foie (ALT & AST).',
      importantFindings: [
        'Filtration rénale (eGFR 98) et électrolytes parfaitement normaux.',
        'Glycémie à jeun de 112 mg/dL (Normale entre 70 et 99 mg/dL).',
        'Enzyme hépatique ALT à 58 U/L (Réf 7-45 U/L).'
      ],
      safetyAlerts: [
        'Discutez d\'un test HbA1c et d\'un contrôle de routine avec votre médecin.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'cmp-1',
          name: 'Glycémie à Jeun',
          value: '112',
          unit: 'mg/dL',
          referenceRange: '70 - 99',
          status: 'discussion',
          category: 'Sucre Sanguin',
          whatItMeasures: 'La concentration de sucre circulant dans le sang après le jeune nocturne.',
          whyItMatters: 'Une glycémie entre 100 et 125 mg/dL indique un pré-diabète.',
          questionsToAsk: [
            'Devrions-nous réaliser un test d\'hémoglobine glyquée (HbA1c) ?'
          ],
          isAbnormal: true
        }
      ],
      vocabulary: [
        {
          term: 'Hyperglycémie modérée à jeun',
          definition: 'Taux de sucre au-dessus de la normale sans atteindre le seuil de diabète avéré.',
          whyItMatters: 'Signal d\'alarme précoce idéal pour adopter de bonnes habitudes.',
          analogy: 'Un feu orange vous invitant à ralentir.',
          category: 'Endocrinologie'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'cq1',
            question: 'Faut-il prévoir un test HbA1c pour évaluer la moyenne de glycémie sur 3 mois ?',
            context: 'Étape classique d\'évaluation de la glycémie à jeun.',
            priority: 'high',
            category: 'Bilan Glucidique'
          }
        ],
        discussionPoints: [
          'Révision des traitements en cours et compléments alimentaires'
        ],
        thingsToMonitor: [
          'Contrôle de la glycémie à jeun dans 8 semaines'
        ],
        followUpTimeline: 'Consultation recommandée dans les 2 à 3 semaines.'
      },
      timestamp: Date.now()
    }
  }
];

export const SAMPLE_REPORTS_AR: SampleReport[] = [
  {
    id: 'lipid-panel-demo',
    title: 'فحص الكوليسترول والدهون الشامل',
    subtitle: 'مسح شامل لمستويات الدهون ومخاطر القلب والأوعية الدموية',
    date: '2026-07-28',
    type: 'تحليل دم / أمراض القلب',
    rawText: `مختبر التشخيص المركزي
المريض: مريض تجريبي | التاريخ: 2026-07-28`,
    analysis: {
      id: 'lipid-panel-demo-analysis',
      fileName: 'فحص_الدهون_والقلب.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-28',
        reportType: 'فحص الكوليسترول والدهون الشامل',
        laboratory: 'مختبر التشخيص المركزي',
      },
      shortSummary: 'يظهر هذا التقرير ارتفاع الكوليسترول الكلي، وارتفاع الكوليسترول الضار (LDL)، وارتفاع الدهون الثلاثية، وانخفاض الكوليسترول النافع (HDL)، مع التهاب وعائي خفيف (hs-CRP).',
      laymanExplanation: 'تخيل الكوليسترول مثل حركة المرور في أوعيتك الدموية. يعمل الكوليسترول النافع (HDL) كشاحنة سحب تنظف الدهون الزائدة، بينما الكوليسترول الضار (LDL) والدهون الثلاثية يشبهان شاحنات نقل البضائع الزائدة. يظهر التقرير زيادات في البضائع وقلة في شاحنات التنظيف. يمكنك تحسين هذه النتائج بالنظام الغذائي والرياضة واستشارة طبيبك.',
      importantFindings: [
        'الكوليسترول الكلي 238 ملغم/دسل (المستهدف أقل من 200).',
        'الكوليسترول الضار (LDL) هو 161 ملغم/دسل وهو مرتفع.',
        'الكوليسترول النافع (HDL) هو 38 ملغم/دسل وهو أقل من المستهدف (>40).',
        'الدهون الثلاثية مرتفعة عند 195 ملغم/دسل (المستهدف أقل من 150).',
        'hs-CRP يبلغ 3.8 ملغم/لتر مما يشير إلى التهاب شرياني خفيف للمناقشة مع الطبيب.'
      ],
      safetyAlerts: [
        'تسلط هذه النتائج الضوء على عوامل خطورة على القلب. حدد موعداً روتينياً مع طبيبك لمناقشة خطة صحية للقلب.',
        'إذا شعرت بألم مفاجئ في الصدر أو ضيق في التنفس، اطلب الرعاية الطبية الفورية.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'val-1',
          name: 'الكوليسترول الكلي (Total Cholesterol)',
          value: '238',
          unit: 'mg/dL',
          referenceRange: '120 - 200',
          status: 'discussion',
          category: 'الدهون',
          whatItMeasures: 'إجمالي كمية الكوليسترول المحمولة في الدم.',
          whyItMatters: 'ارتفاع الكوليسترول الكلي يعني وجود المزيد من المواد الشمعية التي قد تساهم في تراكم اللويحات الشريانية.',
          questionsToAsk: [
            'ما مدى زيادة مخاطر القلب الإجمالية مع مستوى كوليسترول 238؟',
            'هل تكفي تغييرات نمط الحياة بمفردها لتخفيض هذا الرقم؟'
          ],
          isAbnormal: true
        },
        {
          id: 'val-2',
          name: 'الكوليسترول الضار (LDL)',
          value: '161',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'discussion',
          category: 'الدهون',
          whatItMeasures: 'البروتين الدهني منخفض الكثافة الذي ينقل الدهون من الكبد للشرايين.',
          whyItMatters: 'عندما يكون LDL مرتفعاً، يمكن للدهون التراكم في جدران الشرايين وتضييق تدفق الدم.',
          questionsToAsk: [
            'ما هو المستوى المستهدف المخصص لي من الكوليسترول الضار؟'
          ],
          isAbnormal: true
        },
        {
          id: 'val-3',
          name: 'الكوليسترول النافع (HDL)',
          value: '38',
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: 'discussion',
          category: 'الدهون',
          whatItMeasures: 'البروتين الدهني مرتفع الكثافة الذي ينظف الدهون الزائدة ويعيدها للكبد.',
          whyItMatters: 'الارتفاع يحمي الشرايين، والانخفاض يعني حماية أقل.',
          questionsToAsk: [
            'كيف يمكن للتمارين الهوائية والدهون الصحية رفع مستوى HDL لدَي؟'
          ],
          isAbnormal: true
        }
      ],
      vocabulary: [
        {
          term: 'مسبب للتصلب (Atherogenic)',
          definition: 'يميل إلى التسبب في تشكيل اللويحات الدهنية في الشرايين.',
          whyItMatters: 'يحدد تركيبات الدهون التي تشجع تصلب الشرايين.',
          analogy: 'مثل الطين الملتصق بالجدران الداخلية لأنابيب السباكة.',
          category: 'أمراض القلب'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'q1',
            question: 'ما هي درجة خطورة الإصابة بأمراض القلب خلال 10 سنوات بناءً على هذه الأرقام؟',
            context: 'يساعد في معرفة ما إذا كان العلاج الدوائي أو تغيير نمط الحياة هو الخيار المناسب.',
            priority: 'high',
            category: 'تقييم المخاطر'
          }
        ],
        discussionPoints: [
          'النظام الغذائي اليومي (الدهون المشبعة والسكريات)',
          'مستوى النشاط البدني الأسبوعي'
        ],
        thingsToMonitor: [
          'إعادة فحص الدهون بعد 3 أشهر',
          'قياس ضغط الدم في المنزل'
        ],
        followUpTimeline: 'حدد موعد مراجعة مع طبيبك خلال 2 إلى 4 أسابيع.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'metabolic-panel-demo',
    title: 'فحص الفحص الأيضي الشامل (CMP)',
    subtitle: 'تقييم وظائف الكلى، صحة الكبد، سكر الدم والإلكتروليتات',
    date: '2026-07-15',
    type: 'تحليل دم / صحة عامة',
    rawText: `عيادة الصحة العامة
المريض: مريض تجريبي | التاريخ: 2026-07-15`,
    analysis: {
      id: 'metabolic-panel-demo-analysis',
      fileName: 'الفحص_الأيضي_الشامل.pdf',
      fileType: 'sample',
      patientInfo: {
        date: '2026-07-15',
        reportType: 'فحص الفحص الأيضي الشامل',
        laboratory: 'عيادة الصحة العامة',
      },
      shortSummary: 'وظائف الكلى والأملاح طبيعية وممتازة. سكر الدم الصائم مرتفع قليلاً (112 ملغم/دسل) وإنزيمات الكبد بها ارتفاع طفيف.',
      laymanExplanation: 'مرشحات الكلى والأملاح تعمل بشكل ممتاز! النقطتان لمناقشتهما مع طبيبك هما السكر الصائم المنخفض الارتفاع وإنزيمات الكبد.',
      importantFindings: [
        'ترشيح الكلى (eGFR 98) والأملاح (الصوديوم والبوتاسيوم) طبيعية تماماً.',
        'السكر الصائم 112 ملغم/دسل (الطبيعي 70-99).'
      ],
      safetyAlerts: [
        'ناقش إجراء فحص السكر التراكمي (HbA1c) وفحص الكبد الدوري مع طبيبك.'
      ],
      hasCriticalFindings: false,
      labValues: [
        {
          id: 'cmp-1',
          name: 'السكر الصائم (Fasting Glucose)',
          value: '112',
          unit: 'mg/dL',
          referenceRange: '70 - 99',
          status: 'discussion',
          category: 'سكر الدم',
          whatItMeasures: 'تركيز السكر في الدم بعد صيام ليلة كاملة.',
          whyItMatters: 'المستوى بين 100-125 يشير لمرحلة ما قبل السكري.',
          questionsToAsk: [
            'هل يجب إجراء فحص السكر التراكمي HbA1c؟'
          ],
          isAbnormal: true
        }
      ],
      vocabulary: [
        {
          term: 'اضطراب السكر الصائم',
          definition: 'ارتفاع السكر الصائم عن الطبيعي دون الوصول لمرحلة السكري.',
          whyItMatters: 'إنذار مبكر يمنحك فرصة لاتخاذ خطوات استباقية.',
          analogy: 'إشارة مرور صفراء تحذرك لتخفيف السرعة.',
          category: 'الغدد الصماء'
        }
      ],
      doctorPrep: {
        topQuestions: [
          {
            id: 'cq1',
            question: 'هل نحتاج لإجراء فحص السكر التراكمي لمعرفة متوسط السكر على مدى 90 يوماً؟',
            context: 'الخطوة التالية القياسية لارتفاع السكر الصائم.',
            priority: 'high',
            category: 'تقييم السكر'
          }
        ],
        discussionPoints: [
          'مراجعة الأدوية والمكملات الغذائية اليومية'
        ],
        thingsToMonitor: [
          'إعادة فحص السكر الصائم بعد 8 أسابيع'
        ],
        followUpTimeline: 'حدد استشارة روتينية خلال 2 إلى 3 أسابيع.'
      },
      timestamp: Date.now()
    }
  }
];

export function getSampleReports(language: Language): SampleReport[] {
  switch (language) {
    case 'fr':
      return SAMPLE_REPORTS_FR;
    case 'ar':
      return SAMPLE_REPORTS_AR;
    default:
      return SAMPLE_REPORTS_EN;
  }
}

export function getSampleReportById(id: string, language: Language): SampleReport {
  const list = getSampleReports(language);
  const found = list.find((s) => s.id === id);
  return found || list[0];
}

export const SAMPLE_REPORTS = SAMPLE_REPORTS_EN;
