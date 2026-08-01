export type AttendanceStatus = "Present" | "Absent";

export type AbsenceType = "Excused" | "Unexcused";

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  supervisorName: string;
  date: string;
  status: AttendanceStatus;
  absenceType?: AbsenceType;
}

export interface StudentAttendanceHistoryRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  absenceType?: AbsenceType;
}
