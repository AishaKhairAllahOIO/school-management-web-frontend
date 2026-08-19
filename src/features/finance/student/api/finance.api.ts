import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  FinancialAccount,
  Installment,
  PaymentReceipt,
} from "../types/finance.types";

import type {
  FinalizeContractPayload,
  ProcessPaymentPayload,
  UpdateContractPayload,
  UpdatePaymentPayload,
} from "../types/finance.payloads";

export type ProcessPaymentResponse = {
  receipt: PaymentReceipt;
  account: FinancialAccount;
};

function unwrapResponseData<T>(response: ApiResponse<T>): T {
  if (response.data === undefined) {
    throw new Error(
      response.message ?? "The server returned an empty response.",
    );
  }

  return response.data;
}

export const financeApi = {
  async getAccounts(): Promise<FinancialAccount[]> {
    const response = await axiosClient.get<ApiResponse<FinancialAccount[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNTS,
    );

    return unwrapResponseData(response.data);
  },

  async getAccountByStudent(
    studentId: string | number,
  ): Promise<FinancialAccount> {
    const response = await axiosClient.get<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId),
    );

    return unwrapResponseData(response.data);
  },

  async finalizeContract(
    payload: FinalizeContractPayload,
  ): Promise<FinancialAccount> {
    const response = await axiosClient.post<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.FINALIZE_CONTRACT,
      payload,
    );

    return unwrapResponseData(response.data);
  },

  async updateContract(
    accountId: string | number,
    payload: UpdateContractPayload,
  ): Promise<FinancialAccount> {
    const response = await axiosClient.post<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.UPDATE_CONTRACT(accountId),
      payload,
    );

    return unwrapResponseData(response.data);
  },

  async getInstallments(): Promise<Installment[]> {
    const response = await axiosClient.get<ApiResponse<Installment[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENTS,
    );

    return unwrapResponseData(response.data);
  },

  async getInstallment(installmentId: string | number): Promise<Installment> {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(installmentId),
    );

    return unwrapResponseData(response.data);
  },

  async getInstallmentsByAccount(
    accountId: string | number,
  ): Promise<Installment[]> {
    const response = await axiosClient.get<ApiResponse<Installment[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT_INSTALLMENTS(accountId),
    );

    return unwrapResponseData(response.data);
  },

  async getPayments(): Promise<PaymentReceipt[]> {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt[]>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS,
    );

    return unwrapResponseData(response.data);
  },

  async getPayment(paymentId: string | number): Promise<PaymentReceipt> {
    const response = await axiosClient.get<ApiResponse<PaymentReceipt>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(paymentId),
    );

    return unwrapResponseData(response.data);
  },

  async processPayment(
    payload: ProcessPaymentPayload,
  ): Promise<ProcessPaymentResponse> {
    const response = await axiosClient.post<
      ApiResponse<ProcessPaymentResponse>
    >(API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS, payload);

    return unwrapResponseData(response.data);
  },

  async updatePayment(
    paymentId: string | number,
    payload: UpdatePaymentPayload,
  ): Promise<PaymentReceipt> {
    const response = await axiosClient.post<ApiResponse<PaymentReceipt>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(paymentId),
      payload,
    );

    return unwrapResponseData(response.data);
  },

  async deletePayment(paymentId: string | number): Promise<null> {
    const response = await axiosClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(paymentId),
    );

    return unwrapResponseData(response.data);
  },
};
