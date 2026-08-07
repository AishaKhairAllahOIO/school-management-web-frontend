export type AttendanceStatus = "Present" | "Absent";

export type AbsenceType = "Excused" | "Unexcused";

export interface StudentAttendance {
  id: string;
  studentId?: string;
  enrollmentId?: string;
  studentName: string;

  gradeId?: string;
  gradeName: string;

  classroomId?: string | null;
  classroomName?: string | null;

  date?: string;
  status?: AttendanceStatus;
  absenceType?: AbsenceType;
}

export interface StudentAttendanceHistoryRecord {
  id: string;
  studentId: string;
  enrollmentId?: string;
  date: string;
  status: AttendanceStatus;
  absenceType?: AbsenceType;
}
