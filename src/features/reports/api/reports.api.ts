import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; // تم تصحيح المسار
import type {
  StudentAttendanceReportResponse,
  StaffAttendanceReportResponse,
  StudentFinanceReportResponse,
  StaffFinanceReportResponse,
} from "../types/reports.types";

export const reportsApi = {
  getStudentAttendance: async (): Promise<StudentAttendanceReportResponse> => {
    // استخدمنا ?. للحماية مع مسار احتياطي لمنع أي كراش
    const endpoint = API_ENDPOINTS.REPORTS?.ATTENDANCE?.STUDENTS || "/admin/reports/attendance/students";
    const response = await axiosClient.get(endpoint);
    return response.data?.data;
  },

  getStaffAttendance: async (): Promise<StaffAttendanceReportResponse> => {
    const endpoint = API_ENDPOINTS.REPORTS?.ATTENDANCE?.STAFF || "/admin/reports/attendance/staff";
    const response = await axiosClient.get(endpoint);
    return response.data?.data;
  },

  getStudentFinance: async (): Promise<StudentFinanceReportResponse> => {
    const endpoint = API_ENDPOINTS.REPORTS?.FINANCE?.STUDENTS || "/admin/reports/finance/students";
    const response = await axiosClient.get(endpoint);
    return response.data?.data;
  },

  getStaffFinance: async (): Promise<StaffFinanceReportResponse> => {
    const endpoint = API_ENDPOINTS.REPORTS?.FINANCE?.STAFF || "/admin/reports/finance/staff";
    const response = await axiosClient.get(endpoint);
    return response.data?.data;
  },
};