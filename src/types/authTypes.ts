import { Department, Gender, Position, UserRoles } from "../enums/commons";

export interface UserClaims {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserClaims | null;
  isLoading: boolean;
}

export interface DecodedRefreshToken {
  nameid: string;
  email: string;
  role: string;
  exp: number;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export class RegisterUserDTO {
  FirstName: string = "";
  LastName: string = "";
  StudentNumber: number = 0;
  Email: string = "";
  Password: string = "";
  ConfirmPass: string = "";
  SystemRole?: UserRoles | undefined = undefined;
  Address: string = "";
  City: string = "";
  Region: string = "";
  Phone: string = "";
  Avatar: string = "";
  YearLevel: number = 0;
  Course: number = 0;
  AcademicYear: string = "";
  Adviser: number = 0;
  Specialization: string = "";
  LicenseNumber?: string;
  Department?: Department;
  Position?: Position;
  Gender?: Gender;
  BirthDate?: Date;
  EmployeeNo?: string;
  EmergencyContactName?: string;
  EmergencyContactPhone?: string;

  constructor(init?: Partial<RegisterUserDTO>) {
    return Object.assign(this, init);
  }
}

export class ChangePassDTO {
  CurrPassword = "";
  NewPassword = "";
  ConfirmPass = "";

  constructor(init?: Partial<ChangePassDTO>) {
    Object.assign(this, init);
  }
}
