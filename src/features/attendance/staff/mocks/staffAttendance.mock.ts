import type { StaffAttendance } from "../types/staffAttendance.types";

export const staffAttendanceMock: StaffAttendance[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Ahmed Ali",
    role: "Teacher",
    date: "2026-06-15",
    status: "Present",
    requiredPeriods: 6,
    attendedPeriods: 5,
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Sara Omar",
    role: "Secretary",
    date: "2026-06-15",
    status: "Present",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Mohammad Hasan",
    role: "Supervisor",
    date: "2026-06-15",
    status: "Absent",
    absenceType: "Unexcused",
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Lina Khalil",
    role: "Counselor",
    date: "2026-06-15",
    status: "Present",
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Omar Saleh",
    role: "Service Staff",
    date: "2026-06-15",
    status: "Absent",
    absenceType: "Excused",
  },
];
