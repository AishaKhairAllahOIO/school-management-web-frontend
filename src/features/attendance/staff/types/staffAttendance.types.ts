export type StaffRole =
  | "Teacher"
  | "Secretary"
  | "Supervisor"
  | "Counselor"
  | "Service Staff";

export type StaffAttendanceStatus = "Present" | "Absent";
export type StaffAbsenceType = "Excused" | "Unexcused";

export interface StaffAttendance {
  id: string;
  employeeId: string;
  employeeName: string;
  role: StaffRole;
  date: string;
  status: StaffAttendanceStatus;
  absenceType?: StaffAbsenceType;
  requiredPeriods?: number;
  attendedPeriods?: number;
  notes?: string;
}
