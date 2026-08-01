import type {
  StudentAttendance,
  StudentAttendanceHistoryRecord,
} from "../types/attendance.types";

export const attendanceMock: StudentAttendance[] = [
  { id: "1", studentId: "STD001", studentName: "Ahmed Ali", className: "Grade 7", section: "A", supervisorName: "Maya Hassan", date: "2026-08-01", status: "Present" },
  { id: "2", studentId: "STD002", studentName: "Sara Omar", className: "Grade 7", section: "A", supervisorName: "Maya Hassan", date: "2026-08-01", status: "Absent", absenceType: "Excused" },
  { id: "3", studentId: "STD003", studentName: "Mohammad Hasan", className: "Grade 8", section: "B", supervisorName: "Khaled Nasser", date: "2026-08-01", status: "Absent", absenceType: "Unexcused" },
  { id: "4", studentId: "STD004", studentName: "Ahmad Ali", className: "Grade 9", section: "B", supervisorName: "Rana Mahmoud", date: "2026-08-01", status: "Present" },
  { id: "5", studentId: "STD005", studentName: "Sham Sharaf", className: "Grade 9", section: "C", supervisorName: "Rana Mahmoud", date: "2026-08-01", status: "Absent", absenceType: "Unexcused" },
  { id: "6", studentId: "STD006", studentName: "Zaher Ali", className: "Grade 9", section: "A", supervisorName: "Rana Mahmoud", date: "2026-08-01", status: "Absent", absenceType: "Excused" },
  { id: "7", studentId: "STD007", studentName: "Leen Kasem", className: "Grade 8", section: "A", supervisorName: "Khaled Nasser", date: "2026-08-01", status: "Present" },
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
