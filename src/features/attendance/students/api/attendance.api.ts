import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  AttendanceFilterParams,
  StudentAttendance,
  UpdateAttendancePayload,
  AttendanceSummaryResponse,
  PaginatedData,
  BulkAttendancePayload,
} from "../types/attendance.types";

const { STUDENT_RECORDS } = API_ENDPOINTS.ATTENDANCE;

export const studentAttendanceService = {
  storeBulk(payload: BulkAttendancePayload) {
    return axiosClient.post<ApiResponse<any>>(
      STUDENT_RECORDS.BULK,
      payload
    );
  },

  createRecord(payload: {
    enrollment_id: number;
    attendance_date: string;
    status: string;
    absence_type: string | null;
  }) {
    const bulkPayload: BulkAttendancePayload = {
      semester_id: 1, 
      class_room_id: 1,
      attendance_date: payload.attendance_date,
      attendances: [
        {
          enrollment_id: payload.enrollment_id,
          status: payload.status as any,
          absence_type: payload.absence_type as any,
        }
      ]
    };

    return axiosClient.post<ApiResponse<any>>(
      STUDENT_RECORDS.BULK, 
      bulkPayload,
    );
  },

  getRecords(params: AttendanceFilterParams) {
    return axiosClient.get<ApiResponse<PaginatedData<StudentAttendance>>>(
      STUDENT_RECORDS.FILTER,
      { params },
    );
  },

  getRecord(id: string | number) {
    return axiosClient.get<ApiResponse<AttendanceSummaryResponse>>(
      STUDENT_RECORDS.DETAILS(id),
    );
  },

  updateRecord(id: string | number, payload: UpdateAttendancePayload) {
    return axiosClient.post<ApiResponse<AttendanceSummaryResponse>>(
      STUDENT_RECORDS.UPDATE(id),
      payload,
    );
  },

  deleteRecord(id: string | number) {
    return axiosClient.delete<ApiResponse<null>>(
      STUDENT_RECORDS.DELETE(id),
    );
  },


  getHistory(studentId: string | number) {
    return axiosClient.get<ApiResponse<any>>(
      STUDENT_RECORDS.FILTER,
      { params: { enrollment_id: studentId } }  
    );
  },
};