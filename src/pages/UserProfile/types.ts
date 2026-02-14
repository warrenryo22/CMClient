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
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address: string;
  dateOfBirth: Date;
  gender: string;
  avatarUrl?: string;

  // Role-specific details
  studentDetails?: StudentDetailsDTO;
  teacherDetails?: TeacherDetailsDTO;
  staffDetails?: StaffDetailsDTO;

  // Additional employee-like fields for teachers/staff
}

export class UserProfileData {
  userId: number = 0;
  firstName: string = "";
  lastName: string = "";
  middleName?: string;
  role: UserRoles = UserRoles.STUDENTS;
  email: string = "";
  phone: string = "";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address: string = "";
  dateOfBirth: Date = new Date();
  gender: string = "";
  avatarUrl?: string;

  studentDetails?: StudentDetailsDTO;
  teacherDetails?: TeacherDetailsDTO;
  staffDetails?: StaffDetailsDTO;

  constructor(init?: Partial<UserProfileData>) {
    return Object.assign(this, init);
  }
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

export class AdviserDTO {
  Id: number = 0;
  Name: string = "";

  constructor(init?: Partial<AdviserDTO>) {
    return Object.assign(this, init);
  }
}

export class StaffDTO {
  id: number = 0;
  name: string = "";
  role: UserRoles = UserRoles.DOCTORS;

  constructor(init?: Partial<AdviserDTO>) {
    return Object.assign(this, init);
  }
}
