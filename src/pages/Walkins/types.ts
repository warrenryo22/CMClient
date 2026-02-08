import { UserRoles, AppointmentReasons } from '@/enums/commons';

export interface WalkInFormData {
  role: UserRoles | null;
  identificationNumber: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  appointmentReason: AppointmentReasons | null;
  otherReason: string;
}

export const initialFormData: WalkInFormData = {
  role: null,
  identificationNumber: '',
  firstName: undefined,
  lastName: undefined,
  birthDate: undefined,
  appointmentReason: null,
  otherReason: '',
};

export const ALLOWED_ROLES = [
  UserRoles.STUDENTS,
  UserRoles.TEACHERS,
  UserRoles.VISITOR,
];

// Helper to check if role requires identification number
export const requiresIdentification = (role: UserRoles | null): boolean => {
  return role === UserRoles.STUDENTS || role === UserRoles.TEACHERS;
};

// Helper to check if role is visitor
export const isVisitor = (role: UserRoles | null): boolean => {
  return role === UserRoles.VISITOR;
};
