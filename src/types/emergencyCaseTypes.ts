import { CaseType, Severity, EmergencyCaseStatus, PatientType } from "@/enums/emergencyCase";
import { Courses, Department, Position, YearLevels } from "@/enums/commons";

export interface HospitalDTO {
  id: number;
  name: string;
  contact: string;
  address: string;
  emergencyRoom: string;
  specializations: string[];
}

export interface StaffDTO {
  id: number;
  name: string;
  role: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  category: string;
  unit: string;
}

export interface ProductUsageDTO {
  productId: number;
  qty: number;
  note: string;
}

export interface VitalSignsDTO {
  bp: string;
  pulse: string;
  temp: string;
  o2: string;
}

export interface StudentPatientDTO {
  patientType: PatientType.STUDENT;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  course: Courses;
  yearLevel: YearLevels;
  age: number;
  birthDate: Date;
  email?: string;
  phone?: string;
}

export interface TeacherPatientDTO {
  patientType: PatientType.TEACHER;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  department: Department;
  position: Position;
  age: number;
  birthDate: Date;
  email?: string;
  phone?: string;
}

export interface VisitorPatientDTO {
  patientType: PatientType.VISITOR;
  firstName: string;
  lastName: string;
  age: number;
  birthDate: Date;
  purpose?: string;
}

export type PatientInfoDTO = StudentPatientDTO | TeacherPatientDTO | VisitorPatientDTO;

export interface EmergencyCaseDTO {
  id: string;
  patientInfo: PatientInfoDTO;
  caseType: CaseType;
  severity: Severity;
  chiefComplaint: string;
  status: EmergencyCaseStatus;
  assignedStaff: number[];
  products: ProductUsageDTO[];
  vitalSigns: VitalSignsDTO;
  transferHospital: HospitalDTO | null;
  transferReason: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface EmergencyCaseFormDTO {
  patientInfo: PatientInfoDTO | null;
  caseType: CaseType;
  severity: Severity;
  chiefComplaint: string;
  status: EmergencyCaseStatus;
  assignedStaff: number[];
  products: ProductUsageDTO[];
  vitalSigns: VitalSignsDTO;
  transferHospital: HospitalDTO | null;
  transferReason: string;
  notes: string;
}

export interface VerifyStudentDTO {
  studentNumber: string;
}

export interface VerifyTeacherDTO {
  employeeId: string;
}

export interface StudentVerificationResult {
  success: boolean;
  data?: StudentPatientDTO;
}

export interface TeacherVerificationResult {
  success: boolean;
  data?: TeacherPatientDTO;
}
