export type PaymentStatus =
  | "draft"
  | "unpaid"
  | "partially_paid"
  | "fully_paid";

export type InstallmentStatus =
  | "pending"
  | "paid"
  | "overdue";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "cheque"
  | "electronic_wallet";

export type FinancialAccount = {
  id: string;
  studentId: string;
  academicYearId: string;

  totalRequiredAmount: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;

  contractActivationSnapshot: unknown | null;

  feePlan: FinancialFeePlan | null;
  installmentPolicy: InstallmentPolicy | null;
  installments: Installment[];

  createdAt: string | null;
  updatedAt: string | null;
};

export type FinancialFeePlan = {
  id: string;
  academicYearId: string;
  gradeLevelId: string;

  name: string;
  baseAmount: number;

  /*
   * Backend may return these relations when loaded.
   */
  academicYear?: unknown;
  gradeLevel?: unknown;
  installmentPolicy?: InstallmentPolicy;
  extraServices?: FeePlanExtraService[];
};

export type FeePlanExtraService = {
  id: string;
  type?: string;
  name?: string;
  amount?: number;
};

export type InstallmentPolicy = {
  id: string;
  name: string;
  installmentsCount: number;

  items?: InstallmentPolicyItem[];
};

export type InstallmentPolicyItem = {
  id: string;
  installmentNumber: number;
  title: string;
  percentage: number;
  dueMonth: number;
  dueDay: number;

  createdAt: string | null;
  updatedAt: string | null;
};

export type Installment = {
  id: string;

  installmentNumber: number;
  title: string;

  amountDue: number;
  amountPaid: number;

  dueDate: string | null;
  status: InstallmentStatus;

  createdAt: string | null;
  updatedAt: string | null;
};

export type PaymentReceipt = {
  id: string;

  accountId: string;
  studentId: number | null;

  paidAmount: number;
  paymentMethod: PaymentMethod;

  paperReceiptNo: string | null;
  digitalReference: string | null;

  userId: number | null;

  createdAt: string | null;
  updatedAt: string | null;
};