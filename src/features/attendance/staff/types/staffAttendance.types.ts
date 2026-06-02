export interface StaffAttendance {
  id: string;

  employeeId: string;

  employeeName: string;

  role:
    | "Teacher"
    | "Secretary"
    | "Supervisor"
    | "Counselor";

  date: string;

  status:
    | "Present"
    | "Late"
    | "Absent";

  checkIn?: string;

  checkOut?: string;

  absenceType?:
    | "Excused"
    | "Unexcused";

  notes?: string;
}