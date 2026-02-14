import { CaseType, Severity, EmergencyCaseStatus, PatientType } from "@/enums/emergencyCase";
import { Courses, Department, Position, YearLevels } from "@/enums/commons";
import { GetUserDetailsDTO } from "./userManagementTypes";
import { StaffDTO } from "@/pages/UserProfile/types";

export interface VitalSignsV2DTO {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
}

export interface MedicationDTO {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  notes: string;
}

export interface TreatmentActionDTO {
  id: string;
  action: string;
  performedBy: number;
  performedAt: string;
  notes: string;
}

export class HospitalInfoDTO {
  id: number = 0;
  name: string = "";
  address: string = "";
  contactNumber: string = "";
  emergencyDepartment: string = "";
  ambulanceAvailable: boolean = false;
  specializations: string[] = [];

  constructor(init?: Partial<HospitalInfoDTO>) {
    return Object.assign(this, init);
  }
}

export interface PatientDetailsV2DTO {
  patientType: PatientType;
  // Common fields
  firstName: string;
  lastName: string;
  middleName?: string;
  age: number;
  birthDate: Date;
  gender: string;
  contactNumber?: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
  
  // Student specific
  studentNumber?: string;
  course?: Courses;
  yearLevel?: YearLevels;
  section?: string;
  
  // Teacher/Staff specific
  employeeId?: string;
  department?: Department;
  position?: Position;
  
  // Medical history
  allergies?: string[];
  medications?: string[];
  medicalConditions?: string[];
}

export interface EmergencyCaseV2DTO {
  id: string;
  caseNumber: string;
  patient: GetUserDetailsDTO;
  
  // Case Information
  caseType: CaseType;
  severity: Severity;
  status: EmergencyCaseStatus;
  chiefComplaint: string;
  symptoms: string[];
  
  // Medical Information
  vitalSigns: VitalSignsV2DTO;
  assessment: string;
  diagnosis: string;
  
  // Treatment
  medications: MedicationDTO[];
  treatments: TreatmentActionDTO[];
  assignedStaff: StaffDTO[];
  
  // Transfer/Discharge
  transferredTo?: number ;
  transferHospital?: HospitalInfoDTO;
  dischargeInstructions: string;
  dischargedAt: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Additional notes
  notes: string;
}

export class EmergencyCaseFormV2DTO {
  patientId: number | null = null;
  patient: GetUserDetailsDTO = {} as GetUserDetailsDTO;
  caseType: CaseType = CaseType.CARDIAC_EVENT;
  severity: Severity = Severity.MODERATE;
  chiefComplaint: string = "";
  symptoms: string[] = [];
  referredHospitalId?: number;
  vitalSigns: VitalSignsV2DTO = {} as VitalSignsV2DTO;
  assessment: string = "";
  diagnosis: string = "";
  medications: MedicationDTO[] = [];
  assignedStaff: StaffDTO[] = [];
  notes: string = "";

  constructor(init?: Partial<EmergencyCaseFormV2DTO>) {
    return Object.assign(this, init);
  }
}

export interface VerifyPatientDTO {
  identificationNumber: string;
  patientType: PatientType;
}

export interface PatientVerificationResult {
  success: boolean;
  patient?: PatientDetailsV2DTO;
  message?: string;
}
