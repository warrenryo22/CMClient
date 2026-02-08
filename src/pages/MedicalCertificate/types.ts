export interface MedicalCertificateFormData {
  // Patient Information
  patientName: string;
  patientId: string;
  dateOfBirth: Date | null;
  address: string;

  // Medical Certificate Details
  dateIssued: Date;
  diagnosis: string;
  chiefComplaint: string;
  physicalExamination: string;
  recommendations: string;

  // Leave/Rest Period
  restPeriodFrom: Date | null;
  restPeriodTo: Date | null;
  numberOfDays: number;

  // Additional Information
  fitToWork: boolean;
  needsFollowUp: boolean;
  followUpDate: Date | null;
  restrictions: string;
  remarks: string;

  // Doctor Information
  doctorName: string;
  doctorLicenseNo: string;
  doctorSignature?: string; // Base64 image
}

export const initialCertificateFormData: MedicalCertificateFormData = {
  patientName: "",
  patientId: "",
  dateOfBirth: null,
  address: "",
  dateIssued: new Date(),
  diagnosis: "",
  chiefComplaint: "",
  physicalExamination: "",
  recommendations: "",
  restPeriodFrom: null,
  restPeriodTo: null,
  numberOfDays: 0,
  fitToWork: false,
  needsFollowUp: false,
  followUpDate: null,
  restrictions: "",
  remarks: "",
  doctorName: "",
  doctorLicenseNo: "",
  doctorSignature: undefined,
};

export class MedicalCertificateFormDataDTO {
  medicalRecordId: number = 0;
  patientName: string = "";
  patientId: string = "";
  dateOfBirth: Date | null = null;
  address: string = "";
  dateIssued: Date = new Date();
  diagnosis: string = "";
  chiefComplaint: string = "";
  physicalExamination: string = "";
  recommendations: string = "";
  restPeriodFrom: Date | null = null;
  restPeriodTo: Date | null = null;
  numberOfDays: number = 0;
  fitToWork: boolean = false;
  needsFollowUp: boolean = false;
  followUpDate: Date | null = null;
  restrictions: string = "";
  remarks: string = "";
  doctorName: string = "";
  doctorLicenseNo: string = "";
  doctorSignature?: string = undefined;

  constructor(init?: Partial<MedicalCertificateFormDataDTO>) {
    return Object.assign(this, init);
  }
}

export interface AIMockDataSuggestion {
  diagnosis: string;
  chiefComplaint: string;
  physicalExamination: string;
  recommendations: string;
  numberOfDays: number;
  fitToWork: boolean;
  needsFollowUp: boolean;
  restrictions: string;
  remarks: string;
}

export class AIMockDataSuggestionDTO{
  diagnosis: string = "";
    chiefComplaint: string = "";
    physicalExamination: string = "";
    recommendations: string = "";
    numberOfDays: number = 0;
    fitToWork: boolean = false;
    needsFollowUp: boolean = false;
    restrictions: string = "";
    remarks: string = "";

    constructor(init?: Partial<AIMockDataSuggestionDTO>) {
      return Object.assign(this, init);
    }
}