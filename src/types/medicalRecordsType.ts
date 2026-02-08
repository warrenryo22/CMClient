import { AppointmentReasons, Courses, YearLevels } from "@/enums/commons";
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
