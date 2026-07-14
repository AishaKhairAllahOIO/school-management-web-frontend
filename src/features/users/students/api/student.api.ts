import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  RegisterStudentPayload,
  RegisterStudentResponse,
  StudentDetailsResponse,
  StudentFullProfileResponse,
  StudentImportBatchStatus,
  StudentImportResponse,
  StudentListFilters,
  StudentListItem,
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

function toListParams(filters: StudentListFilters) {
  return {
    search: filters.search || undefined,

    grade_level_id:
      filters.gradeLevelId || undefined,

    class_room_id:
      filters.classroomId || undefined,

    sort: filters.sort || undefined,

    per_page:
      filters.perPage || undefined,
  };
}

export const studentApi = {
  async list(
    filters: StudentListFilters = {},
  ): Promise<StudentListItem[]> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentListItem[]>
      >(API_ENDPOINTS.STUDENTS.LIST, {
        params: toListParams(filters),
      });

    return requireResponseData(
      response.data.data,
      "Students were not returned by the server.",
    );
  },

  async register(
    payload: RegisterStudentPayload,
  ): Promise<RegisterStudentResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<RegisterStudentResponse>
      >(
        API_ENDPOINTS.STUDENTS.REGISTER,
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Registered student data was not returned by the server.",
    );
  },

  async getDetails(
    studentId: number | string,
  ): Promise<StudentDetailsResponse> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentDetailsResponse>
      >(
        API_ENDPOINTS.STUDENTS.DETAILS(
          studentId,
        ),
      );

    return requireResponseData(
      response.data.data,
      "Student details were not returned by the server.",
    );
  },

  async getFullProfile(
    enrollmentId: number | string,
  ): Promise<StudentFullProfileResponse> {
    const response =
      await axiosClient.get<
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
    studentId: number | string,
    payload: UpdateStudentPersonalPayload,
  ) {
    return axiosClient.put<ApiResponse>(
      API_ENDPOINTS.STUDENTS.PERSONAL(
        studentId,
      ),
      payload,
    );
  },

  async updateGuardian(
    guardianId: number | string,
    payload: UpdateGuardianPersonalPayload,
  ) {
    return axiosClient.put<ApiResponse>(
      API_ENDPOINTS.STUDENTS.GUARDIAN_PERSONAL(
        guardianId,
      ),
      payload,
    );
  },

  async updateEnrollment(
    enrollmentId: number | string,
    payload: UpdateStudentEnrollmentPayload,
  ) {
    return axiosClient.put<ApiResponse>(
      API_ENDPOINTS.STUDENTS.ENROLLMENT(
        enrollmentId,
      ),
      payload,
    );
  },

  async remove(studentId: number | string) {
    return axiosClient.delete<ApiResponse>(
      API_ENDPOINTS.STUDENTS.DELETE(
        studentId,
      ),
    );
  },

  async toggleAccountStatus(
    studentId: number | string,
  ): Promise<ToggleStudentStatusResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<ToggleStudentStatusResponse>
      >(
        API_ENDPOINTS.STUDENTS
          .TOGGLE_ACCOUNT_STATUS(studentId),
      );

    return requireResponseData(
      response.data.data,
      "Updated student status was not returned by the server.",
    );
  },

  async importExcel(
    file: File,
  ): Promise<StudentImportResponse> {
    const formData = new FormData();

    formData.append("excel_file", file);

    const response =
  await axiosClient.post<
    ApiResponse<StudentImportResponse>
  >(
    API_ENDPOINTS.STUDENTS.IMPORT,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

    return requireResponseData(
      response.data.data,
      "Import batch ID was not returned by the server.",
    );
  },

  async getImportStatus(
    batchId: number | string,
  ): Promise<StudentImportBatchStatus> {
    const response =
      await axiosClient.get<
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

  async downloadImportErrors(
    batchId: number | string,
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