export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late";

export type AbsenceType =
  | "Excused"
  | "Unexcused";

export interface StudentAttendance {
  id: string;

  studentId: string;

  studentName: string;

  className: string;

  section: string;

  date: string;

  status: AttendanceStatus;

  absenceType?: AbsenceType;
}