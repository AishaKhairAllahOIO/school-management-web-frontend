import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type {
  ApiId,
  ApiMessageResponse,
  ApiResponse,
} from "../../shared/types/api.types";

import {
  buildGuardianPersonalFormData,
  buildStudentPersonalFormData,
  buildStudentRegistrationFormData,
} from "./student-form-data";

import type {
  DeleteStudentResponse,
  RegisterStudentPayload,
  StudentDetails,
  StudentFullProfile,
  StudentImportBatchStatus,
  StudentImportHistoryResponse,
  StudentImportStartResponse,
  StudentListFilters,
  StudentListResponse,
  StudentSearchParams,
  ToggleStudentAccountResponse,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

function unwrapResponse<T>(
  response: ApiResponse<T> | T,
): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  ) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
}

export const studentApi = {
  async list(
    filters: StudentListFilters = {},
  ): Promise<StudentListResponse> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentListResponse>
      >(
        API_ENDPOINTS.STUDENTS.FILTER,
        {
          params: filters,
        },
      );

    return unwrapResponse(response.data);
  },

  async search(
    params: StudentSearchParams,
  ): Promise<StudentListResponse> {
    const normalizedQuery = params.q.trim();

    if (normalizedQuery.length < 2) {
      throw new Error(
        "يجب أن يتكون نص البحث من حرفين على الأقل.",
      );
    }

    const response =
      await axiosClient.get<
        ApiResponse<StudentListResponse>
      >(
        API_ENDPOINTS.STUDENTS.SEARCH,
        {
          params: {
            ...params,
            q: normalizedQuery,
          },
        },
      );

    return unwrapResponse(response.data);
  },

  async getDetails(
    studentId: ApiId,
  ): Promise<StudentDetails> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentDetails>
      >(
        API_ENDPOINTS.STUDENTS.DETAILS(
          studentId,
        ),
      );

    return unwrapResponse(response.data);
  },

  async getFullProfile(
    enrollmentId: ApiId,
  ): Promise<StudentFullProfile> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentFullProfile>
      >(
        API_ENDPOINTS.STUDENTS.FULL_PROFILE(
          enrollmentId,
        ),
      );

    return unwrapResponse(response.data);
  },

  async register(
    payload: RegisterStudentPayload,
  ): Promise<StudentFullProfile> {
    const formData =
      buildStudentRegistrationFormData(
        payload,
      );

    const response =
      await axiosClient.post<
        ApiResponse<StudentFullProfile>
      >(
        API_ENDPOINTS.STUDENTS.REGISTER,
        formData,
      );

    return unwrapResponse(response.data);
  },

  async updatePersonal(
    studentId: ApiId,
    payload: UpdateStudentPersonalPayload,
  ): Promise<StudentDetails["student"]> {
    const formData =
      buildStudentPersonalFormData(
        payload,
      );

    const response =
      await axiosClient.post<
        ApiResponse<
          StudentDetails["student"]
        >
      >(
        API_ENDPOINTS.STUDENTS.PERSONAL(
          studentId,
        ),
        formData,
      );

    return unwrapResponse(response.data);
  },

  async updateGuardian(
    guardianId: ApiId,
    payload: UpdateGuardianPersonalPayload,
  ): Promise<
    NonNullable<StudentDetails["guardian"]>
  > {
    const formData =
      buildGuardianPersonalFormData(
        payload,
      );

    const response =
      await axiosClient.post<
        ApiResponse<
          NonNullable<
            StudentDetails["guardian"]
          >
        >
      >(
        API_ENDPOINTS.STUDENTS
          .GUARDIAN_PERSONAL(guardianId),
        formData,
      );

    return unwrapResponse(response.data);
  },

  async updateEnrollment(
    enrollmentId: ApiId,
    payload: UpdateStudentEnrollmentPayload,
  ): Promise<
    StudentFullProfile["enrollment"]
  > {
    const response =
      await axiosClient.post<
        ApiResponse<
          StudentFullProfile["enrollment"]
        >
      >(
        API_ENDPOINTS.STUDENTS.ENROLLMENT(
          enrollmentId,
        ),
        payload,
      );

    return unwrapResponse(response.data);
  },

  async toggleAccountStatus(
    enrollmentId: ApiId,
  ): Promise<ToggleStudentAccountResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<ToggleStudentAccountResponse>
      >(
        API_ENDPOINTS.STUDENTS
          .TOGGLE_ACCOUNT_STATUS(
            enrollmentId,
          ),
      );

    return unwrapResponse(response.data);
  },

  async remove(
    studentId: ApiId,
  ): Promise<DeleteStudentResponse | null> {
    const response =
      await axiosClient.delete<
        | ApiResponse<DeleteStudentResponse>
        | ApiMessageResponse
      >(
        API_ENDPOINTS.STUDENTS.DELETE(
          studentId,
        ),
      );

    if (
      "data" in response.data
    ) {
      return response.data.data;
    }

    return null;
  },

  async importFile(
    file: File,
  ): Promise<StudentImportStartResponse> {
    const formData = new FormData();

    formData.append(
      "excel_file",
      file,
    );

    const response =
      await axiosClient.post<
        ApiResponse<StudentImportStartResponse>
      >(
        API_ENDPOINTS.STUDENTS.IMPORT,
        formData,
      );

    return unwrapResponse(response.data);
  },

  async getImportStatus(
    batchId: ApiId,
  ): Promise<StudentImportBatchStatus> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentImportBatchStatus>
      >(
        API_ENDPOINTS.STUDENTS.IMPORT_STATUS(
          batchId,
        ),
      );

    return unwrapResponse(response.data);
  },

  async getImportHistory(
    page = 1,
  ): Promise<StudentImportHistoryResponse> {
    const response =
      await axiosClient.get<
        ApiResponse<StudentImportHistoryResponse>
      >(
        API_ENDPOINTS.STUDENTS
          .IMPORT_HISTORY,
        {
          params: {
            page,
          },
        },
      );

    return unwrapResponse(response.data);
  },

  async exportImportErrors(
    batchId: ApiId,
  ): Promise<Blob> {
    const response =
      await axiosClient.get<Blob>(
        API_ENDPOINTS.STUDENTS
          .IMPORT_ERRORS(batchId),
        {
          responseType: "blob",
        },
      );

    return response.data;
  },
};