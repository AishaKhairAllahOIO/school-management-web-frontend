import {
  API_ENDPOINTS,
} from "@/services/api/endpoints";
import {
  axiosClient,
} from "@/services/axios/axiosClient";
import type {
  ApiResponse,
} from "@/services/types/apiResponse";

import type {
  AttendanceFilterParams,
  StudentAttendance,
  UpdateAttendancePayload,
  AttendanceSummaryResponse,
  PaginatedData,
} from "../types/attendance.types";

const { STUDENT_RECORDS } = API_ENDPOINTS.ATTENDANCE;

export const studentAttendanceService = {
  
  createRecord(payload: {
    enrollment_id: number;
    attendance_date: string;
    status: string;
    absence_type: string | null;
  }) {
    return axiosClient.post<
      ApiResponse<any>
    >(
      STUDENT_RECORDS.CREATE,
      payload,
    );
  },

  getRecords(params: AttendanceFilterParams) {
    return axiosClient.get<
      ApiResponse<PaginatedData<StudentAttendance>>
    >(
      STUDENT_RECORDS.FILTER,
      { params },
    );
  },

  getRecord(id: string | number) {
    return axiosClient.get<
      ApiResponse<AttendanceSummaryResponse>
    >(
      STUDENT_RECORDS.DETAILS(id),
    );
  },

  updateRecord(
    id: string | number,
    payload: UpdateAttendancePayload,
  ) {
    return axiosClient.put<
      ApiResponse<AttendanceSummaryResponse>
    >(
      STUDENT_RECORDS.UPDATE(id),
      payload,
    );
  },

  deleteRecord(id: string | number) {
    return axiosClient.delete<
      ApiResponse<null>
    >(
      STUDENT_RECORDS.DELETE(id),
    );
  },

  getHistory(studentId: string | number) {
  
    return axiosClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.FILTER}/student/${studentId}`
    );
  },
};