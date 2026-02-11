import {
  Courses,
  Department,
  DoctorSpecializations,
  Gender,
  Position,
  UserRoles,
  YearLevels,
} from "@/enums/commons";

export class GetUsersDTO {
  Id: number = 0;
  Email: string = "";
  FullName: string = "";
  Role: UserRoles = UserRoles.STUDENTS;
  Active: boolean = false;

  constructor(init?: Partial<GetUsersDTO>) {
    Object.assign(this, init);
  }
}

export class GetDoctorsDTO {
  Id: number = 0;
  FullName: string = "";
  Specialization: DoctorSpecializations =
    DoctorSpecializations.GENERAL_PRACTITIONER;
  LicenseNumber: string = "";
  ImageUrl?: string;

  constructor(init?: Partial<GetDoctorsDTO>) {
    Object.assign(this, init);
  }
}

export class GetPatientsDTO {
  Id?: number;
  WalkinId?: number;
  FullName: string = "";
  Role?: UserRoles;
  Birthdate?: Date;
  PatientType?: string;

  constructor(init?: Partial<GetPatientsDTO>) {
    Object.assign(this, init);
  }
}

export class GetUserDetailsDTO {
  UserDetailsId?: number;
  WalkinId?: number;

  FullName?: string;
  Role?: UserRoles;
  Email?: string;
  Phone?: string;
  Address?: string;

  DateOfBirth?: Date;
  Gender?: Gender;
  AvatarUrl?: string;

  TeacherDetails?: {
    Department: Department;
    Position: Position;
  };

  StudentDetails?: {
    StudentNo: string;
    Course: Courses;
    YearLevel: YearLevels;
  };

  constructor(init?: Partial<GetUserDetailsDTO>) {
    if (!init) return;

    Object.entries(init).forEach(([key, value]) => {
      (this as any)[key] = value === null ? undefined : value;
    });
  }
}
