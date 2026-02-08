import { UserRoles, AppointmentReasons } from '@/enums/commons';

export const getUserRoleLabel = (role: UserRoles): string => {
  const labels: Record<UserRoles, string> = {
    [UserRoles.SUPERUSER]: 'Super User',
    [UserRoles.STUDENTS]: 'Student',
    [UserRoles.DOCTORS]: 'Doctor',
    [UserRoles.CLINIC_STAFF]: 'Clinic Staff',
    [UserRoles.TEACHERS]: 'Teacher',
    [UserRoles.PROCUREMENT]: 'Procurement',
    [UserRoles.VISITOR]: 'Visitor',
  };
  return labels[role];
};

export const getAppointmentReasonLabel = (reason: AppointmentReasons): string => {
  const labels: Record<AppointmentReasons, string> = {
    [AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS]: 'Fever or Flu-like Symptoms',
    [AppointmentReasons.HEADACHE_OR_MIGRAINE]: 'Headache or Migraine',
    [AppointmentReasons.STOMACHACHE_OR_DIGESTIVE_PROBLEMS]: 'Stomachache or Digestive Problems',
    [AppointmentReasons.MINOR_INJURY_OR_ACCIDENT]: 'Minor Injury or Accident',
    [AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS]: 'Allergy or Asthma-related Symptoms',
    [AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS]: 'Dental Pain or Oral Health Concerns',
    [AppointmentReasons.SKIN_CONDITIONS_OR_RASHES]: 'Skin Conditions or Rashes',
    [AppointmentReasons.FOLLOW_UP_CHECK_UP]: 'Follow-up Check-up',
    [AppointmentReasons.OTHER_HEALTH_CONCERNS]: 'Other Health Concerns',
  };
  return labels[reason];
};

export const getIdentificationLabel = (role: UserRoles): string => {
  if (role === UserRoles.STUDENTS) return 'Student Number';
  if (role === UserRoles.TEACHERS) return 'Employee Number';
  return 'Identification Number';
};

export const validateIdentificationNumber = (id: string, role: UserRoles): boolean => {
  // Basic validation - check if not empty
  if (!id || id.trim().length === 0) return false;
  
  // You can add more specific validation here
  // For example, format checks for student/employee numbers
  if (role === UserRoles.STUDENTS) {
    // Example: Student numbers should be numeric and 7-10 digits
    return /^\d{7,10}$/.test(id);
  }
  
  if (role === UserRoles.TEACHERS) {
    // Example: Employee numbers should be alphanumeric
    return /^[A-Z0-9]{5,10}$/i.test(id);
  }
  
  return true;
};
