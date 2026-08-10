import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { CreateStaffLeavePayload } from '../../staff/types/staffAttendance.types';


export const staffLeaveService = {

    createLeave: (payload: CreateStaffLeavePayload) => 
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.CREATE, payload),


    getStaffLeaves: (staffId: string | number) => 
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.LIST_BY_STAFF(staffId)),


    getLeaveById: (leaveId: string | number) => 
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DETAILS(leaveId)),


    updateLeave: (id: string | number, payload: Partial<CreateStaffLeavePayload>) => 
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.UPDATE(id), payload),


    deleteLeave: (id: string | number) => 
    axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DELETE(id)),
};