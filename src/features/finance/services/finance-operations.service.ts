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


function normalizeAccount(raw: any): FinancialAccount {
  const feePlan = raw?.feePlan ?? raw?.fee_plan ?? {};
  const policy = raw?.installmentPolicy ?? raw?.installment_policy ?? {};

  return {
    id: String(value(raw?.id, raw?.accountId, raw?.account_id) ?? ""),
    studentId: String(
      value(raw?.studentId, raw?.student_id, raw?.student?.id) ?? "",
    ),
    studentName: fullName(raw),
    academicYearId: String(
      value(
        raw?.academicYearId,
        raw?.academic_year_id,
        raw?.academicYear?.id,
        raw?.academic_year?.id,
      ) ?? "",
    ),
    academicYearName: value(
      raw?.academicYearName,
      raw?.academic_year_name,
      raw?.academicYear?.name,
      raw?.academic_year?.name,
    ) as string | undefined,
    totalRequiredAmount: Number(
      value(raw?.totalRequiredAmount, raw?.total_required_amount, raw?.total) ?? 0,
    ),
    remainingBalance: Number(
      value(raw?.remainingBalance, raw?.remaining_balance, raw?.balance) ?? 0,
    ),
    paymentStatus: (() => {
      const remaining = Number(
        value(raw?.remainingBalance, raw?.remaining_balance, raw?.balance) ?? 0,
      );
      const status = String(
        value(raw?.paymentStatus, raw?.payment_status, raw?.status) ?? "unpaid",
      ).toLowerCase();

      if (remaining <= 0 || ["paid", "fully_paid", "fully-paid"].includes(status)) {
        return "paid";
      }

      if (["partially_paid", "partial", "partially-paid"].includes(status)) {
        return "partially_paid";
      }

      return status as FinancialAccount["paymentStatus"];
    })(),
    contractActivationSnapshot:
      (value(
        raw?.contractActivationSnapshot,
        raw?.contract_activation_snapshot,
      ) as string | null | undefined) ?? null,
    feePlan: {
      id: String(value(feePlan?.id, raw?.feePlanId, raw?.fee_plan_id) ?? ""),
      academicYearId: String(
        value(feePlan?.academicYearId, feePlan?.academic_year_id) ?? "",
      ),
      gradeLevelId: String(
        value(feePlan?.gradeLevelId, feePlan?.grade_level_id) ?? "",
      ),
      name: String(value(feePlan?.name, raw?.feePlanName, raw?.fee_plan_name) ?? ""),
      baseAmount: Number(value(feePlan?.baseAmount, feePlan?.base_amount) ?? 0),
    },
    installmentPolicy: {
      id: String(value(policy?.id, raw?.installmentPolicyId, raw?.installment_policy_id) ?? ""),
      name: String(value(policy?.name, raw?.installmentPolicyName, raw?.installment_policy_name) ?? ""),
      installmentsCount: Number(
        value(policy?.installmentsCount, policy?.installments_count) ?? 0,
      ),
    },
    installments: normalizeListPayload(
      value(raw?.installments, raw?.scheduledInstallments, raw?.scheduled_installments) ?? [],
    ).map(normalizeInstallment),
    createdAt: String(value(raw?.createdAt, raw?.created_at) ?? ""),
    updatedAt: String(value(raw?.updatedAt, raw?.updated_at) ?? ""),
  };
}

function normalizeInstallment(raw: any): Installment {
  return {
    id: String(value(raw?.id, raw?.installmentId, raw?.installment_id) ?? ""),
    studentId: value(raw?.studentId, raw?.student_id, raw?.student?.id)
      ? String(value(raw?.studentId, raw?.student_id, raw?.student?.id))
      : undefined,
    studentName: fullName(raw),
    installmentNumber: Number(
      value(raw?.installmentNumber, raw?.installment_number, raw?.number) ?? 0,
    ),
    title: String(value(raw?.title, raw?.name) ?? "Installment"),
    amountDue: Number(value(raw?.amountDue, raw?.amount_due, raw?.amount) ?? 0),
    amountPaid: Number(value(raw?.amountPaid, raw?.amount_paid, raw?.paid_amount) ?? 0),
    dueDate: String(value(raw?.dueDate, raw?.due_date) ?? ""),
    status: String(value(raw?.status) ?? "pending") as Installment["status"],
    createdAt: String(value(raw?.createdAt, raw?.created_at) ?? ""),
    updatedAt: String(value(raw?.updatedAt, raw?.updated_at) ?? ""),
  };
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
    return normalizeListPayload(response.data?.data).map(normalizeAccount);
  },

  getAccountByStudentId: async (studentId: string | number) => {
    const response = await axiosClient.get<ApiResponse<FinancialAccount>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.ACCOUNT(studentId),
    );
    return normalizeAccount(response.data.data);
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
    return normalizeListPayload(response.data?.data).map(normalizeInstallment);
  },

  getInstallmentDetails: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id),
    );
    return normalizeInstallment(response.data?.data);
  },

  getInstallmentById: async (id: string | number) => {
    const response = await axiosClient.get<ApiResponse<Installment>>(
      API_ENDPOINTS.FINANCE_OPERATIONS.INSTALLMENT(id),
    );
    return normalizeInstallment(response.data.data);
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
