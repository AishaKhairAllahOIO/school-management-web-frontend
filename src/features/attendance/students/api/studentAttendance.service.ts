import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { BulkAttendancePayload, UpdateAttendancePayload } from "../types/attendance.types";

export const studentAttendanceService = {
  getRecords: (params: { 
    grade_level_id?: number | string;
    class_room_id?: number | string; 
    attendance_date?: string; 
    status?: string; 
    absence_type?: string; 
    semester_id?: number;
    search_name?: string;
    page?: number;
  }) => {

    const cleanParams: any = {
      attendance_date: params.attendance_date,
      page: params.page || 1,
    };

    if (params.semester_id) cleanParams.semester_id = params.semester_id;
    if (params.search_name) cleanParams.search_name = params.search_name;


    if (params.grade_level_id && params.grade_level_id !== "all") {
      cleanParams.grade_level_id = params.grade_level_id;
    }
    
    if (params.class_room_id && params.class_room_id !== "all") {
      cleanParams.class_room_id = params.class_room_id;
    }

    if (params.status && params.status !== "all") {
      cleanParams.status = params.status;
    }
    
    if (params.absence_type && params.absence_type !== "all") {
      cleanParams.absence_type = params.absence_type;
    }


    return axiosClient.get(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.FILTER, { 
      params: cleanParams 
    });
  },

  storeBulk: (payload: BulkAttendancePayload) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.BULK, payload),

  storeRecord: (payload: any) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STUDENT_RECORDS.STORE, payload),

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