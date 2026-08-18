import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { CreateStaffAttendancePayload, UpdateStaffAttendancePayload } from "../types/staffAttendance.types";

export const staffAttendanceService = {

  getList: (date: string) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.FILTER, { params: { attendance_date: date } }),

  getFilteredList: (date: string, page = 1) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.FILTER, { 
      params: { attendance_date: date, page } 
    }),

  getAllStaffRoles: () => 
    axiosClient.get(API_ENDPOINTS.STAFF.LIST),

  create: (payload: CreateStaffAttendancePayload) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.CREATE, payload),

  getDetails: (id: number | string) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.DETAILS(id)),

  update: (id: number | string, payload: UpdateStaffAttendancePayload) =>
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.UPDATE(id), payload),

  delete: (id: number | string) =>
    axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.DELETE(id)),

  getHistory: (staffId: number | string) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.HISTORY(staffId)),

  getStats: (recordId: number | string) =>
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.STATS(recordId)),
};