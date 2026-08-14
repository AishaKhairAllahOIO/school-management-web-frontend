import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";
import type {
  AttendanceFilterParams,
  StudentAttendance,
  UpdateAttendancePayload,
  PaginatedData,
  BulkAttendancePayload,
} from "../types/attendance.types";

export const studentAttendanceService = {
  storeBulk(payload: BulkAttendancePayload) {
    return axiosClient.post<ApiResponse<any>>('/admin/attendance/bulk', payload);
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
    return axiosClient.post<ApiResponse<any>>('/admin/attendance/bulk', bulkPayload);
  },

  getRecords(params: AttendanceFilterParams) {
    return axiosClient.get<ApiResponse<PaginatedData<StudentAttendance>>>(
      '/admin/attendance/filter',
      { params }
    );
  },

  getRecord(id: string | number) {
    return axiosClient.get<ApiResponse<any>>(`/admin/attendance/getRecord/${id}`);
  },

  updateRecord(id: string | number, payload: UpdateAttendancePayload) {
    return axiosClient.post<ApiResponse<any>>(`/admin/attendance/record/${id}`, payload);
  },

  deleteRecord(id: string | number) {
    return axiosClient.delete<ApiResponse<null>>(`/admin/attendance/record/${id}`);
  },

  getHistory(studentId: string | number) {
    return axiosClient.get<ApiResponse<any>>('/admin/attendance/filter', { 
      params: { student_id: studentId } 
    });
  },
};