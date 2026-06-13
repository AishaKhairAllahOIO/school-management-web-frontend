export type GradeFee = {
  grade: string;
  className: string;
  annualFee: string;
  collected: string;
  outstanding: string;
};

export type RemainingBalance = {
  student: string;
  grade: string;
  className: string;
  balance: string;
  nextDue: string;
};

export type PaymentRecord = {
  id: string;
  student: string;
  amount: string;
  method: string;
  status: "Completed" | "Pending" | "Overdue";
  date: string;
  overdue: boolean;
};

export type InstallmentSchedule = {
  id: string;
  student: string;
  grade: string;
  nextPaymentDate: string;
  amount: string;
  status: "Pending" | "Paid" | "Delayed";
};

export type OverdueSummary = {
  totalOverdue: string;
  overdueAccounts: number;
  averageDelay: string;
};

export type FinanceData = {
  gradeFees: GradeFee[];
  remainingBalances: RemainingBalance[];
  payments: PaymentRecord[];
  overdueSummary: OverdueSummary;
  installments: InstallmentSchedule[];
};
