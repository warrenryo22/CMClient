import { UserRoles, Courses, YearLevels, AppointmentReasons, AppointmentStatus } from '@/enums/commons';

export const getCourseLabel = (course: Courses): string => {
  const labels: Record<Courses, string> = {
    [Courses.BACHELOR_OF_SECONDARY_EDUCATION]: 'Bachelor of Secondary Education',
    [Courses.BACHELOR_OF_ELEMENTARY_EDUCATION]: 'Bachelor of Elementary Education',
    [Courses.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY]: 'BS Information Technology',
    [Courses.BACHELOR_OF_SCIENCE_IN_COMPUTER_ENGINEERING]: 'BS Computer Engineering',
    [Courses.BACHELOR_OF_SCIENCE_IN_BUSINESS_ADMINISTRATION]: 'BS Business Administration',
    [Courses.BACHELOR_OF_SCIENCE_IN_OFFICE_ADMINISTRATION]: 'BS Office Administration',
    [Courses.BACHELOR_OF_SCIENCE_IN_HOTEL_AND_RESTAURANT_MANAGEMENT]: 'BS Hotel and Restaurant Management',
    [Courses.BACHELOR_OF_SCIENCE_IN_CRIMINOLOGY]: 'BS Criminology',
    [Courses.BACHELOR_OF_LIBRARY_AND_INFORMATION_SCIENCE]: 'Bachelor of Library and Information Science',
  };
  return labels[course];
};

export const getYearLevelLabel = (year: YearLevels): string => {
  const labels: Record<YearLevels, string> = {
    [YearLevels.FIRST_YEAR]: '1st Year',
    [YearLevels.SECOND_YEAR]: '2nd Year',
    [YearLevels.THIRD_YEAR]: '3rd Year',
    [YearLevels.FOURTH_YEAR]: '4th Year',
  };
  return labels[year];
};

export const getRoleLabel = (role: UserRoles): string => {
  const labels: Record<UserRoles, string> = {
    [UserRoles.SUPERUSER]: 'Super User',
    [UserRoles.STUDENTS]: 'Student',
    [UserRoles.DOCTORS]: 'Doctor',
    [UserRoles.CLINIC_STAFF]: 'Clinic Staff',
    [UserRoles.TEACHERS]: 'Employee',
    [UserRoles.PROCUREMENT]: 'Procurement Staff',
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

export const getAppointmentStatusLabel = (status: AppointmentStatus): string => {
  const labels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Pending',
    [AppointmentStatus.APPROVED]: 'Approved',
    [AppointmentStatus.RESCHEDULED]: 'Rescheduled',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
    [AppointmentStatus.COMPLETED]: 'Completed',
    [AppointmentStatus.NO_SHOW]: 'No Show',
    [AppointmentStatus.REASSIGN]: 'Reassigned',
    [AppointmentStatus.CHECKUP_DONE]: 'Checkup Done',
  };
  return labels[status];
};

export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const colors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [AppointmentStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    [AppointmentStatus.RESCHEDULED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    [AppointmentStatus.COMPLETED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    [AppointmentStatus.REASSIGN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    [AppointmentStatus.CHECKUP_DONE]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  };
  return colors[status];
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};
