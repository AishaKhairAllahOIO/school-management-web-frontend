export type DeductionType =
  | "Leave Deduction"
  | "Attendance Deduction"
  | "Manual Deduction";

export type DeductionStatus =
  | "Applied"
  | "Pending"
  | "Cancelled";

export interface Deduction {
  id: string;

  employeeId: string;

  employeeName: string;

  role: string;

  type: DeductionType;

  reason: string;

  amount: number;

  status: DeductionStatus;

  date: string;

  createdBy: string;
}