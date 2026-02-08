import api from "@/api/axios";
import { WalkInFormData } from "@/pages/Walkins/types";
import { VerifyPayloadDTO } from "@/types/walkinTypes";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class WalkinService {
    async VerifiyStudentNo(studentNo: VerifyPayloadDTO): Promise<boolean>{
        try {
            await api.post(`walkin/verify-student`, studentNo);
            return true;
        } catch (error) {
            return false;
        }
    }

    async CreateWalkin(payload: WalkInFormData): Promise<boolean>{
        try {
            await api.post('walkin/create-walkin', payload);
            successModalInstance.show({
                message: 'Walk-in registration completed successfully!'
            });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }
}

export const walkinService = new WalkinService();