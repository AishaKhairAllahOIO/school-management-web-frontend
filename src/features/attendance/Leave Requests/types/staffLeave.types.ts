export type LeaveType =
  | "Annual Leave"
  | "Sick Leave"
  | "Emergency Leave"
  | "Maternity Leave"
  | "Unpaid Leave";

export type LeaveStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

export interface LeaveRequest {
  id: string;

  employeeId: string;
  employeeName: string;

  role: string;
  department: string;

  leaveType: LeaveType;

  startDate: string;
  endDate: string;

  status: LeaveStatus;

  reason?: string;

  approvedBy?: string;

  createdAt: string;
}