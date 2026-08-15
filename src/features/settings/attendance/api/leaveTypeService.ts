import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { CreateLeaveTypePayload } from "../types/leaveType.types";

export const leaveTypeService = {
  getLeaveTypes: () => 
    axiosClient.get(API_ENDPOINTS.LEAVE_TYPES.LIST),

  createLeaveType: (payload: CreateLeaveTypePayload) => 
    axiosClient.post(API_ENDPOINTS.LEAVE_TYPES.CREATE, payload),

  getLeaveTypeDetails: (id: string | number) => 
    axiosClient.get(API_ENDPOINTS.LEAVE_TYPES.DETAILS(id)),

  updateLeaveType: (id: string | number, payload: Partial<CreateLeaveTypePayload>) => 
    axiosClient.post(API_ENDPOINTS.LEAVE_TYPES.UPDATE(id), payload),

  deleteLeaveType: (id: string | number) => 
    axiosClient.delete(API_ENDPOINTS.LEAVE_TYPES.DELETE(id)),
};