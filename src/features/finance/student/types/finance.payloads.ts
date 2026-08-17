import type { PaymentMethod } from "./finance.types";


export type FinalizeContractPayload = {
  studentId: number;
  academicYearId: number;
  feePlanId: number;
  installmentPolicyId: number;
  selectedExtraServiceIds: number[] | null;
};

export type UpdateContractPayload = {
  studentId: number;
  academicYearId: number;
  feePlanId: number;
  installmentPolicyId: number;
  selectedExtraServiceIds: number[] | null;
};


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