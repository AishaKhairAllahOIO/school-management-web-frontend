import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; // 👈 استيراد المسارات الموحدة
import type { ApiResponse } from "@/services/types/apiResponse";

import type { FinancialAccount, Installment, PaymentReceipt } from "../types/finance.types";
import type { 
  FinalizeContractPayload, 
  UpdateContractPayload, 
  ProcessPaymentPayload, 
  UpdatePaymentPayload 
} from "../types/finance.payloads";

export const financeOperationsService = {
  // ==========================================
  // 1. Financial Accounts & Contracts
  // ==========================================
  
  getAllAccounts: async () => {
    const response = await axiosClient.get<ApiResponse<FinancialAccount[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNTS
    );
    return response.data.data ?? [];
  },

  getAccountByStudentId: async (studentId: string | number) => {
    const response = await axiosClient.get<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId)
    );
    return response.data.data;
  },

  finalizeContract: async (payload: FinalizeContractPayload) => {
    const response = await axiosClient.post<ApiResponse<any>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.FINALIZE_CONTRACT, 
      payload
    );
    return response.data.data;
  },

  updateContract: async (studentId: string | number, payload: UpdateContractPayload) => {
    const response = await axiosClient.post<ApiResponse<any>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.UPDATE_CONTRACT(studentId), 
      payload
    );
    return response.data.data;
  },

  // ==========================================
  // 2. Scheduled Installments
  // ==========================================
  
  getAllInstallments: async () => {
    const response = await axiosClient.get<ApiResponse<Installment[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENTS
    );
    return response.data.data ?? [];
  },
 

  getInstallmentDetails: async (id: string | number) => {

    const response = await axiosClient.get(API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id));
    return response.data?.data;
  },

  getInstallmentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id)
    );
    return response.data.data;
  },

  // ==========================================
  // 3. Payments (Cashier Ledger)
  // ==========================================
  
  getAllPayments: async () => {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS
    );
    return response.data.data ?? [];
  },

  getPaymentDetails: async (id: string | number) => {
    const response = await axiosClient.get(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id));
    return response.data?.data;
  },

  getPaymentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id)
    );
    return response.data.data;
  },

  processPayment: async (payload: ProcessPaymentPayload) => {
    const response = await axiosClient.post<ApiResponse<any>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS, 
      payload
    );
    return response.data.data;
  },

  updatePayment: async (id: string | number, payload: UpdatePaymentPayload) => {
    const response = await axiosClient.post<ApiResponse<any>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id), 
      payload
    );
    return response.data.data;
  },

  deletePayment: async (id: string | number) => {
    const response = await axiosClient.delete<ApiResponse<any>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id)
    );
    return response.data;
  },
};