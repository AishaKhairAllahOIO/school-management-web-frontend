export type PaymentStatus = "unpaid" | "partially_paid" | "paid";

export type FinancialAccount = {
  id: string;
  studentId: string;
  studentName?: string;
  academicYearId: string;
  academicYearName?: string;
  totalRequiredAmount: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  contractActivationSnapshot: string | null;
  feePlan: {
    id: string;
    academicYearId: string;
    gradeLevelId: string;
    name: string;
    baseAmount: number;
  };
  installmentPolicy: {
    id: string;
    name: string;
    installmentsCount: number;
  };
  installments: Installment[];
  createdAt: string;
  updatedAt: string;
};

export type Installment = {
  id: string;
  studentId?: string;
  studentName?: string;
  installmentNumber: number;
  title: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "cheque"
  | "electronic_wallet";

export type PaymentReceipt = {
  id: string;
  studentId?: string;
  studentName?: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paperReceiptNo: string | null;
  digitalReference: string | null;
  cashierName?: string;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  accountId?: string;
  installmentTitle?: string;
  notes?: string | null;
  user_id?: number;
};
