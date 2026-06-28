export type EmployeeRole =
  | "Teacher"
  | "Supervisor"
  | "Secretary"
  | "Service Staff"
  | "Counselor";

export type SalaryType =
  | "Monthly"
  | "Per Session";

export type PayrollStatus =
  | "Paid"
  | "Pending"
  | "Processing";

export interface SalaryProfile {
  id: string;

  employeeId: string;

  employeeName: string;

  role: EmployeeRole;

  department: string;

  salaryType: SalaryType;

  baseSalary: number;

  sessionRate?: number;

  expectedSessions?: number;

  active: boolean;
}

export interface PayrollRecord {
  id: string;

  employeeId: string;

  month: string;

  baseSalary: number;

  leaveDeduction: number;

  attendanceDeduction: number;

  manualDeduction: number;

  netSalary: number;

  status: PayrollStatus;

  paidDate?: string;
}