import {
  AppointmentReasons,
  AppointmentStatus,
  AppointmentType,
  ApprovalStatus,
} from "@/enums/commons";

export class CreateAppointmentDTO {
  Date: Date = new Date();
  Time: string = "";
  Reason: AppointmentReasons = AppointmentReasons.FOLLOW_UP_CHECK_UP;
  SpecifiedReason: string = "";

  constructor(init?: Partial<CreateAppointmentDTO>) {
    return Object.assign(this, init);
  }
}

export class GetAppointmentDatesDTO {
  [Date: string]: Appointment[];

  constructor(init?: Partial<GetAppointmentDatesDTO>) {
    return Object.assign(this, init);
  }
}

export class Appointment {
  Time: string = "";

  constructor(init?: Partial<GetAppointmentDatesDTO>) {
    return Object.assign(this, init);
  }
}

export class GetUserAppointmentsDTO {
  Id: number = 0;
  AppointmentDate: Date = new Date();
  AppointmentTime: string = "";
  Status: AppointmentStatus = AppointmentStatus.PENDING;
  Type: AppointmentType = AppointmentType.SCHEDULED;

  constructor(init?: Partial<GetUserAppointmentsDTO>) {
    return Object.assign(this, init);
  }
}

export class GetUserAppointmentDetailsDTO {
  Id: number = 0;
  Name: string = "";
  AppointmentDate: Date = new Date();
  AppointmentTime: string = "";
  Reason: AppointmentReasons = AppointmentReasons.FOLLOW_UP_CHECK_UP;
  OtherReason: string = "";
  Status: AppointmentStatus = AppointmentStatus.PENDING;
  Type: AppointmentType = AppointmentType.SCHEDULED;
  QrToken: string = "";

  constructor(init?: Partial<GetUserAppointmentDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class GetOverallAppointmentDetailsDTO {
  Id: number = 0;
  FullName: string = "";
  AppointmentDate: Date = new Date();
  AppointmentTime: string = "";
  Doctor?: AppointedDoctorDTO;
  Status: AppointmentStatus = AppointmentStatus.PENDING;
  Type: AppointmentType = AppointmentType.SCHEDULED;

  constructor(init?: Partial<GetOverallAppointmentDetailsDTO>) {
    return Object.assign(this, init);
  }
}

export class AppointedDoctorDTO {
  Id: number = 0;
  DoctorId: number = 0;
  FullName: string = "";
  Status: ApprovalStatus = ApprovalStatus.APPROVED;
  Reason: string = '';

  constructor(init?: Partial<AppointedDoctorDTO>) {
    return Object.assign(this, init);
  }
}

export class AppointmentStatusCount {
  count: number = 0;
  label: number = 0; // corresponds to AppointmentStatus enum

  constructor(init?: Partial<AppointmentStatusCount>) {
    return Object.assign(this, init);
  }
}

export class AppointmentCalendarData {
  [date: string]:
    | AppointmentStatusCount[]
    | { [key: string]: AppointmentStatusCount };

  constructor(init?: Partial<AppointmentCalendarData>) {
    return Object.assign(this, init);
  }
}

export class RescheduleAppointmentDTO {
  AppointmentId: number = 0;
  NewDate: Date = new Date();
  NewTime: string = "";
  RescheduleReason: string = "";
  constructor(init?: Partial<RescheduleAppointmentDTO>) {
    return Object.assign(this, init);
  }
}

export class SetDoctorAssignmentDTO {
  AppointmentId: number = 0;
  DoctorId: number = 0;
  constructor(init?: Partial<SetDoctorAssignmentDTO>) {
    return Object.assign(this, init);
  }
}
