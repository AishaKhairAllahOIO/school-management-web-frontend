import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  AttendanceFilterParams,
  AttendanceSummaryResponse,
  BulkAttendancePayload,
  PaginatedData,
  StudentAttendance,
  UpdateAttendancePayload,
} from "../types/attendance.types";

export const studentAttendanceService = {
  // إضافة مجموعة سجلات
  storeBulk(payload: BulkAttendancePayload) {
    return axiosClient.post<ApiResponse<null>>(
      "/admin/attendance/bulk",
      payload
    );
  },

  // إضافة سجل فردي (تم إضافتها لحل مشكلة useCreateAttendance)
  storeRecord(payload: any) { 
    return axiosClient.post<ApiResponse<any>>(
      "/admin/attendance/record",
      payload
    );
  },

  // جلب السجلات حسب الفلتر
  getRecords(params: AttendanceFilterParams) {
    return axiosClient.get<ApiResponse<PaginatedData<StudentAttendance>>>(
      "/admin/attendance/filter",
      {
        params,
      }
    );
  },

  // جلب سجل محدد
  getRecord(id: string | number) {
    return axiosClient.get<ApiResponse<AttendanceSummaryResponse>>(
      `/admin/attendance/record/${id}`
    );
  },

  // جلب السجل التاريخي لطالب معين (تم إضافتها لحل مشكلة useStudentAttendanceHistory)
  getHistory(studentId: string | number) {
    return axiosClient.get<ApiResponse<any>>(
      `/admin/attendance/history/${studentId}`
    );
  },

  // تحديث سجل
  updateRecord(
    id: string | number,
    payload: UpdateAttendancePayload
  ) {
    return axiosClient.post<ApiResponse<AttendanceSummaryResponse>>(
      `/admin/attendance/record/${id}`,
      payload
    );
  },

  // حذف سجل
  deleteRecord(id: string | number) {
    return axiosClient.delete<ApiResponse<null>>(
      `/admin/attendance/record/${id}`
    );
  },
};