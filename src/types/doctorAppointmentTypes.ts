import { AppointmentStatus, AppointmentType } from "@/enums/commons";
import { AppointedDoctorDTO } from "./appointmentTypes";

export class GetDoctorAppointmentDTO {
  Id: number = 0;
  FullName: string = "";
  AppointmentDate: Date = new Date();
  AppointmentTime: string = "";
  Doctor?: AppointedDoctorDTO;
  Status: AppointmentStatus = AppointmentStatus.PENDING;
  Type: AppointmentType = AppointmentType.SCHEDULED;
  HasVitalSigns: boolean = false;

  constructor(init?: Partial<GetDoctorAppointmentDTO>) {
    return Object.assign(this, init);
  }
}

export class ReassignDoctorPayloadDTO {
  AppointmentId: number = 0;
  Reason: string = "";

  constructor(init?: Partial<ReassignDoctorPayloadDTO>) {
    return Object.assign(this, init);
  }
}
