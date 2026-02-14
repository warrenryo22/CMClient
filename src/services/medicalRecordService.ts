import api from "@/api/axios";
import {
  AIMockDataSuggestionDTO,
  MedicalCertificateFormDataDTO,
} from "@/pages/MedicalCertificate/types";
import { MedicalCertificateDTO } from "@/pages/UserProfile/types";
import {
  EmergencyCaseV2DTO,
  HospitalInfoDTO,
} from "@/types/emergencyCaseV2Types";
import { GetPaginatedDTO, PaginatedTableResponse } from "@/types/globalTypes";
import {
  AddVitalSignsDTO,
  CreateCheckupDetailsDTO,
  CreateHospitalDTO,
  ExportMedicalResponseData,
  GetCaseDetailsDTO,
  GetCasesDTO,
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
    isWalkin: boolean,
  ): Promise<MedicalCertificateDTO[]> {
    try {
      const response = await api.get(
        `medicalrecords/list-medical-records/${userDetailsId}`,
        {
          params: {
            is_walkin: isWalkin,
          },
        },
      );
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }

  async GetAllHospitals(): Promise<HospitalInfoDTO[]> {
    try {
      const response = await api.get("medicalrecords/get-all-hospitals");
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }

  async CreateEmergencyCase(payload: EmergencyCaseV2DTO): Promise<boolean> {
    try {
      await api.post("medicalrecords/create-emergency-case", payload);
      successModalInstance.show({
        message: "Emergency case has been created",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetCasesPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<GetCasesDTO>> {
    try {
      const response = await api.get("medicalrecords/get-cases-paginated", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<GetCasesDTO>();
    }
  }

  async GetSingleCase(caseId: number): Promise<GetCaseDetailsDTO> {
    try {
      const response = await api.get(`medicalrecords/get-case-by-id/${caseId}`);
      return response.data.Data;
    } catch (error) {
      return new GetCaseDetailsDTO();
    }
  }

  async CreateHospital(payload: CreateHospitalDTO): Promise<boolean> {
    try {
      await api.post("medicalrecords/create-hospital", payload);
      successModalInstance.show({
        message: "Hospital has been created",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async UpdateHospital(
    hospitalId: number,
    payload: CreateHospitalDTO,
  ): Promise<boolean> {
    try {
      await api.put(`medicalrecords/update-hospital/${hospitalId}`, payload);
      successModalInstance.show({
        message: "Hospital has been updated",
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async GetAllHospitalsPaginated(
    payload: GetPaginatedDTO,
  ): Promise<PaginatedTableResponse<CreateHospitalDTO>> {
    try {
      const response = await api.get(
        "medicalrecords/get-hospital-paginated",
        {
          params: payload,
        },
      );
      return response.data.Data;
    } catch (error) {
      return new PaginatedTableResponse<CreateHospitalDTO>();
    }
  }
}

export const medicalRecordService = new MedicalRecordService();
