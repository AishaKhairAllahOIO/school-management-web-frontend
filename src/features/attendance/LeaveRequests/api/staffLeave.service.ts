import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiResponse } from "@/services/types/apiResponse";
import type {
  StaffLeaveRecord,
  CreateStaffLeavePayload,
  UpdateStaffLeavePayload,
} from "../types/staffLeave.types";

function unwrap<T>(value: ApiResponse<T> | T): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as ApiResponse<T>).data as T;
  }
  return value as T;
}

export const staffLeaveService = {
  async allRecords(): Promise<StaffLeaveRecord[]> {
    const response = await axiosClient.get<ApiResponse<StaffLeaveRecord[]>>(
      API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.LIST_ALL
    );
    const rawData = unwrap(response.data) ?? [];
    

    return Array.isArray(rawData) ? rawData.map((item: any) => ({
      ...item,
      start_date: item.start_date ? item.start_date.split("T")[0] : "",
      end_date: item.end_date ? item.end_date.split("T")[0] : "",
      leave_type: item.leave_type || { id: item.leave_type_id, name: "إجازة إدارية / رسمية", payment_type: "paid" }
    })) : [];
  },

  async getByStaff(staffId: string | number): Promise<StaffLeaveRecord[]> {
    const response = await axiosClient.get<ApiResponse<StaffLeaveRecord[]>>(
      API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.GET_BY_STAFF(staffId)
    );
    return unwrap(response.data) ?? [];
  },

  async getDetails(leaveId: string | number): Promise<StaffLeaveRecord> {
    const response = await axiosClient.get<ApiResponse<StaffLeaveRecord>>(
      API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DETAILS(leaveId)
    );
    return unwrap(response.data);
  },

  async create(payload: CreateStaffLeavePayload): Promise<StaffLeaveRecord> {
    const response = await axiosClient.post<ApiResponse<StaffLeaveRecord>>(
      API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.CREATE,
      payload
    );
    return unwrap(response.data);
  },

  async update(id: string | number, payload: UpdateStaffLeavePayload): Promise<StaffLeaveRecord> {
    const response = await axiosClient.post<ApiResponse<StaffLeaveRecord>>(
      API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.UPDATE(id),
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: string | number): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.ATTENDANCE.STAFF_LEAVES.DELETE(id));
  },
};