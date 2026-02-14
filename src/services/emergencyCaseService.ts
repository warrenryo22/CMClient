import api from "@/api/axios";
import { 
  VerifyStudentDTO, 
  VerifyTeacherDTO, 
  StudentVerificationResult, 
  TeacherVerificationResult,
  EmergencyCaseDTO 
} from "@/types/emergencyCaseTypes";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class EmergencyCaseService {
  async verifyStudent(payload: VerifyStudentDTO): Promise<StudentVerificationResult> {
    try {
      const response = await api.post('emergency-case/verify-student', payload);
      return {
        success: true,
        data: response.data.Data
      };
    } catch (error) {
      handleError(error);
      return { success: false };
    }
  }

  async verifyTeacher(payload: VerifyTeacherDTO): Promise<TeacherVerificationResult> {
    try {
      const response = await api.post('emergency-case/verify-teacher', payload);
      return {
        success: true,
        data: response.data.Data
      };
    } catch (error) {
      handleError(error);
      return { success: false };
    }
  }

  async createEmergencyCase(payload: EmergencyCaseDTO): Promise<boolean> {
    try {
      await api.post('emergency-case/create', payload);
      successModalInstance.show({
        message: 'Emergency case created successfully!'
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async updateEmergencyCase(id: string, payload: EmergencyCaseDTO): Promise<boolean> {
    try {
      await api.put(`emergency-case/update/${id}`, payload);
      successModalInstance.show({
        message: 'Emergency case updated successfully!'
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  async getEmergencyCases(): Promise<EmergencyCaseDTO[]> {
    try {
      const response = await api.get('emergency-case/all');
      return response.data.Data;
    } catch (error) {
      handleError(error);
      return [];
    }
  }

  async getEmergencyCaseById(id: string): Promise<EmergencyCaseDTO | null> {
    try {
      const response = await api.get(`emergency-case/${id}`);
      return response.data.Data;
    } catch (error) {
      handleError(error);
      return null;
    }
  }
}

export const emergencyCaseService = new EmergencyCaseService();
