export type PersonType = "student" | "teacher" | "staff"

export interface BasePerson {
  id: string
  name: string
  age: number
  type: PersonType
  reasonForVisit: string
}

export interface Student extends BasePerson {
  type: "student"
  grade: string
  section: string
}

export interface Teacher extends BasePerson {
  type: "teacher"
  department: string
  position: string
}

export interface Staff extends BasePerson {
  type: "staff"
  department: string
  role: string
}

export type Person = Student | Teacher | Staff

export type ItemCategory = "medicine" | "first_aid" | "equipment" | "supply"

export interface HealthItem {
  id: string
  name: string
  category: ItemCategory
  unit: string
  stockQuantity: number
  description?: string
}

export interface ProvidedItem {
  item: HealthItem
  quantity: number
  notes?: string
}

export interface VitalSigns {
  temperature?: string
  bloodPressure?: string
  pulseRate?: string
}

export interface CheckupFormData {
  symptoms: string
  vitalSigns: VitalSigns
  findings: string
  actionTaken: ActionTaken[]
  providedItems: ProvidedItem[]
  remarks: string
}

export type ActionTaken = "rested" | "medication_given" | "sent_home" | "first_aid" | "referred"

export type CheckupStatus = "in_progress" | "completed"

export interface CheckupRecord {
  id: string
  person: Person
  visitDate: Date
  formData: CheckupFormData
  status: CheckupStatus
}
