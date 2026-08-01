export type AttendanceStatus = "Present" | "Absent";

export type AbsenceType = "Excused" | "Unexcused";

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  advisorName: string;
  date: string;
  status: AttendanceStatus;
  absenceType?: AbsenceType;
}
