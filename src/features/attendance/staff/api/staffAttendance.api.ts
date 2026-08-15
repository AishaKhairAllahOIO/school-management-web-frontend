import { API_ENDPOINTS } from "@/services/api/endpoints"; 
import { axiosClient } from "@/services/axios/axiosClient"; 
import type { CreateStaffAttendancePayload } from '../types/staffAttendance.types'; 
 
export const staffAttendanceService = { 

  getDailyRoster: (date: string) =>  
    axiosClient.get(`${API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.FILTER}?attendance_date=${date}`),

  createRecord: (payload: CreateStaffAttendancePayload) =>  
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.CREATE, payload), 
 
  getRecordById: (id: string | number) =>  
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.DETAILS(id)), 
 
  updateRecord: (id: string | number, payload: Partial<CreateStaffAttendancePayload>) =>  
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.UPDATE(id), payload), 
 
  deleteRecord: (id: string | number) =>  
    axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.DELETE(id)), 
 
  getHistory: (staffId: string | number) =>  
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_RECORDS.HISTORY(staffId)), 
};