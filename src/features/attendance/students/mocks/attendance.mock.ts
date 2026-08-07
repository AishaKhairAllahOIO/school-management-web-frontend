import type {
  StudentAttendance,
  StudentAttendanceHistoryRecord,
} from "../types/attendance.types";

export const attendanceMock: StudentAttendance[] = [
  { id: "1", studentId: "STD001", studentName: "Ahmed Ali", gradeName: "Grade 7"},
  { id: "2", studentId: "STD002", studentName: "Sara Omar", gradeName: "Grade 7",   date: "2026-08-01", status: "Absent", absenceType: "Excused" },
  { id: "3", studentId: "STD003", studentName: "Mohammad Hasan", gradeName: "Grade 8", date: "2026-08-01", status: "Absent", absenceType: "Unexcused" },
  { id: "4", studentId: "STD004", studentName: "Ahmad Ali", gradeName: "Grade 9", date: "2026-08-01", status: "Present" },
  { id: "5", studentId: "STD005", studentName: "Sham Sharaf", gradeName: "Grade 9", date: "2026-08-01", status: "Absent", absenceType: "Unexcused" },
  { id: "6", studentId: "STD006", studentName: "Zaher Ali", gradeName: "Grade 9", date: "2026-08-01", status: "Absent", absenceType: "Excused" },
  { id: "7", studentId: "STD007", studentName: "Leen Kasem", gradeName: "Grade 8",  date: "2026-08-01", status: "Present" },
];

export const studentAttendanceHistoryMock: Record<string, StudentAttendanceHistoryRecord[]> = {
  STD001: [
    { id: "STD001-1", studentId: "STD001", date: "2026-07-28", status: "Present" },
    { id: "STD001-2", studentId: "STD001", date: "2026-07-29", status: "Absent", absenceType: "Excused" },
    { id: "STD001-3", studentId: "STD001", date: "2026-07-30", status: "Present" },
    { id: "STD001-4", studentId: "STD001", date: "2026-07-31", status: "Absent", absenceType: "Unexcused" },
    { id: "STD001-5", studentId: "STD001", date: "2026-08-01", status: "Present" },
  ],
};
