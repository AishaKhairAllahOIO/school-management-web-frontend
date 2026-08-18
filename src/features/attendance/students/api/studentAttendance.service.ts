import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { BulkAttendancePayload, UpdateAttendancePayload } from "../types/attendance.types";

export const studentAttendanceService = {

  getRecords: (params: { 
    class_room_id: number; 
    attendance_date?: string; 
    status?: string; 
    absence_type?: string; 
    semester_id?: number 
  }) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.FILTER, { params }),


    storeBulk: (payload: BulkAttendancePayload) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.BULK, payload),


    storeRecord: (payload: any) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.STORE || '/admin/attendance/record', payload),


    getRecord: (id: string | number) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.DETAILS(id)),


    updateRecord: (id: string | number, payload: UpdateAttendancePayload) =>
    axiosClient.put(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.UPDATE(id), payload),


    deleteRecord: (id: string | number) =>
    axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.DELETE(id)),


    getHistory: (enrollmentId: string | number, page: number = 1) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.HISTORY(enrollmentId), {
      params: { page }
    }),
  };