export enum CaseType {
  INJURY,
  ILLNESS,
  ALLERGY_REACTION,
  FAINTING,
  SEIZURE,
  CARDIAC_EVENT,
  RESPIRATORY,
  OTHER,
}

export enum Severity {
  MINOR,
  MODERATE,
  SEVERE,
  CRITICAL,
}

export enum EmergencyCaseStatus {
  ACTIVE = "Active",
  UNDER_TREATMENT = "Under Treatment",
  STABLE = "Stable",
  TRANSFERRED = "Transferred",
  DISCHARGED = "Discharged",
}

export enum PatientType {
  STUDENT = "Student",
  TEACHER = "Teacher",
  VISITOR = "Visitor",
}
