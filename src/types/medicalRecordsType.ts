import { AppointmentReasons, Courses, UserRoles, YearLevels } from "@/enums/commons";
import { GetProductPaginatedDTO } from "./productTypes";

export class AddVitalSignsDTO {
  AppointmentId: number = 0;
  Temperature?: number;
  BloodPressure?: string;
  PulseRate?: number;
  Height?: number;
  Weight?: number;

  constructor(init?: Partial<AddVitalSignsDTO>) {
    return Object.assign(this, init);
  }
}

export class GetInitialMedicalRecordsDTO {
  RecordId?: number;
  UserDetailsId: number = 0;
  WalkinId?: number;
  Name: string = "";
  StudentDetails?: StudentDetailsDTO;
  TeacherDetails?: TeacherDetailsDTO;
  StaffDetails?: StaffDetailsDTO;
  VisitDate: Date = new Date();
  VisitTime: string = "";
  Reason: AppointmentReasons = AppointmentReasons.OTHER_HEALTH_CONCERNS;
  InitialVitalSign?: AddVitalSignsDTO;

  constructor(init?: Partial<GetInitialMedicalRecordsDTO>) {
    return Object.assign(this, init);
  }
}
export class TeacherDetailsDTO {
  TeacherDepartment?: undefined;
  Position?: undefined;

  constructor(init?: Partial<StudentDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class StaffDetailsDTO {
  StaffDepartment?: undefined;
  EmployeeId?: string;

  constructor(init?: Partial<StudentDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class StudentDetailsDTO {
  Adviser?: string;
  StudentNo: string = "";
  AcademicYear?: string;
  Course: Courses = Courses.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY;
  Year: YearLevels = YearLevels.FIRST_YEAR;

  constructor(init?: Partial<StudentDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class CreateCheckupDetailsDTO {
  AppointmentId: number = 0;
  RecordId?: number;
  UserDetailsId?: number;
  WalkinId?:number;
  Symptoms: string = "";
  VitalSigns?: AddVitalSignsDTO;
  Findings: string = "";
  ActionTaken: number[] = [];
  Remarks: string = "";
  ItemsProvided: ItemsProvided[] = [];

  constructor(init?: Partial<CreateCheckupDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class ItemsProvided {
  Product: GetProductPaginatedDTO = new GetProductPaginatedDTO();
  Quantity: number = 0;
  Notes?: string;

  constructor(init?: Partial<ItemsProvided>) {
    return Object.assign(this, init);
  }
}

export class MedicalRecordsPaginatedDTO {
  Id: number = 0;
  FullName: string = "";
  CreatedBy: string = "";
  ReferenceNo: string = "";
  IsRequested: boolean = false;
  CreatedAt: Date = new Date();

  constructor(init?: Partial<MedicalRecordsPaginatedDTO>) {
    return Object.assign(this, init);
  }
}

export class MedicalRecordsRequestPaginatedDTO {
  Id: number = 0;
  MedicalRecordId: number = 0;
  FullName: string = "";
  ReferenceNo: string = "";
  IsDone: boolean = false;
  CreatedAt: Date = new Date();

  constructor(init?: Partial<MedicalRecordsRequestPaginatedDTO>) {
    return Object.assign(this, init);
  }
}

export class GetMedicalRecordDetailsDTO {
  RecordId: number = 0;
  ReferenceNo: string = "";
  UserDetailsId: number = 0;
  PatientName: string = "";
  StudentDetails?: StudentDetailsDTO;
  TeacherDetails?: TeacherDetailsDTO;
  StaffDetails?: StaffDetailsDTO;
  VisitDate: Date = new Date();
  VisitTime: string = "";
  Reason: AppointmentReasons = AppointmentReasons.OTHER_HEALTH_CONCERNS;
  Symptoms: string = "";
  VitalSigns?: AddVitalSignsDTO;
  Findings: string = "";
  ActionTaken: number[] = [];
  Remarks: string = "";
  ItemsProvided: ItemsProvided[] = [];
  DoctorName: string = "";
  DoctorSignature?: string;
  CreatedAt: Date = new Date();

  constructor(init?: Partial<GetMedicalRecordDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class ExportMedicalResponseData {
  filename: string = "";
  file: string = "";
  constructor(init?: Partial<ExportMedicalResponseData>) {
    return Object.assign(this, init);
  }
}


export class GetCasesDTO{
  Id: number = 0;
  CaseNumber: string = "";  
  UserDetailsId: number = 0;
  FullName: string = "";
  Severity: number = 0;
  CaseType: number = 0;
  CreatedAt: Date = new Date();

  constructor(init?: Partial<GetCasesDTO>) {
    return Object.assign(this, init);
  }
}

export class GetCaseDetailsDTO {
  Id: number = 0;
  CaseNumber: string = "";
  Patient?: PatientDTO;
  CaseType: number = 0;
  Severity: number = 0;
  Status?: string;
  ChiefComplaint: string = "";
  Symptoms: string[] = [];
  VitalSigns?: VitalSignsDTO;
  Assessment: string = "";
  Diagnosis: string = "";
  Medications: MedicationDTO[] = [];
  Treatments: unknown[] = [];
  AssignedStaff: StaffDTO[] = [];
  TransferredTo?: number;
  TransferHospital?: HospitalDTO;
  DischargeInstructions: string = "";
  DischargedAt?: Date;
  CreatedAt: Date = new Date();
  UpdatedAt: Date = new Date();
  CreatedBy: string = "";
  Notes: string = "";

  constructor(init?: Partial<GetCaseDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class PatientDTO {
  Id: number = 0;
  FirstName: string = "";
  LastName: string = "";
  Gender?: number;
  BirthDate?: string;
  Phone: string = "";
  EmergencyContactName: string = "";
  EmergencyContactPhone: string = "";
  Address: string = "";
  City: string = "";
  StudentDetails?: StudentDetailsDTO;
  EmployeeDetails?: EmployeeDetailsDTO;
}

export class EmployeeDetailsDTO {
  Id: number = 0;
  EmployeeNo: string = "";
  Department?: number;
  Position?: number;
}

export class VitalSignsDTO {
  BloodPressure: string = "";
  HeartRate: string = "";
  Temperature: string = "";
  OxygenSaturation: string = "";
  RespiratoryRate: string = "";
}

export class MedicationDTO {
  Id: string = "";
  ProductId?: number;
  ProductName: string = "";
  Quantity: number = 0;
  Notes?: string;
}

export class StaffDTO {
  Id: number = 0;
  Name: string = "";
  Role?: UserRoles;
}

export class HospitalDTO {
  Id: number = 0;
  Name?: string;
  Address: string = "";
  ContactNumber: string = "";
  EmergencyDepartment: string = "";
  AmbulanceAvailable?: boolean;
}


export const mapCaseDetailsResponse = (data: any): GetCaseDetailsDTO => {
  return new GetCaseDetailsDTO({
    Id: Number(data.id),
    CaseNumber: data.caseNumber,

    Patient: data.patient
      ? {
          Id: data.patient.id,
          FirstName: data.patient.first_name,
          LastName: data.patient.last_name,
          Gender: data.patient.gender,
          BirthDate: data.patient.birth_date,
          Phone: data.patient.phone,
          EmergencyContactName: data.patient.emergency_contact_name,
          EmergencyContactPhone: data.patient.emergency_contact_phone,
          Address: data.patient.address,
          City: data.patient.city,

          StudentDetails: data.patient.student_details
            ? {
                Id: data.patient.student_details.id,
                StudentNo: data.patient.student_details.student_number,
                Course: data.patient.student_details.course,
                YearLevel: data.patient.student_details.year_level,
                AdviserId: data.patient.student_details.adviser_id,
                AcademicYear: data.patient.student_details.academic_year,
              }
            : undefined,

          EmployeeDetails: data.patient.employee_details
            ? {
                Id: data.patient.employee_details.id,
                EmployeeNo: data.patient.employee_details.employee_no,
                Department: data.patient.employee_details.department,
                Position: data.patient.employee_details.position,
              }
            : undefined,
        } as PatientDTO
      : undefined,

    CaseType: data.caseType,
    Severity: data.severity,
    Status: data.status ?? undefined,
    ChiefComplaint: data.chiefComplaint,
    Symptoms: data.symptoms ?? [],

    VitalSigns: data.vitalSigns
      ? {
          BloodPressure: data.vitalSigns.bloodPressure,
          HeartRate: data.vitalSigns.heartRate,
          Temperature: data.vitalSigns.temperature,
          OxygenSaturation: data.vitalSigns.oxygenSaturation,
          RespiratoryRate: data.vitalSigns.respiratoryRate,
        } as VitalSignsDTO
      : undefined,

    Assessment: data.assessment,
    Diagnosis: data.diagnosis,

    Medications: (data.medications ?? []).map(
      (med: any): MedicationDTO => ({
        Id: String(med.id),
        ProductId: med.productId,
        ProductName: med.productName,
        Quantity: med.quantity,
        Notes: med.notes,
      })
    ),

    Treatments: data.treatments ?? [],

    AssignedStaff: (data.assignedStaff ?? []).map(
      (staff: any): StaffDTO => ({
        Id: staff.id,
        Name: staff.name,
        Role: staff.role ?? undefined,
      })
    ),

    TransferredTo: data.transferredTo ?? undefined,

    TransferHospital: data.transferHospital
      ? {
          Id: data.transferHospital.id,
          Name: data.transferHospital.name,
          Address: data.transferHospital.address,
          ContactNumber: data.transferHospital.contactNumber,
          EmergencyDepartment: data.transferHospital.emergencyDepartment,
          AmbulanceAvailable:
            data.transferHospital.ambulanceAvailable ?? undefined,
        } as HospitalDTO
      : undefined,

    DischargeInstructions: data.dischargeInstructions ?? "",
    DischargedAt: data.dischargedAt
      ? new Date(data.dischargedAt)
      : undefined,

    CreatedAt: new Date(data.createdAt),
    UpdatedAt: new Date(data.updatedAt),
    CreatedBy: data.createdBy ?? "",
    Notes: data.notes ?? "",
  });
};


export class CreateHospitalDTO{
  id: number = 0;
  name: string = "";
  address: string = "";
  contactNumber: string = "";
  emergencyDepartment: string = "";
  ambulanceAvailable?: boolean;
  specialization: string[] = [];

  constructor(init?: Partial<CreateHospitalDTO>) {
    return Object.assign(this, init);
  }
}