import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { CreateStaffLeavePayload } from '../../staff/types/staffAttendance.types';

export const staffLeaveService = {
  // ✅ جلب إجازات موظف محدد حصرياً (يجب أن يتم تمرير staffId)
  getStaffLeaves: (staffId: string | number) => {
    if (!staffId) return Promise.resolve({ data: [] });
    return axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.GET_BY_STAFF(staffId));
  },

  getLeaveDetails: (leaveId: string | number) => 
    axiosClient.get(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DETAILS(leaveId)),

  createLeave: (payload: CreateStaffLeavePayload) => 
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.CREATE, payload),

  updateLeave: (id: string | number, payload: Partial<CreateStaffLeavePayload>) => 
    axiosClient.post(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.UPDATE(id), payload),

  deleteLeave: (id: string | number) => 
    axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DELETE(id)),
};