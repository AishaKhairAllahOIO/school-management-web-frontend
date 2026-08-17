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


function unwrapResponseData<T>(
  response: ApiResponse<T>,
): T {
  if (response.data === undefined) {
    throw new Error(
      response.message ?? "The server returned an empty response.",
    );
  }

  return response.data;
}

export const financeApi = {
  /**
   * 1. GET all financial accounts
   */
  async getAccounts(): Promise<FinancialAccount[]> {
    const response =
      await axiosClient.get<ApiResponse<FinancialAccount[]>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNTS,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 2. GET financial account by student
   */
  async getAccountByStudent(
    studentId: string | number,
  ): Promise<FinancialAccount> {
    const response =
      await axiosClient.get<ApiResponse<FinancialAccount>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId),
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 3. POST finalize financial contract
   */
  async finalizeContract(
    payload: FinalizeContractPayload,
  ): Promise<FinancialAccount> {
    const response =
      await axiosClient.post<ApiResponse<FinancialAccount>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.FINALIZE_CONTRACT,
        payload,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 4. Update financial contract
   *
   * IMPORTANT:
   * The backend controller uses:
   *
   * public function update(
   *     FinancialContractRequest $request,
   *     int $id
   * )
   *
   * Your endpoint definition must use the HTTP verb
   * actually defined in Laravel routes.
   *
   * Based on your current frontend/backend setup:
   * POST /contracts/{accountId}
   */
  async updateContract(
    accountId: string | number,
    payload: UpdateContractPayload,
  ): Promise<FinancialAccount> {
    const response =
      await axiosClient.post<ApiResponse<FinancialAccount>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.UPDATE_CONTRACT(
          accountId,
        ),
        payload,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 5. GET all installments
   */
  async getInstallments(): Promise<Installment[]> {
    const response =
      await axiosClient.get<ApiResponse<Installment[]>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENTS,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 6. GET installment by id
   */
  async getInstallment(
    installmentId: string | number,
  ): Promise<Installment> {
    const response =
      await axiosClient.get<ApiResponse<Installment>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(
          installmentId,
        ),
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 7. GET all payments
   */
  async getPayments(): Promise<PaymentReceipt[]> {
    const response =
      await axiosClient.get<ApiResponse<PaymentReceipt[]>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 8. GET payment by id
   */
  async getPayment(
    paymentId: string | number,
  ): Promise<PaymentReceipt> {
    const response =
      await axiosClient.get<ApiResponse<PaymentReceipt>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(
          paymentId,
        ),
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 9. POST new payment
   *
   * Backend returns:
   *
   * data: {
   *   receipt: PaymentTransactionResource,
   *   account: FinancialAccountResource
   * }
   */
  async processPayment(
    payload: ProcessPaymentPayload,
  ): Promise<ProcessPaymentResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<ProcessPaymentResponse>
      >(
        API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENTS,
        payload,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 10. POST update payment
   */
  async updatePayment(
    paymentId: string | number,
    payload: UpdatePaymentPayload,
  ): Promise<PaymentReceipt> {
    const response =
      await axiosClient.post<ApiResponse<PaymentReceipt>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(
          paymentId,
        ),
        payload,
      );

    return unwrapResponseData(response.data);
  },

  /**
   * 11. DELETE payment
   */
  async deletePayment(
    paymentId: string | number,
  ): Promise<null> {
    const response =
      await axiosClient.delete<ApiResponse<null>>(
        API_ENDPOINTS.FINANCE_OPERATIONS.PAYMENT(
          paymentId,
        ),
      );

    return unwrapResponseData(response.data);
  },
};