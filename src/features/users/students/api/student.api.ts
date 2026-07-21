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

/**
 * بعض endpoints تعيد:
 *
 * {
 *   status: true,
 *   data: ...
 * }
 *
 * وبعضها قد يعيد data مباشرة.
 *
 * هذه الدالة تجعل studentApi يتعامل مع الحالتين.
 */
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

/**
 * الباك قد يعيد snake_case:
 *
 * enrollment_id
 * account_status
 *
 * بينما الفرونت يستخدم camelCase:
 *
 * enrollmentId
 * accountStatus
 */
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

export const studentApi = {
  /**
   * عرض قائمة الطلاب.
   */
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

    return unwrapResponse(response.data);
  },

  /**
   * البحث عن الطلاب.
   */
  async search(
    params: StudentSearchParams,
  ): Promise<StudentListResponse> {
    const normalizedQuery =
      params.q.trim();

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

    return unwrapResponse(response.data);
  },

  /**
   * جلب معلومات الطالب الأساسية.
   *
   * هذا endpoint يستخدم studentId وليس enrollmentId.
   */
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

    return unwrapResponse(response.data);
  },

  /**
   * جلب البروفايل الكامل.
   *
   * هذا endpoint يستخدم enrollmentId.
   */
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

    return unwrapResponse(response.data);
  },

  /**
   * تسجيل طالب جديد.
   */
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

    return unwrapResponse(response.data);
  },

  /**
   * تعديل البيانات الشخصية للطالب.
   *
   * هذا endpoint يستخدم studentId.
   */
  async updatePersonal(
    studentId: ApiId,
    payload: UpdateStudentPersonalPayload,
  ): Promise<StudentDetails["student"]> {
    const formData =
      buildStudentPersonalFormData(
        payload,
      );

    const response = await axiosClient.post<
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

  /**
   * تعديل بيانات ولي الأمر.
   *
   * هذا endpoint يستخدم guardianId.
   */
  async updateGuardian(
    guardianId: ApiId,
    payload: UpdateGuardianPersonalPayload,
  ): Promise<
    NonNullable<
      StudentDetails["guardian"]
    >
  > {
    const formData =
      buildGuardianPersonalFormData(
        payload,
      );

    const response = await axiosClient.post<
      ApiResponse<
        NonNullable<
          StudentDetails["guardian"]
        >
      >
    >(
      API_ENDPOINTS.STUDENTS
        .GUARDIAN_PERSONAL(
          guardianId,
        ),
      formData,
    );

    return unwrapResponse(response.data);
  },

  /**
   * تعديل بيانات القيد الأكاديمي.
   *
   * هذا endpoint يستخدم enrollmentId.
   */
  async updateEnrollment(
    enrollmentId: ApiId,
    payload: UpdateStudentEnrollmentPayload,
  ): Promise<
    StudentFullProfile["enrollment"]
  > {
    const response = await axiosClient.post<
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

  /**
   * تفعيل أو تعطيل حساب الطالب.
   *
   * مهم:
   * يجب تمرير enrollmentId وليس studentId.
   */
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

  /**
   * سحب الطالب أو حذف القيد.
   *
   * الباك يبحث عن Enrollment،
   * لذلك يجب تمرير enrollmentId.
   */
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
      typeof response.data ===
        "object" &&
      response.data !== null &&
      "data" in response.data
    ) {
      return response.data.data;
    }

    return null;
  },

  /**
   * رفع ملف Excel أو CSV.
   *
   * الباك يتوقع اسم الحقل:
   * excel_file
   */
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

  /**
   * متابعة حالة عملية الاستيراد.
   */
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

  /**
   * جلب سجل عمليات الاستيراد.
   */
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

  /**
   * تحميل ملف أخطاء الاستيراد.
   */
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