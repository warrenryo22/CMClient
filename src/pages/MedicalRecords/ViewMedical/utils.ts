import { AppointmentReasons, Courses, YearLevels, ActionTaken} from '@/enums/commons';

export const getCourseName = (course: Courses): string => {
  const courseNames: Record<Courses, string> = {
    [Courses.BACHELOR_OF_SECONDARY_EDUCATION]: 'Bachelor of Secondary Education',
    [Courses.BACHELOR_OF_ELEMENTARY_EDUCATION]: 'Bachelor of Elementary Education',
    [Courses.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY]: 'Bachelor of Science in Information Technology',
    [Courses.BACHELOR_OF_SCIENCE_IN_COMPUTER_ENGINEERING]: 'Bachelor of Science in Computer Engineering',
    [Courses.BACHELOR_OF_SCIENCE_IN_BUSINESS_ADMINISTRATION]: 'Bachelor of Science in Business Administration',
    [Courses.BACHELOR_OF_SCIENCE_IN_OFFICE_ADMINISTRATION]: 'Bachelor of Science in Office Administration',
    [Courses.BACHELOR_OF_SCIENCE_IN_HOTEL_AND_RESTAURANT_MANAGEMENT]: 'Bachelor of Science in Hotel and Restaurant Management',
    [Courses.BACHELOR_OF_SCIENCE_IN_CRIMINOLOGY]: 'Bachelor of Science in Criminology',
    [Courses.BACHELOR_OF_LIBRARY_AND_INFORMATION_SCIENCE]: 'Bachelor of Library and Information Science',
  };
  return courseNames[course];
};

export const getYearLevelName = (year: YearLevels): string => {
  const yearNames: Record<YearLevels, string> = {
    [YearLevels.FIRST_YEAR]: '1st Year',
    [YearLevels.SECOND_YEAR]: '2nd Year',
    [YearLevels.THIRD_YEAR]: '3rd Year',
    [YearLevels.FOURTH_YEAR]: '4th Year',
  };
  return yearNames[year];
};

export const getAppointmentReasonName = (reason: AppointmentReasons): string => {
  const reasonNames: Record<AppointmentReasons, string> = {
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
  return reasonNames[reason];
};

export const getActionTakenName = (action: ActionTaken): string => {
  const actionNames: Record<ActionTaken, string> = {
    [ActionTaken.RESTED]: 'Rested',
    [ActionTaken.MEDICATION_GIVEN]: 'Medication Given',
    [ActionTaken.SENT_HOME]: 'Sent Home',
    [ActionTaken.FIRST_AID]: 'First Aid',
    [ActionTaken.REFERRED]: 'Referred to Specialist',
  };
  return actionNames[action];
};

// export const getUOMName = (uom: UOM): string => {
//   const uomNames: Record<UOM, string> = {
//     [UOM.PIECE]: 'pc',
//     [UOM.TABLET]: 'tablet',
//     [UOM.CAPSULE]: 'capsule',
//     [UOM.ML]: 'ml',
//     [UOM.LITER]: 'L',
//     [UOM.BOTTLE]: 'bottle',
//     [UOM.VIAL]: 'vial',
//     [UOM.AMPULE]: 'ampule',
//     [UOM.ROLL]: 'roll',
//     [UOM.PACK]: 'pack',
//     [UOM.BOX]: 'box',
//     [UOM.PAIR]: 'pair',
//     [UOM.UNIT]: 'unit',
//     [UOM.SET]: 'set',
//   };
//   return uomNames[uom];
// };
