import { GetMedicalRecordDetailsDTO, StudentDetailsDTO } from '@/types/medicalRecordsType';
import { AppointmentReasons, Courses, YearLevels, ActionTaken, UOM } from '@/enums/commons';

export const getMockMedicalRecordDetails = (): GetMedicalRecordDetailsDTO => {
  return new GetMedicalRecordDetailsDTO({
    RecordId: 1001,
    ReferenceNo: 'MR-2024-001001',
    UserDetailsId: 5234,
    PatientName: 'Juan Dela Cruz',
    StudentDetails: new StudentDetailsDTO({
      Course: Courses.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
      Year: YearLevels.THIRD_YEAR,
    }),
    VisitDate: new Date('2024-01-25'),
    VisitTime: '10:30 AM',
    Reason: AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS,
    Symptoms: 'Patient presents with high fever (38.5°C), body aches, persistent cough, and mild sore throat. Symptoms started 2 days ago and have been progressively worsening. No history of recent travel or known exposure to infectious diseases.',
    VitalSigns: {
      AppointmentId: 2501,
      Temperature: 38.5,
      BloodPressure: '120/80',
      PulseRate: 88,
      Height: 170,
      Weight: 65,
    },
    Findings: 'Upon physical examination, patient shows signs of upper respiratory tract infection. Throat appears slightly inflamed. Lungs are clear on auscultation. No signs of complications. Likely viral infection requiring symptomatic treatment and rest.',
    ActionTaken: [ActionTaken.RESTED, ActionTaken.MEDICATION_GIVEN, ActionTaken.SENT_HOME],
    Remarks: 'Patient advised to rest for 2-3 days. Prescribed medications to be taken as directed. Instructed to return if symptoms worsen or if fever persists beyond 3 days. Advised to increase fluid intake and monitor temperature regularly. Follow-up visit scheduled if needed.',
    ItemsProvided: [
      {
        Product: {
          Id: 101,
          Title: 'Paracetamol 500mg',
          UOM: UOM.TABLET,
          Quantity: 100,
          PackagingQty: 10,
        },
        Quantity: 6,
        Notes: 'Take 1 tablet every 6 hours as needed for fever',
      },
      {
        Product: {
          Id: 102,
          Title: 'Cough Syrup',
          UOM: UOM.BOTTLE,
          Quantity: 50,
          PackagingQty: 1,
        },
        Quantity: 1,
        Notes: 'Take 2 teaspoons 3 times daily after meals',
      },
      {
        Product: {
          Id: 103,
          Title: 'Vitamin C 500mg',
          UOM: UOM.CAPSULE,
          Quantity: 200,
          PackagingQty: 10,
        },
        Quantity: 7,
        Notes: 'Take 1 capsule daily for immune support',
      },
    ],
    DoctorName: 'Dr. Maria Santos, MD',
    DoctorSignature: '/images/icons/doctor-signature.svg',
    CreatedAt: new Date('2024-01-25T10:45:00'),
  });
};
