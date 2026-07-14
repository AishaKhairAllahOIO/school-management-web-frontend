import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import {
  createPersonalUpdateFormData,
  createRegisterStudentFormData,
} from "./student.form-data";

import {
  mapImportHistoryPayload,
  mapStudentListPayload,
} from "./student.mappers";

import type {
  ApiEnrollment,
  ApiPerson,
  EntityId,
  RegisterStudentPayload,
  RegisterStudentResponse,
  StudentDetailsResponse,
  StudentFilterApiPayload,
  StudentFullProfileResponse,
  StudentImportBatchStatus,
  StudentImportHistoryItem,
  StudentImportHistoryResult,
  StudentImportResponse,
  StudentListFilters,
  StudentListResult,
  ToggleStudentStatusResponse,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
} from "../types/student-api.types";

function requireResponseData<T>(
  data: T | undefined,
  errorMessage: string,
): T {
  if (data === undefined) {
    throw new Error(errorMessage);
  }

  return data;
}

function compactParams(
  params: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "",
    ),
  );
}

function toFilterParams(filters: StudentListFilters) {
  return compactParams({
    level: filters.level,
    name_classroom: filters.classroomName,
    status: filters.status,
    sort: filters.sort,
    page: filters.page,
  });
}

function toEnrollmentPayload(
  payload: UpdateStudentEnrollmentPayload,
) {
  return compactParams({
    academic_year_id: payload.academicYearId,
    grade_level_id: payload.gradeLevelId,
    class_room_id: payload.classroomId,
    enrollment_status: payload.enrollmentStatus,
  });
}

export const studentApi = {
  async list(
    filters: StudentListFilters = {},
  ): Promise<StudentListResult> {
    const normalizedQuery = filters.query?.trim();

    if (normalizedQuery) {
      const response = await axiosClient.get<
        ApiResponse<StudentFilterApiPayload>
      >(API_ENDPOINTS.STUDENTS.SEARCH, {
        params: {
          q: normalizedQuery,
          page: filters.page,
        },
      });

      return mapStudentListPayload(
        requireResponseData(
          response.data.data,
          "Students were not returned by the server.",
        ),
      );
    }

    const response = await axiosClient.get<
      ApiResponse<StudentFilterApiPayload>
    >(API_ENDPOINTS.STUDENTS.FILTER, {
      params: toFilterParams(filters),
    });

    return mapStudentListPayload(
      requireResponseData(
        response.data.data,
        "Students were not returned by the server.",
      ),
    );
  },

  async register(
    payload: RegisterStudentPayload,
  ): Promise<RegisterStudentResponse> {
    const formData =
      createRegisterStudentFormData(payload);

    const response = await axiosClient.post<
      ApiResponse<RegisterStudentResponse>
    >(
      API_ENDPOINTS.STUDENTS.REGISTER,
      formData,
    );

    return requireResponseData(
      response.data.data,
      "Registered student data was not returned by the server.",
    );
  },

  async getDetails(
    studentId: EntityId,
  ): Promise<StudentDetailsResponse> {
    const response = await axiosClient.get<
      ApiResponse<StudentDetailsResponse>
    >(
      API_ENDPOINTS.STUDENTS.DETAILS(studentId),
    );

    return requireResponseData(
      response.data.data,
      "Student details were not returned by the server.",
    );
  },

  async getFullProfile(
    enrollmentId: EntityId,
  ): Promise<StudentFullProfileResponse> {
    const response = await axiosClient.get<
      ApiResponse<StudentFullProfileResponse>
    >(
      API_ENDPOINTS.STUDENTS.FULL_PROFILE(
        enrollmentId,
      ),
    );

    return requireResponseData(
      response.data.data,
      "Student full profile was not returned by the server.",
    );
  },

  async updatePersonal(
    studentId: EntityId,
    payload: UpdateStudentPersonalPayload,
  ): Promise<ApiPerson> {
    const response = await axiosClient.post<
      ApiResponse<ApiPerson>
    >(
      API_ENDPOINTS.STUDENTS.PERSONAL(studentId),
      createPersonalUpdateFormData(payload),
    );

    return requireResponseData(
      response.data.data,
      "Updated student data was not returned by the server.",
    );
  },

  async updateGuardian(
    guardianId: EntityId,
    payload: UpdateGuardianPersonalPayload,
  ): Promise<ApiPerson> {
    const response = await axiosClient.post<
      ApiResponse<ApiPerson>
    >(
      API_ENDPOINTS.STUDENTS.GUARDIAN_PERSONAL(
        guardianId,
      ),
      createPersonalUpdateFormData(payload),
    );

    return requireResponseData(
      response.data.data,
      "Updated guardian data was not returned by the server.",
    );
  },

  async updateEnrollment(
    enrollmentId: EntityId,
    payload: UpdateStudentEnrollmentPayload,
  ): Promise<ApiEnrollment> {
    const response = await axiosClient.post<
      ApiResponse<ApiEnrollment>
    >(
      API_ENDPOINTS.STUDENTS.ENROLLMENT(
        enrollmentId,
      ),
      toEnrollmentPayload(payload),
    );

    return requireResponseData(
      response.data.data,
      "Updated enrollment data was not returned by the server.",
    );
  },

  async remove(
    enrollmentId: EntityId,
  ): Promise<void> {
    await axiosClient.delete<ApiResponse<never>>(
      API_ENDPOINTS.STUDENTS.DELETE(enrollmentId),
    );
  },

  async toggleAccountStatus(
    enrollmentId: EntityId,
  ): Promise<ToggleStudentStatusResponse> {
    const response = await axiosClient.post<
      ApiResponse<ToggleStudentStatusResponse>
    >(
      API_ENDPOINTS.STUDENTS
        .TOGGLE_ACCOUNT_STATUS(enrollmentId),
    );

    return requireResponseData(
      response.data.data,
      "Updated account status was not returned by the server.",
    );
  },

  async importExcel(
    file: File,
  ): Promise<StudentImportResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<
      ApiResponse<StudentImportResponse>
    >(
      API_ENDPOINTS.STUDENTS.IMPORT,
      formData,
    );

    return requireResponseData(
      response.data.data,
      "Import batch ID was not returned by the server.",
    );
  },

  async getImportStatus(
    batchId: EntityId,
  ): Promise<StudentImportBatchStatus> {
    const response = await axiosClient.get<
      ApiResponse<StudentImportBatchStatus>
    >(
      API_ENDPOINTS.STUDENTS.IMPORT_STATUS(
        batchId,
      ),
    );

    return requireResponseData(
      response.data.data,
      "Student import status was not returned by the server.",
    );
  },

  async getImportHistory(): Promise<StudentImportHistoryResult> {
    const response = await axiosClient.get<
      ApiResponse<
        | StudentImportHistoryItem[]
        | {
            data: StudentImportHistoryItem[];
            meta?: {
              current_page: number;
              last_page: number;
              per_page?: number;
              total?: number;
            };
          }
      >
    >(
      API_ENDPOINTS.STUDENTS.IMPORT_HISTORY,
    );

    return mapImportHistoryPayload(
      requireResponseData(
        response.data.data,
        "Import history was not returned by the server.",
      ),
    );
  },

  async downloadImportErrors(
    batchId: EntityId,
  ): Promise<Blob> {
    const response = await axiosClient.get<Blob>(
      API_ENDPOINTS.STUDENTS.IMPORT_ERRORS(
        batchId,
      ),
      {
        responseType: "blob",
      },
    );

    return response.data;
  },
};
