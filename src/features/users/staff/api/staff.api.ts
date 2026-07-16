import type { AxiosInstance } from "axios";
import type { ApiId, ApiResponse } from "../../shared/types/api.types";
import { appendFormDataRecord } from "../../shared/api/form-data.utils";
import type { RegisterStaffFormValues, StaffListResponse, StaffProfile } from "../types/staff.types";
import { staffEndpoints } from "./staff.endpoints";

export function createStaffApi(client: AxiosInstance) {
  return {
    async list(page = 1) {
      const response = await client.get<ApiResponse<StaffListResponse>>(
        staffEndpoints.list,
        { params: { page } },
      );
      return response.data.data;
    },

    async search(name: string, perPage = 15) {
      const response = await client.get<ApiResponse<StaffListResponse>>(
        staffEndpoints.search,
        { params: { name, per_page: perPage } },
      );
      return response.data.data;
    },

    async alphabetical(direction: "asc" | "desc" = "asc") {
      const response = await client.get<ApiResponse<StaffListResponse>>(
        staffEndpoints.alphabetical,
        { params: { direction } },
      );
      return response.data.data;
    },

    async getDetails(staffId: ApiId) {
      const response = await client.get<ApiResponse<StaffProfile>>(
        staffEndpoints.details(staffId),
      );
      return response.data.data;
    },

    async register(values: RegisterStaffFormValues) {
      const formData = new FormData();
      appendFormDataRecord(formData, values);
      const response = await client.post<ApiResponse<StaffProfile>>(
        staffEndpoints.register,
        formData,
      );
      return response.data.data;
    },

    async updatePersonal(staffId: ApiId, values: Record<string, unknown>) {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });
      const response = await client.post<ApiResponse<StaffProfile>>(
        staffEndpoints.personal(staffId),
        formData,
      );
      return response.data.data;
    },

    async updateEmployment(staffId: ApiId, values: Record<string, unknown>) {
      const response = await client.post<ApiResponse<StaffProfile>>(
        staffEndpoints.employment(staffId),
        values,
      );
      return response.data.data;
    },

    async toggleStatus(staffId: ApiId) {
      await client.post(staffEndpoints.toggleStatus(staffId));
    },

    async remove(staffId: ApiId) {
      await client.delete(staffEndpoints.remove(staffId));
    },

    async importFile(file: File) {
      const formData = new FormData();
      formData.append("excel_file", file);
      const response = await client.post<ApiResponse<{ batch_id: ApiId }>>(
        staffEndpoints.import,
        formData,
      );
      return response.data.data;
    },

    async exportImportErrors(batchId: ApiId) {
      const response = await client.get<Blob>(staffEndpoints.importErrors(batchId), {
        responseType: "blob",
      });
      return response.data;
    },
  };
}
