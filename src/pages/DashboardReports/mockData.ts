import {
  AIReport,
  AppointmentReasonData,
  AppointmentReasonTrend,
  MedicalRecordInsight,
  Recommendation,
} from './types';
import { AppointmentReasons } from '@/enums/commons';

const reasonLabels: Record<AppointmentReasons, string> = {
  [AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS]: 'Fever/Flu Symptoms',
  [AppointmentReasons.HEADACHE_OR_MIGRAINE]: 'Headache/Migraine',
  [AppointmentReasons.STOMACHACHE_OR_DIGESTIVE_PROBLEMS]:
    'Digestive Problems',
  [AppointmentReasons.MINOR_INJURY_OR_ACCIDENT]: 'Minor Injury',
  [AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS]:
    'Allergy/Asthma',
  [AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS]: 'Dental Pain',
  [AppointmentReasons.SKIN_CONDITIONS_OR_RASHES]: 'Skin Conditions',
  [AppointmentReasons.FOLLOW_UP_CHECK_UP]: 'Follow-up Check-up',
  [AppointmentReasons.OTHER_HEALTH_CONCERNS]: 'Other Concerns',
};

export const getMockAISummaryReport = (): AIReport => {
  return {
    id: 'ai-summary-001',
    title: 'Clinic Operations AI Summary',
    summary:
      'Based on analysis of 487 appointments over the past month, the school clinic shows consistent patterns in student health needs. Respiratory-related visits (fever and flu symptoms) dominate appointment reasons at 28%, followed by headache/migraine complaints at 18%. This pattern aligns with seasonal trends typically observed in educational institutions during the current period.',
    insights: [
      'Respiratory illnesses show a 15% increase compared to the previous month, suggesting the beginning of flu season. Consider increasing stock of fever reducers and respiratory medications.',
      'Follow-up appointments have decreased by 22%, indicating good initial treatment effectiveness or potential gaps in patient compliance with follow-up schedules.',
      'Minor injuries spike on Mondays and Fridays, correlating with Physical Education class schedules. Enhanced preventive education before PE classes could reduce injury rates.',
      'Headache and migraine complaints are most common between 10 AM - 2 PM, suggesting possible environmental factors (screen time, dehydration, or meal timing) that could be addressed.',
      'Student visits cluster in the morning hours (8 AM - 11 AM), with a secondary peak after lunch. Current staffing levels are adequate but should be monitored during these peak periods.',
    ],
    confidence: 94,
    generatedAt: new Date(),
  };
};

export const getMockAppointmentReasonsDistribution =
  (): AppointmentReasonData[] => {
    return [
      {
        reason: reasonLabels[AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS],
        count: 136,
        percentage: 28,
        trend: 'up',
        trendPercentage: 15,
      },
      {
        reason: reasonLabels[AppointmentReasons.HEADACHE_OR_MIGRAINE],
        count: 88,
        percentage: 18,
        trend: 'stable',
        trendPercentage: 2,
      },
      {
        reason:
          reasonLabels[
            AppointmentReasons.STOMACHACHE_OR_DIGESTIVE_PROBLEMS
          ],
        count: 68,
        percentage: 14,
        trend: 'down',
        trendPercentage: -5,
      },
      {
        reason: reasonLabels[AppointmentReasons.MINOR_INJURY_OR_ACCIDENT],
        count: 63,
        percentage: 13,
        trend: 'up',
        trendPercentage: 8,
      },
      {
        reason:
          reasonLabels[
            AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS
          ],
        count: 44,
        percentage: 9,
        trend: 'stable',
        trendPercentage: 1,
      },
      {
        reason: reasonLabels[AppointmentReasons.FOLLOW_UP_CHECK_UP],
        count: 39,
        percentage: 8,
        trend: 'down',
        trendPercentage: -22,
      },
      {
        reason:
          reasonLabels[
            AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS
          ],
        count: 24,
        percentage: 5,
        trend: 'stable',
        trendPercentage: -3,
      },
      {
        reason: reasonLabels[AppointmentReasons.SKIN_CONDITIONS_OR_RASHES],
        count: 15,
        percentage: 3,
        trend: 'up',
        trendPercentage: 12,
      },
      {
        reason: reasonLabels[AppointmentReasons.OTHER_HEALTH_CONCERNS],
        count: 10,
        percentage: 2,
        trend: 'stable',
        trendPercentage: 0,
      },
    ];
  };

export const getMockAppointmentReasonsTrend =
  (): AppointmentReasonTrend[] => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => ({
      date: week,
      reasons: {
        'Fever/Flu': 28 + index * 3 + Math.random() * 5,
        Headache: 18 + Math.random() * 4,
        Digestive: 14 - index * 1 + Math.random() * 3,
        Injury: 10 + Math.random() * 6,
        'Allergy/Asthma': 9 + Math.random() * 2,
        'Follow-up': 10 - index * 2,
        Other: 5 + Math.random() * 2,
      },
    }));
  };

export const getMockMedicalRecordsInsights = (): MedicalRecordInsight[] => {
  return [
    {
      metric: 'Record Completion Rate',
      value: '94%',
      insight:
        'Medical records show excellent completion rates, with only 6% of visits missing follow-up documentation. This is above the industry standard of 85%.',
      severity: 'success',
    },
    {
      metric: 'Average Visit Duration',
      value: '18 minutes',
      insight:
        'Average consultation time has increased by 3 minutes compared to last month, indicating more thorough examinations. This is within optimal range for quality care.',
      severity: 'info',
    },
    {
      metric: 'Prescription Accuracy',
      value: '99.2%',
      insight:
        'Prescription records show near-perfect accuracy with minimal corrections needed. Strong adherence to medication protocols detected.',
      severity: 'success',
    },
    {
      metric: 'Referral Rate',
      value: '12%',
      insight:
        'The referral rate to external specialists has increased by 3% this month. Monitor to ensure adequate on-site capabilities are maintained.',
      severity: 'warning',
    },
    {
      metric: 'Digital Record Adoption',
      value: '88%',
      insight:
        'Electronic health record usage continues to improve, with 88% of records fully digitized. Target 95% by end of semester is achievable.',
      severity: 'info',
    },
  ];
};

export const getMockRecommendations = (): Recommendation[] => {
  return [
    {
      id: 'rec-001',
      title: 'Increase Respiratory Medication Stock',
      description:
        'With respiratory illnesses trending upward (+15%), consider increasing stock levels of fever reducers, cough suppressants, and cold medications by 30-40% to prevent shortages during peak flu season.',
      priority: 'high',
      category: 'Inventory Management',
      impact:
        'Prevents medication shortages and ensures continuous patient care during flu season peak.',
    },
    {
      id: 'rec-002',
      title: 'Implement Hydration Campaign',
      description:
        'Headache incidents peak mid-day (10 AM - 2 PM), often linked to dehydration. Launch a student awareness campaign promoting regular water intake, especially before and during this peak period.',
      priority: 'medium',
      category: 'Preventive Care',
      impact:
        'Could reduce headache-related visits by an estimated 15-20%, improving student wellness and reducing clinic load.',
    },
    {
      id: 'rec-003',
      title: 'Enhance PE Safety Briefings',
      description:
        'Minor injuries spike on PE class days. Collaborate with PE department to enhance pre-activity safety briefings and warm-up protocols. Consider providing first-aid training to PE instructors.',
      priority: 'high',
      category: 'Injury Prevention',
      impact:
        'Potential to reduce minor injuries by 25%, improving student safety and reducing clinic burden.',
    },
    {
      id: 'rec-004',
      title: 'Optimize Morning Staffing',
      description:
        'Visit patterns show concentrated demand in morning hours (8-11 AM). Consider adjusting staff schedules to ensure full coverage during these peak hours while optimizing afternoon staffing.',
      priority: 'medium',
      category: 'Operations',
      impact:
        'Reduces wait times by 30% during peak hours and improves staff work-life balance.',
    },
    {
      id: 'rec-005',
      title: 'Follow-up Compliance Program',
      description:
        'Follow-up appointments have decreased by 22%. Implement an automated reminder system via SMS or email to improve patient compliance with follow-up schedules.',
      priority: 'medium',
      category: 'Patient Care',
      impact:
        'Expected to increase follow-up compliance by 35%, ensuring complete treatment cycles.',
    },
    {
      id: 'rec-006',
      title: 'Complete EHR Digital Transition',
      description:
        'With 88% digital adoption, focus efforts on transitioning remaining 12% of records to electronic format. Provide additional training sessions for staff members who may need support.',
      priority: 'low',
      category: 'Technology',
      impact:
        'Achieves 95% digitization target, improving record accessibility and reducing administrative overhead.',
    },
  ];
};
