import type { PaymentMethod } from "./finance.types";

// ==========================================
// Contracts Payloads
// ==========================================
export type FinalizeContractPayload = {
  studentId: number;
  academicYearId: number;
  feePlanId: number;
  installmentPolicyId: number;
  selectedExtraServiceIds: number[] | null;
};

export type UpdateContractPayload = Partial<FinalizeContractPayload>;

// ==========================================
// Payments Payloads
// ==========================================
export type ProcessPaymentPayload = {
  studentId: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paperReceiptNo: string | null;
  digitalReference: string | null;
};

export type UpdatePaymentPayload = {
  paymentMethod?: PaymentMethod;
  paperReceiptNo?: string | null;
  digitalReference?: string | null;
};