import api from "@/api/axios";
import {
  AIMockDataSuggestionDTO,
  MedicalCertificateFormDataDTO,
} from "@/pages/MedicalCertificate/types";
import { MedicalCertificateDTO } from "@/pages/UserProfile/types";
import { GetPaginatedDTO, PaginatedTableResponse } from "@/types/globalTypes";
import {
  AddVitalSignsDTO,
  CreateCheckupDetailsDTO,
  ExportMedicalResponseData,
  GetInitialMedicalRecordsDTO,
  GetMedicalRecordDetailsDTO,
  MedicalRecordsPaginatedDTO,
  MedicalRecordsRequestPaginatedDTO,
} from "@/types/medicalRecordsType";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class MedicalRecordService {
  async AddVitalSign(payload: AddVitalSignsDTO): Promise<boolean> {
    try {
      await api.post(
        `/medicalrecords/add-vital-sign/${payload.AppointmentId}`,
        payload,
      );
      successModalInstance.show({
        message: "Vital Sign has been added",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetInitialMedicalRecords(
    appointmentId: number,
  ): Promise<GetInitialMedicalRecordsDTO> {
    try {
      const response = await api.get(
        `medicalrecords/get-initial-records/${appointmentId}`,
      );
      return response.data.Data;
    } catch (error) {
      return new GetInitialMedicalRecordsDTO();
    }
  }

  async CreateMedicalRecords(
    payload: CreateCheckupDetailsDTO,
  ): Promise<boolean> {
    try {
      await api.post("medicalrecords/create-medical-records", payload);
      successModalInstance.show({
        message: "The medical records has been created successfully",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetMedicalRecordsPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<MedicalRecordsPaginatedDTO>> {
    try {
      const response = await api.get("medicalrecords/get-records-paginated", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<MedicalRecordsPaginatedDTO>();
    }
  }

  async ViewMedicalRecord(medId: number): Promise<GetMedicalRecordDetailsDTO> {
    try {
      const response = await api.get(
        `medicalrecords/view-medical-record/${medId}`,
      );
      return response.data.Data;
    } catch (error) {
      return new GetMedicalRecordDetailsDTO();
    }
  }

  async ExportMedicalPDF(medId: number): Promise<ExportMedicalResponseData> {
    try {
      const response = await api.post(
        `medicalrecords/export-medical-pdf/${medId}`,
      );
      return response.data.Data;
    } catch (error) {
      handleError(error);
      return new ExportMedicalResponseData();
    }
  }

  async RequestMedicalRecords(medicalRecordId: number): Promise<boolean> {
    try {
      await api.post(
        `medicalrecords/request-medical-records/${medicalRecordId}`,
      );
      successModalInstance.show({
        message: "Your request has been submitted",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetMedicalRequestRecordsPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<MedicalRecordsRequestPaginatedDTO>> {
    try {
      const response = await api.get(
        "medicalrecords/get-records-request-paginated",
        {
          params: payload,
        },
      );

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<MedicalRecordsRequestPaginatedDTO>();
    }
  }

  async GetRequestCertFormDetails(
    reqId: number,
  ): Promise<MedicalCertificateFormDataDTO> {
    try {
      const response = await api.get(
        `medicalrecords/get-medical-request-form-initial/${reqId}`,
      );
      return response.data.Data;
    } catch (error) {
      return new MedicalCertificateFormDataDTO();
    }
  }

  async AIAssistedCertificate(medId: number): Promise<AIMockDataSuggestionDTO> {
    try {
      const response = await api.post(
        `medicalrecords/ai-assisted-med-cert/${medId}`,
      );
      return response.data.Data;
    } catch (error) {
      return new AIMockDataSuggestionDTO();
    }
  }

  async CreateCertificate(
    payload: MedicalCertificateFormDataDTO,
  ): Promise<number> {
    try {
      const response = await api.post(
        "medicalrecords/create-certificate",
        payload,
      );
      return response.data.Data;
    } catch (error) {
      handleError(error);
      return 0;
    }
  }

  async ViewCertificate(medId: number): Promise<MedicalCertificateFormDataDTO> {
    try {
      const response = await api.get(
        `medicalrecords/view-certificate/${medId}`,
      );
      return response.data.Data;
    } catch (error) {
      handleError(error);
      return new MedicalCertificateFormDataDTO();
    }
  }

  async GetMedicalCertificates(
    userDetailsId: number,
  ): Promise<MedicalCertificateDTO[]> {
    try {
      const response = await api.get(`medicalrecords/list-medical-records/${userDetailsId}`);
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }
}

export const medicalRecordService = new MedicalRecordService();
