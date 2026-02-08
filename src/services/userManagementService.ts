import api from "@/api/axios";
import { AppointmentData, MedicalRecordSummary } from "@/pages/UserProfile/types";
import {
  GeneralResponse,
  GetPaginatedDTO,
  PaginatedTableResponse,
} from "@/types/globalTypes";
import {
  GetDoctorsDTO,
  GetPatientsDTO,
  GetUserDetailsDTO,
  GetUsersDTO,
} from "@/types/userManagementTypes";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

const handleError = (err: unknown) => {
  const error = err as AxiosError<GeneralResponse<object>>;
  const errorMessage = error.response?.data?.Message || "Something went wrong";
  toast.error(`Request Failed: \n${errorMessage}`, {
    style: {
      whiteSpace: "pre-line",
      fontSize: "0.875rem",
    },
  });
};

class UserManagementService {
  async GetUserPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<GetUsersDTO>> {
    try {
      const response = await api.get("users/get-all-users-paginated", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<GetUsersDTO>();
    }
  }

  async enableDisableUser(userId: number): Promise<boolean> {
    try {
      const response = await api.put<GeneralResponse<object>>(
        `users/toggle-user-status/${userId}`,
      );

      toast.success(
        response.data.Message || "User status updated successfully.",
      );
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }

  async GetDoctorsPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<GetDoctorsDTO>> {
    try {
      const response = await api.get("users/get-all-doctors-paginated", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<GetDoctorsDTO>();
    }
  }

  async GetAllPatientsPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<GetPatientsDTO>> {
    try {
      const response = await api.get("users/get-all-patients-paginated", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<GetPatientsDTO>();
    }
  }

  async GetUserProfileDetails(
    userDetailsId: number,
  ): Promise<GetUserDetailsDTO> {
    try {
      const response = await api.get(`users/get-user-profile/${userDetailsId}`);
      return response.data.Data;
    } catch (error) {
      return new GetUserDetailsDTO();
    }
  }

  async GetUserMedicalRecords(
    userDetailsId: number,
  ): Promise<MedicalRecordSummary[]> {
    try {
      const response = await api.get(
        `users/get-user-medical-records/${userDetailsId}`,
      );
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }

  async GetUserAppointments(
   userDetailsId: number, params: { month: string; year: string }
  ): Promise<AppointmentData[]>{
    try {
      const response = await api.get(`users/get-user-appointments/${userDetailsId}`, {
        params: params
      });

      return response.data.Data;
    } catch (error) {
      return [];
    }
  }
}

export const userManagementService = new UserManagementService();
