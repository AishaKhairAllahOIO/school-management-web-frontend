import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiResponse } from "@/services/types/apiResponse";
import type { FinancialAccount, Installment, PaymentReceipt } from "../types/finance.types";
import type { FinalizeContractPayload, UpdateContractPayload, ProcessPaymentPayload, UpdatePaymentPayload } from "../types/finance.payloads";

const value = (source: any, ...keys: string[]) => keys.map((key) => source?.[key]).find((item) => item !== undefined && item !== null);
const numberValue = (source: any, ...keys: string[]) => Number(value(source, ...keys) ?? 0);

function mapInstallment(raw: any): Installment {
  return {
    id: String(value(raw, "id", "installment_id") ?? ""),
    installmentNumber: numberValue(raw, "installmentNumber", "installment_number", "number"),
    title: String(value(raw, "title", "name", "installment_title") ?? `Student Installment #${numberValue(raw, "installmentNumber", "installment_number", "number") || "—"}`),
    amountDue: numberValue(raw, "amountDue", "amount_due", "amount", "required_amount"),
    amountPaid: numberValue(raw, "amountPaid", "amount_paid", "paid_amount"),
    dueDate: String(value(raw, "dueDate", "due_date") ?? ""),
    status: (value(raw, "status", "payment_status") ?? "pending") as Installment["status"],
    createdAt: String(value(raw, "createdAt", "created_at") ?? ""),
    updatedAt: String(value(raw, "updatedAt", "updated_at") ?? ""),
  };
}

function mapPayment(raw: any): PaymentReceipt {
  return {
    id: String(value(raw, "id", "payment_id") ?? ""),
    paidAmount: numberValue(raw, "paidAmount", "paid_amount", "amount"),
    paymentMethod: value(raw, "paymentMethod", "payment_method") ?? "cash",
    paperReceiptNo: value(raw, "paperReceiptNo", "paper_receipt_no") ?? null,
    digitalReference: value(raw, "digitalReference", "digital_reference") ?? null,
    cashierName: value(raw, "cashierName", "cashier_name", "user.name"),
    paymentDate: value(raw, "paymentDate", "payment_date", "created_at", "createdAt"),
    user_id: value(raw, "user_id", "userId"),
  };
}

export const financeOperationsService = {
  getAllAccounts: async () => (await axiosClient.get<ApiResponse<FinancialAccount[]>>(API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNTS)).data.data ?? [],
  getAccountByStudentId: async (studentId: string | number) => (await axiosClient.get<ApiResponse<FinancialAccount>>(API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId))).data.data,
  finalizeContract: async (payload: FinalizeContractPayload) => (await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.FINALIZE_CONTRACT, payload)).data.data,
  updateContract: async (studentId: string | number, payload: UpdateContractPayload) => (await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.UPDATE_CONTRACT(studentId), payload)).data.data,

  getAllInstallments: async () => {
    const response = await axiosClient.get<ApiResponse<any[]>>(API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENTS);
    return (response.data.data ?? []).map(mapInstallment);
  },
  getInstallmentDetails: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id));
    const raw = response.data?.data ?? response.data;
    if (!raw) throw new Error("Installment details were not returned by the server.");
    return mapInstallment(raw);
  },
  getInstallmentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id));
    return mapInstallment(response.data.data);
  },

  getAllPayments: async () => {
    const response = await axiosClient.get<ApiResponse<any[]>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS);
    return (response.data.data ?? []).map(mapPayment);
  },
  getPaymentDetails: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id));
    const raw = response.data?.data ?? response.data;
    if (!raw) throw new Error("Payment details were not returned by the server.");
    return mapPayment(raw);
  },
  getPaymentById: async (id: string | number) => mapPayment((await axiosClient.get<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id))).data.data),
  processPayment: async (payload: ProcessPaymentPayload) => (await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS, payload)).data.data,
  updatePayment: async (id: string | number, payload: UpdatePaymentPayload) => (await axiosClient.post<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id), payload)).data.data,
  deletePayment: async (id: string | number) => (await axiosClient.delete<ApiResponse<any>>(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(id))).data,
};
