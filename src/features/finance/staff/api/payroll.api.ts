import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  ApiId,
  CommitPayrollPayload,
  CreateContractPayload,
  Payroll,
  PayrollPreview,
  PayrollPreviewPayload,
  StaffFinancialContract,
  UpdateContractPayload,
  UpdatePayrollPayload,
} from "../types/payroll.types";

interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  data: T;
}

export const payrollApi = {
  // =========================
  // Contracts
  // =========================

  getContracts: async (params?: {
    staff_id?: ApiId;
    academic_year_id?: ApiId;
  }) => {
    const response =
      await axiosClient.get<ApiResponse<StaffFinancialContract[]>>(
        API_ENDPOINTS.STAFF_PAYROLL.CONTRACTS,
        { params },
      );

    return response.data;
  },

  getContract: async (id: ApiId) => {
    const response =
      await axiosClient.get<ApiResponse<StaffFinancialContract>>(
        API_ENDPOINTS.STAFF_PAYROLL.CONTRACT(id),
      );

    return response.data;
  },

  createContract: async (
    payload: CreateContractPayload,
  ) => {
    const response =
      await axiosClient.post<ApiResponse<StaffFinancialContract>>(
        API_ENDPOINTS.STAFF_PAYROLL.CONTRACTS,
        payload,
      );

    return response.data;
  },

  updateContract: async (
    id: ApiId,
    payload: UpdateContractPayload,
  ) => {
    const response =
      await axiosClient.post<ApiResponse<StaffFinancialContract>>(
        API_ENDPOINTS.STAFF_PAYROLL.CONTRACT(id),
        payload,
      );

    return response.data;
  },

  deleteContract: async (id: ApiId) => {
    const response =
      await axiosClient.delete<ApiResponse<null>>(
        API_ENDPOINTS.STAFF_PAYROLL.CONTRACT(id),
      );

    return response.data;
  },

  // =========================
  // Payroll
  // =========================

  previewPayroll: async (
    payload: PayrollPreviewPayload,
  ) => {
    const response =
      await axiosClient.post<ApiResponse<PayrollPreview>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL_PREVIEW,
        payload,
      );

    return response.data;
  },

  commitPayroll: async (
    payload: CommitPayrollPayload,
  ) => {
    const response =
      await axiosClient.post<ApiResponse<Payroll>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL_COMMIT,
        payload,
      );

    return response.data;
  },

  getMonthlyPayrolls: async (
    year: number,
    month: number,
  ) => {
    const response =
      await axiosClient.get<ApiResponse<Payroll[]>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL_MONTH,
        {
          params: {
            year,
            month,
          },
        },
      );

    return response.data;
  },

  getStaffPayrolls: async (
    staffId: ApiId,
  ) => {
    const response =
      await axiosClient.get<ApiResponse<Payroll[]>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL_BY_STAFF(staffId),
      );

    return response.data;
  },

  getPayroll: async (id: ApiId) => {
    const response =
      await axiosClient.get<ApiResponse<Payroll>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL(id),
      );

    return response.data;
  },

  updatePayroll: async (
    id: ApiId,
    payload: UpdatePayrollPayload,
  ) => {
    const response =
      await axiosClient.post<ApiResponse<Payroll>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL(id),
        payload,
      );

    return response.data;
  },

  deletePayroll: async (id: ApiId) => {
    const response =
      await axiosClient.delete<ApiResponse<null>>(
        API_ENDPOINTS.STAFF_PAYROLL.PAYROLL(id),
      );

    return response.data;
  },
};