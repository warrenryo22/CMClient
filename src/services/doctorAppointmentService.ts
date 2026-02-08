import api from "@/api/axios";
import { GetDoctorAppointmentDTO, ReassignDoctorPayloadDTO } from "@/types/doctorAppointmentTypes";
import { GetPaginatedDTO, PaginatedTableResponse } from "@/types/globalTypes";
import { handleError } from "@/utilities/helpers";

class DoctoAppointmentService{
    async GetDoctorAppointmentPaginated(payload: GetPaginatedDTO): Promise<PaginatedTableResponse<GetDoctorAppointmentDTO>>{
        try {
            const response = await api.get('doctorappointment/get-doctor-appointment-paginated', {
                params: payload
            });

            return response.data.Data;
        } catch (error) {
            return new PaginatedTableResponse<GetDoctorAppointmentDTO>;
        }
    }

    async ReassignDoctor(payload: ReassignDoctorPayloadDTO): Promise<boolean>{
        try {
            await api.put('doctorappointment/reassign-doctor', payload);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }
}

export const doctorAppointmentService = new DoctoAppointmentService();