import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import {
  normalizeApiDateOnly,
  normalizeApiDateTime,
} from "../../shared/utils/api-date";

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

function normalizeToggleAccountResponse(
  response: ToggleStudentAccountResponse & {
    enrollment_id?: ApiId;
    account_status?:
      ToggleStudentAccountResponse["accountStatus"];
  },
): ToggleStudentAccountResponse {
  return {
    ...response,

    enrollmentId:
      response.enrollmentId ??
      response.enrollment_id,

    accountStatus:
      response.accountStatus ??
      response.account_status ??
      response.status,
  };
}


function normalizePersonProfile<
  T extends {
    birthDate?: string | null;
    photoUrl?: string | null;
  },
>(person: T): T {
  return {
    ...person,
    birthDate: normalizeApiDateOnly(
      person.birthDate,
    ),
    photoUrl: person.photoUrl ?? null,
  };
}

function normalizeStudentFullProfile(
  profile: StudentFullProfile,
): StudentFullProfile {
  return {
    ...profile,
    student: normalizePersonProfile(profile.student),
    guardian: profile.guardian
      ? normalizePersonProfile(profile.guardian)
      : null,
    enrollment: {
      ...profile.enrollment,
      enrollmentDate: normalizeApiDateOnly(profile.enrollment.enrollmentDate),
      completedAt: normalizeApiDateTime(profile.enrollment.completedAt),
      deletedAt: normalizeApiDateTime(profile.enrollment.deletedAt),
      createdAt: normalizeApiDateTime(profile.enrollment.createdAt),
      updatedAt: normalizeApiDateTime(profile.enrollment.updatedAt),
      academicYear: profile.enrollment.academicYear
        ? {
            ...profile.enrollment.academicYear,
            startDate: normalizeApiDateOnly(profile.enrollment.academicYear.startDate),
            endDate: normalizeApiDateOnly(profile.enrollment.academicYear.endDate),
          }
        : profile.enrollment.academicYear,
    },
  };
}

function normalizeStudentListResponse(
  response: StudentListResponse,
): StudentListResponse {
  return {
    ...response,
    data: response.data.map((student) => ({
  ...student,
  photoUrl: student.photoUrl ?? null,
  deletedAt: normalizeApiDateTime(
    student.deletedAt,
  ),
})),
  };
}

export const studentApi = {
  async list(
    filters: StudentListFilters = {},
  ): Promise<StudentListResponse> {
    const response = await axiosClient.get<
      ApiResponse<StudentListResponse>
    >(
      API_ENDPOINTS.STUDENTS.FILTER,
      {
        params: filters,
      },
    );

    return normalizeStudentListResponse(
      unwrapResponse(response.data),
    );
  },

  async search(
    params: StudentSearchParams,
  ): Promise<StudentListResponse> {
    const normalizedQuery = params.q.trim();

    if (normalizedQuery.length < 2) {
      throw new Error(
        "Search text must contain at least two characters.",
      );
    }

    const response = await axiosClient.get<
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

    return normalizeStudentListResponse(
      unwrapResponse(response.data),
    );
  },

  async getDetails(
    studentId: ApiId,
  ): Promise<StudentDetails> {
    const response = await axiosClient.get<
      ApiResponse<StudentDetails>
    >(
      API_ENDPOINTS.STUDENTS.DETAILS(
        studentId,
      ),
    );

    const details = unwrapResponse(response.data);

    return {
      ...details,
      student: normalizePersonProfile(details.student),
      guardian: details.guardian
        ? normalizePersonProfile(details.guardian)
        : null,
    };
  },

  async getFullProfile(
    enrollmentId: ApiId,
  ): Promise<StudentFullProfile> {
    const response = await axiosClient.get<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.FULL_PROFILE(
        enrollmentId,
      ),
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
  },

  async register(
    payload: RegisterStudentPayload,
  ): Promise<StudentFullProfile> {
    const formData =
      buildStudentRegistrationFormData(
        payload,
      );

    const response = await axiosClient.post<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.REGISTER,
      formData,
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
  },

  async updatePersonal(
    studentId: ApiId,
    payload: UpdateStudentPersonalPayload,
  ): Promise<StudentFullProfile> {
    const formData =
      buildStudentPersonalFormData(
        payload,
      );

    const response = await axiosClient.post<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.PERSONAL(
        studentId,
      ),
      formData,
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
  },

  async updateGuardian(
    guardianId: ApiId,
    payload: UpdateGuardianPersonalPayload,
  ): Promise<StudentFullProfile> {
    const formData =
      buildGuardianPersonalFormData(
        payload,
      );

    const response = await axiosClient.post<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.GUARDIAN_PERSONAL(
        guardianId,
      ),
      formData,
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
  },

  async updateEnrollment(
    enrollmentId: ApiId,
    payload: UpdateStudentEnrollmentPayload,
  ): Promise<StudentFullProfile> {
    const response = await axiosClient.post<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.ENROLLMENT(
        enrollmentId,
      ),
      payload,
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
  },

  async toggleAccountStatus(
    enrollmentId: ApiId,
  ): Promise<ToggleStudentAccountResponse> {
    const response = await axiosClient.post<
      ApiResponse<
        ToggleStudentAccountResponse & {
          enrollment_id?: ApiId;
          account_status?:
            ToggleStudentAccountResponse["accountStatus"];
        }
      >
    >(
      API_ENDPOINTS.STUDENTS
        .TOGGLE_ACCOUNT_STATUS(
          enrollmentId,
        ),
    );

    const data = unwrapResponse(
      response.data,
    );

    return normalizeToggleAccountResponse(
      data,
    );
  },

  async remove(
    enrollmentId: ApiId,
  ): Promise<DeleteStudentResponse> {
    const response =
      await axiosClient.delete<
        | ApiResponse<DeleteStudentResponse>
        | ApiMessageResponse
      >(
        API_ENDPOINTS.STUDENTS.DELETE(
          enrollmentId,
        ),
      );

    if (
      typeof response.data === "object" &&
      response.data !== null &&
      "data" in response.data
    ) {
      return response.data.data;
    }

    return {};
  },

  async restore(
    enrollmentId: ApiId,
  ): Promise<StudentFullProfile> {
    const response = await axiosClient.post<
      ApiResponse<StudentFullProfile>
    >(
      API_ENDPOINTS.STUDENTS.RESTORE(
        enrollmentId,
      ),
    );

    return normalizeStudentFullProfile(unwrapResponse(response.data));
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
        API_ENDPOINTS.STUDENTS
          .IMPORT_STATUS(
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
        | ApiResponse<StudentImportHistoryResponse>
        | StudentImportHistoryResponse
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
          .IMPORT_ERRORS(
            batchId,
          ),
        {
          responseType: "blob",
        },
      );

    return response.data;
  },
};