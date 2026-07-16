import type { AxiosInstance } from "axios";
import type { ApiId, ApiResponse } from "../../shared/types/api.types";
import { buildStudentRegistrationFormData } from "./student-form-data";
import { studentEndpoints } from "./student.endpoints";
import type {
  ImportBatchStatus,
  RegisterStudentFormValues,
  StudentFilters,
  StudentListResponse,
  StudentProfile,
  UpdateEnrollmentPayload,
} from "../types/student.types";

export function createStudentApi(client: AxiosInstance) {
  return {
    async list(filters: StudentFilters = {}) {
      const response = await client.get<ApiResponse<StudentListResponse>>(
        studentEndpoints.filter,
        { params: filters },
      );
      return response.data.data;
    },

    async search(query: string) {
      const response = await client.get<ApiResponse<StudentListResponse>>(
        studentEndpoints.search,
        { params: { q: query } },
      );
      return response.data.data;
    },

    async getDetails(studentId: ApiId) {
      const response = await client.get<ApiResponse<StudentProfile>>(
        studentEndpoints.details(studentId),
      );
      return response.data.data;
    },

    async getFullProfile(enrollmentId: ApiId) {
      const response = await client.get<ApiResponse<StudentProfile>>(
        studentEndpoints.fullProfile(enrollmentId),
      );
      return response.data.data;
    },

    async register(values: RegisterStudentFormValues) {
      const response = await client.post<ApiResponse<StudentProfile>>(
        studentEndpoints.register,
        buildStudentRegistrationFormData(values),
      );
      return response.data.data;
    },

    async updatePersonal(studentId: ApiId, values: Record<string, unknown>) {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });
      const response = await client.post<ApiResponse<StudentProfile["student"]>>(
        studentEndpoints.personal(studentId),
        formData,
      );
      return response.data.data;
    },

    async updateGuardian(guardianId: ApiId, values: Record<string, unknown>) {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });
      const response = await client.post<ApiResponse<StudentProfile["guardian"]>>(
        studentEndpoints.guardianPersonal(guardianId),
        formData,
      );
      return response.data.data;
    },

    async updateEnrollment(enrollmentId: ApiId, payload: UpdateEnrollmentPayload) {
      const response = await client.post<ApiResponse<StudentProfile["enrollment"]>>(
        studentEndpoints.enrollment(enrollmentId),
        payload,
      );
      return response.data.data;
    },

    async toggleAccount(enrollmentId: ApiId) {
      const response = await client.post<ApiResponse<{ account_status: string }>>(
        studentEndpoints.toggleAccount(enrollmentId),
      );
      return response.data.data;
    },

    async remove(enrollmentId: ApiId) {
      await client.delete(studentEndpoints.remove(enrollmentId));
    },

    async importFile(file: File) {
      const formData = new FormData();
      formData.append("excel_file", file);
      const response = await client.post<ApiResponse<{ batch_id: ApiId }>>(
        studentEndpoints.import,
        formData,
      );
      return response.data.data;
    },

    async getImportStatus(batchId: ApiId) {
      const response = await client.get<ApiResponse<ImportBatchStatus>>(
        studentEndpoints.importStatus(batchId),
      );
      return response.data.data;
    },

    async exportImportErrors(batchId: ApiId) {
      const response = await client.get<Blob>(studentEndpoints.importErrors(batchId), {
        responseType: "blob",
      });
      return response.data;
    },
  };
}
