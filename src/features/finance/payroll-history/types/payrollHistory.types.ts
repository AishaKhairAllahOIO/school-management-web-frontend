export type PayrollStatus =
  | "Paid"
  | "Pending"
  | "Cancelled";

export interface PayrollHistory {
  id: string;

  employeeId: string;

  employeeName: string;

  role: string;

  month: string;

  baseSalary: number;

  leaveDeduction: number;

  attendanceDeduction: number;

  manualDeduction: number;

  bonus: number;

  netSalary: number;

  status: PayrollStatus;

  paidDate: string;
}