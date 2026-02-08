import api from "@/api/axios";
import { handleError } from "@/utilities/helpers";

class LocalUploadService {
  async UploadImageLocal(data: FormData): Promise<string | null> {
    try {
      const response = await api.post("/localupload/upload-image", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.Data;
    } catch (error) {
      handleError(error);
      return null;
    }
  }
}

export const localUploadService = new LocalUploadService();
