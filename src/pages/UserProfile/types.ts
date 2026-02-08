import {
  UserRoles,
  AppointmentReasons,
  AppointmentStatus,
} from "@/enums/commons";
import {
  StudentDetailsDTO,
  TeacherDetailsDTO,
  StaffDetailsDTO,
} from "@/types/medicalRecordsType";

export interface UserProfileData {
  userId: number;
  fullName: string;
  role: UserRoles;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  gender: string;
  avatarUrl?: string;

  // Role-specific details
  studentDetails?: StudentDetailsDTO;
  teacherDetails?: TeacherDetailsDTO;
  staffDetails?: StaffDetailsDTO;

  // Additional employee-like fields for teachers/staff
  employeeNumber?: string;
  department?: string;
  position?: string;
  employmentType?: string;
  employeeStatus?: string;
  jobTitle?: string;
  startDate?: Date;
  endDate?: Date;
  startShift?: string;
  endShift?: string;
  rateType?: string;
  dailyRate?: number;
  hourlyRate?: number;
}

export interface MedicalRecordSummary {
  recordId: number;
  referenceNo: string;
  visitDate: Date;
  visitTime: string;
  reason: AppointmentReasons;
  doctor: string;
  findings: string;
  createdAt: Date;
}

export interface AppointmentData {
  appointmentId: number;
  date: Date;
  time: string;
  reason: AppointmentReasons;
  status: AppointmentStatus;
  doctor: string;
  notes?: string;
}

export interface MedicalCertificate {
  certificateId: number;
  issueDate: Date;
  validUntil?: Date;
  purpose: string;
  doctor: string;
  referenceNo: string;
  diagnosis: string;
  recommendations: string;
}

export class MedicalCertificateDTO {
  certificateId: number = 0;
  issueDate: Date = new Date();
  validUntil?: Date;
  purpose: string = "";
  doctor: string = "";
  referenceNo: string = "";
  diagnosis: string = "";
  recommendations: string = "";

  constructor(init?: Partial<MedicalCertificateDTO>) {
    return Object.assign(this, init);
  }
}
