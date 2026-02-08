import { AppointmentReasons, AppointmentStatus,  } from '@/enums/commons';
import {  MedicalRecordSummary, AppointmentData, MedicalCertificate } from './types';



export const mockMedicalRecords: MedicalRecordSummary[] = [
  {
    recordId: 1,
    referenceNo: 'MR-2026-001',
    visitDate: new Date('2026-01-15'),
    visitTime: '10:30 AM',
    reason: AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS,
    doctor: 'Dr. Sarah Johnson',
    findings: 'Mild fever, prescribed rest and medication',
    createdAt: new Date('2026-01-15'),
  },
  {
    recordId: 2,
    referenceNo: 'MR-2026-002',
    visitDate: new Date('2025-12-10'),
    visitTime: '2:15 PM',
    reason: AppointmentReasons.HEADACHE_OR_MIGRAINE,
    doctor: 'Dr. Michael Chen',
    findings: 'Tension headache, advised stress management',
    createdAt: new Date('2025-12-10'),
  },
  {
    recordId: 3,
    referenceNo: 'MR-2025-145',
    visitDate: new Date('2025-11-05'),
    visitTime: '11:00 AM',
    reason: AppointmentReasons.FOLLOW_UP_CHECK_UP,
    doctor: 'Dr. Sarah Johnson',
    findings: 'Follow-up check-up, condition improving',
    createdAt: new Date('2025-11-05'),
  },
];

export const mockAppointments: AppointmentData[] = [
  {
    appointmentId: 1,
    date: new Date('2026-02-05'),
    time: '9:00 AM',
    reason: AppointmentReasons.FOLLOW_UP_CHECK_UP,
    status: AppointmentStatus.APPROVED,
    doctor: 'Dr. Sarah Johnson',
    notes: 'Regular check-up',
  },
  {
    appointmentId: 2,
    date: new Date('2026-02-12'),
    time: '2:30 PM',
    reason: AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS,
    status: AppointmentStatus.PENDING,
    doctor: 'Dr. Robert Lee',
    notes: 'Dental consultation',
  },
  {
    appointmentId: 3,
    date: new Date('2026-02-20'),
    time: '10:15 AM',
    reason: AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS,
    status: AppointmentStatus.APPROVED,
    doctor: 'Dr. Maria Garcia',
  },
];

export const mockCertificates: MedicalCertificate[] = [
  {
    certificateId: 1,
    issueDate: new Date('2026-01-15'),
    validUntil: new Date('2026-01-17'),
    purpose: 'Sick Leave',
    doctor: 'Dr. Sarah Johnson',
    referenceNo: 'MC-2026-001',
    diagnosis: 'Acute Upper Respiratory Tract Infection',
    recommendations: 'Complete bed rest for 2 days, adequate hydration, and medication as prescribed',
  },
  {
    certificateId: 2,
    issueDate: new Date('2025-12-10'),
    validUntil: new Date('2025-12-11'),
    purpose: 'Medical Clearance',
    doctor: 'Dr. Michael Chen',
    referenceNo: 'MC-2025-089',
    diagnosis: 'Fit for work',
    recommendations: 'Regular health monitoring advised',
  },
];
