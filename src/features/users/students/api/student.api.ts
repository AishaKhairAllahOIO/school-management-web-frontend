import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type { ApiResponse } from "@/services/types/apiResponse";

import { buildStudentRegistrationFormData } from "./student-form-data";

import type {
  ImportBatchStatus,
  RegisterStudentFormValues,
  StudentFilters,
  StudentListResponse,
  StudentProfile,
  UpdateEnrollmentPayload,
  UpdateGuardianPersonalPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

type ApiId = string | number;

function removeEmptyValues(
  values: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  );
}

function buildUpdateFormData(
  values: Record<string, unknown>,
): FormData {
  const formData = new FormData();

  Object.entries(removeEmptyValues(values)).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

function toStudentListParams(filters: StudentFilters) {
  return {
    page: filters.page,
    per_page: filters.per_page,
    level: filters.level,
    name_classroom: filters.name_classroom,
    status: filters.status,
    search: filters.search?.trim() || undefined,
    sort: filters.sort,
  };
}

export const studentApi = {
  async list(
    filters: StudentFilters = {},
  ): Promise<StudentListResponse> {
    const response = await axiosClient.get<
      ApiResponse<StudentListResponse>
    >(API_ENDPOINTS.STUDENTS.FILTER, {
      params: toStudentListParams(filters),
    });

    return response.data.data;
  },

  async search(
    query: string,
  ): Promise<StudentListResponse> {
    const response = await axiosClient.get<
      ApiResponse<StudentListResponse>
    >(API_ENDPOINTS.STUDENTS.SEARCH, {
      params: {
        search: query.trim(),
      },
    });

    return response.data.data;
  },

  async getDetails(
    studentId: ApiId,
  ): Promise<StudentProfile> {
    const response = await axiosClient.get<
      ApiResponse<StudentProfile>
    >(API_ENDPOINTS.STUDENTS.DETAILS(studentId));

    return response.data.data;
  },

  async getFullProfile(
    enrollmentId: ApiId,
  ): Promise<StudentProfile> {
    const response = await axiosClient.get<
      ApiResponse<StudentProfile>
    >(API_ENDPOINTS.STUDENTS.FULL_PROFILE(enrollmentId));

    return response.data.data;
  },

  async register(
    values: RegisterStudentFormValues,
  ): Promise<StudentProfile> {
    const response = await axiosClient.post<
      ApiResponse<StudentProfile>
    >(
      API_ENDPOINTS.STUDENTS.REGISTER,
      buildStudentRegistrationFormData(values),
    );

    return response.data.data;
  },

  async updatePersonal(
    studentId: ApiId,
    values: UpdateStudentPersonalPayload,
  ): Promise<StudentProfile["student"]> {
    const response = await axiosClient.post<
      ApiResponse<StudentProfile["student"]>
    >(
      API_ENDPOINTS.STUDENTS.PERSONAL(studentId),
      buildUpdateFormData(
        values as Record<string, unknown>,
      ),
    );

    return response.data.data;
  },

  async updateGuardian(
    guardianId: ApiId,
    values: UpdateGuardianPersonalPayload,
  ): Promise<StudentProfile["guardian"]> {
    const response = await axiosClient.post<
      ApiResponse<StudentProfile["guardian"]>
    >(
      API_ENDPOINTS.STUDENTS.GUARDIAN_PERSONAL(guardianId),
      buildUpdateFormData(
        values as Record<string, unknown>,
      ),
    );

    return response.data.data;
  },

  async updateEnrollment(
    enrollmentId: ApiId,
    payload: UpdateEnrollmentPayload,
  ): Promise<StudentProfile["enrollment"]> {
    const response = await axiosClient.post<
      ApiResponse<StudentProfile["enrollment"]>
    >(
      API_ENDPOINTS.STUDENTS.ENROLLMENT(enrollmentId),
      removeEmptyValues(
        payload as Record<string, unknown>,
      ),
    );

    return response.data.data;
  },

  async toggleAccount(
    enrollmentId: ApiId,
  ): Promise<{ account_status: string }> {
    const response = await axiosClient.post<
      ApiResponse<{ account_status: string }>
    >(
      API_ENDPOINTS.STUDENTS.TOGGLE_ACCOUNT_STATUS(
        enrollmentId,
      ),
    );

    return response.data.data;
  },

  async remove(
    enrollmentId: ApiId,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.STUDENTS.DELETE(enrollmentId),
    );
  },

  async importFile(
    file: File,
  ): Promise<{ batch_id: ApiId }> {
    const formData = new FormData();

    formData.append("excel_file", file);

    const response = await axiosClient.post<
      ApiResponse<{ batch_id: ApiId }>
    >(API_ENDPOINTS.STUDENTS.IMPORT, formData);

    return response.data.data;
  },

  async getImportStatus(
    batchId: ApiId,
  ): Promise<ImportBatchStatus> {
    const response = await axiosClient.get<
      ApiResponse<ImportBatchStatus>
    >(API_ENDPOINTS.STUDENTS.IMPORT_STATUS(batchId));

    return response.data.data;
  },

  async downloadImportErrors(
    batchId: ApiId,
  ): Promise<Blob> {
    const response = await axiosClient.get(
      API_ENDPOINTS.STUDENTS.IMPORT_ERRORS(batchId),
      {
        responseType: "blob",
      },
    );

    return response.data;
  },

  async getImportHistory(): Promise<unknown> {
    const response = await axiosClient.get<
      ApiResponse<unknown>
    >(API_ENDPOINTS.STUDENTS.IMPORT_HISTORY);

    return response.data.data;
  },
};