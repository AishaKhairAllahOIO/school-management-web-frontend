export type ExtraServiceType =
  | "uniform"
  | "books"
  | "activities"
  | "insurance"
  | "other";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "cheque"
  | "electronic_wallet";

export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "fully_paid";

export type InstallmentStatus =
  | "pending"
  | "paid"
  | "overdue";

export type NotificationType =
  | "upcoming_reminder"
  | "overdue_alert"
  | "payment_received"
  | "balance_cleared";

export type FinancialAccount = {
  id: string;

  studentId: string;

  academicYearId: string;

  feePlanId: string;

  installmentPolicyId: string;

  totalRequiredAmount: number;

  remainingBalance: number;

  paymentStatus: PaymentStatus;

  createdAt: string;

  updatedAt: string;
};