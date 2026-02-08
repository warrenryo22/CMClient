import api from "@/api/axios";
import { AppointmentStatus } from "@/enums/commons";
import {
  AppointmentStatusCount,
  CreateAppointmentDTO,
  GetAppointmentDatesDTO,
  GetOverallAppointmentDetailsDTO,
  GetUserAppointmentDetailsDTO,
  GetUserAppointmentsDTO,
  RescheduleAppointmentDTO,
  SetDoctorAssignmentDTO,
} from "@/types/appointmentTypes";
import { GetPaginatedDTO, PaginatedTableResponse } from "@/types/globalTypes";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class AppointmentService {
  async CreateAppointment(payload: CreateAppointmentDTO): Promise<boolean> {
    try {
      await api.post("appointment/create-appointment", payload);
      successModalInstance.show({
        message: "Your appointment has been submitted",
        hideDuration: 5000,
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetAppointmentDates(month: string): Promise<GetAppointmentDatesDTO> {
    try {
      const response = await api.get("appointment/get-appointment-dates", {
        params: { month },
      });

      return response.data.Data;
    } catch (error) {
      return new GetAppointmentDatesDTO();
    }
  }

  async GetUserAppointments(
    payload: GetPaginatedDTO
  ): Promise<PaginatedTableResponse<GetUserAppointmentsDTO>> {
    try {
      const response = await api.get("appointment/get-user-appointments", {
        params: payload,
      });
      return response.data.Data;
    } catch (error) {
      return { ResponseData: [], Count: 0 };
    }
  }

  async GetUserAppointmentDetails(
    appointmentId: number
  ): Promise<GetUserAppointmentDetailsDTO> {
    try {
      const response = await api.get(
        `appointment/get-user-appointment-details/${appointmentId}`
      );
      return response.data.Data;
    } catch (error) {
      return new GetUserAppointmentDetailsDTO();
    }
  }

  async GetOverallAppointments(
    payload: GetPaginatedDTO
  ): Promise<PaginatedTableResponse<GetOverallAppointmentDetailsDTO>> {
    try {
      const response = await api.get("appointment/get-overall-appointments", {
        params: payload,
      });
      return response.data.Data;
    } catch (error) {
      return { ResponseData: [], Count: 0 };
    }
  }

  async GetAppointmentsByDate(
    date: string
  ): Promise<GetUserAppointmentDetailsDTO[]> {
    try {
      const response = await api.get(
        `appointment/get-appointments-by-date/${date}`
      );
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }

  async GetAppointmentCalendarCounts(
    month: string,
    year: string
  ): Promise<AppointmentStatusCount> {
    try {
      const response = await api.get(
        `appointment/get-appointment-calendar-counts/${month}/${year}`
      );
      return response.data.Data;
    } catch (error) {
      return new AppointmentStatusCount();
    }
  }

  async SetAppointmentStatus(
    appointmentId: number,
    status: AppointmentStatus
  ): Promise<boolean> {
    try {
      await api.put(`appointment/set-appointment-status/${appointmentId}/${status}`);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async RescheduleAppointment(payload: RescheduleAppointmentDTO
  ): Promise<boolean> {
    try {
      await api.put(`appointment/reschedule-appointment/${payload.AppointmentId}`, payload);
      successModalInstance.show({
        message: "Appointment has been rescheduled",
        hideDuration: 5000,
      })
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async AssignedDoctorToAppointment(payload: SetDoctorAssignmentDTO): Promise<boolean> {
    try {
      await api.put(`appointment/assign-doctor-to-appointment`, payload);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }
}

export const appointmentService = new AppointmentService();
