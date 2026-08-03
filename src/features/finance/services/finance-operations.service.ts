import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  FinancialAccount,
  Installment,
  PaymentMethod,
  PaymentReceipt,
} from "../types/finance.types";
import type {
  FinalizeContractPayload,
  ProcessPaymentPayload,
  UpdateContractPayload,
  UpdatePaymentPayload,
} from "../types/finance.payloads";

function value<T>(...candidates: T[]): T | undefined {
  return candidates.find(
    (candidate) => candidate !== undefined && candidate !== null,
  );
}

function fullName(source: any): string | undefined {
  const direct = value(
    source?.studentName,
    source?.student_name,
    source?.fullName,
    source?.full_name,
    source?.student?.fullName,
    source?.student?.full_name,
    source?.student?.user?.fullName,
    source?.student?.user?.full_name,
  );

  if (direct) return String(direct);

  const user = source?.student?.user ?? source?.user ?? source?.student;
  const composed = [
    value(user?.firstName, user?.first_name),
    value(user?.fatherName, user?.father_name),
    value(user?.lastName, user?.last_name),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return composed || undefined;
}

function normalizePayment(raw: any): PaymentReceipt {
  return {
    id: String(value(raw?.id, raw?.paymentId, raw?.payment_id) ?? ""),
    studentId: value(raw?.studentId, raw?.student_id, raw?.student?.id)
      ? String(value(raw?.studentId, raw?.student_id, raw?.student?.id))
      : undefined,
    studentName: fullName(raw),
    paidAmount: Number(
      value(raw?.paidAmount, raw?.paid_amount, raw?.amount, raw?.payment_amount) ?? 0,
    ),
    paymentMethod: String(
      value(raw?.paymentMethod, raw?.payment_method) ?? "cash",
    ) as PaymentMethod,
    paperReceiptNo:
      value(raw?.paperReceiptNo, raw?.paper_receipt_no, raw?.receipt_no) ?? null,
    digitalReference:
      value(raw?.digitalReference, raw?.digital_reference, raw?.reference) ?? null,
    cashierName: value(
      raw?.cashierName,
      raw?.cashier_name,
      raw?.cashier?.fullName,
      raw?.cashier?.full_name,
      raw?.createdBy?.fullName,
      raw?.created_by?.full_name,
    ) as string | undefined,
    paymentDate: value(
      raw?.paymentDate,
      raw?.payment_date,
      raw?.paid_at,
      raw?.createdAt,
      raw?.created_at,
    ) as string | undefined,
    createdAt: value(raw?.createdAt, raw?.created_at) as string | undefined,
    updatedAt: value(raw?.updatedAt, raw?.updated_at) as string | undefined,
    accountId: value(raw?.accountId, raw?.account_id, raw?.financial_account_id)
      ? String(value(raw?.accountId, raw?.account_id, raw?.financial_account_id))
      : undefined,
    installmentTitle: value(
      raw?.installmentTitle,
      raw?.installment_title,
      raw?.installment?.title,
    ) as string | undefined,
    notes: value(raw?.notes, raw?.note) ?? null,
    user_id: value(raw?.user_id, raw?.userId) as number | undefined,
  };
}

function normalizeListPayload(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export const financeOperationsService = {
  getAllAccounts: async () => {
    const response = await axiosClient.get<ApiResponse<FinancialAccount[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNTS,
    );
    return response.data.data ?? [];
  },

  getAccountByStudentId: async (studentId: string | number) => {
    const response = await axiosClient.get<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId),
    );
    return response.data.data;
  },

  finalizeContract: async (payload: FinalizeContractPayload) => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.FINALIZE_CONTRACT,
      payload,
    );
    return response.data.data;
  },

  updateContract: async (
    accountId: string | number,
    payload: UpdateContractPayload,
  ) => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.UPDATE_CONTRACT(accountId),
      payload,
    );
    return response.data.data;
  },

  getAllInstallments: async () => {
    const response = await axiosClient.get<ApiResponse<Installment[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENTS,
    );
    return response.data.data ?? [];
  },

  getInstallmentDetails: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id),
    );
    return response.data?.data;
  },

  getInstallmentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id),
    );
    return response.data.data;
  },

  getAllPayments: async () => {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS,
    );
    return normalizeListPayload(response.data?.data).map(normalizePayment);
  },

  getPaymentDetails: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id),
    );
    return normalizePayment(response.data?.data);
  },

  getPaymentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id),
    );
    return normalizePayment(response.data.data);
  },

  processPayment: async (payload: ProcessPaymentPayload) => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS,
      payload,
    );
    return response.data.data;
  },

  updatePayment: async (
    id: string | number,
    payload: UpdatePaymentPayload,
  ) => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id),
      payload,
    );
    return response.data.data;
  },

  deletePayment: async (id: string | number) => {
    const response = await axiosClient.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id),
    );
    return response.data;
  },
};
