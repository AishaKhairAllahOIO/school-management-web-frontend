import type {
  StaffAttendance,
} from "../types/staffAttendance.types";

export const staffAttendanceMock: StaffAttendance[] =
[
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Ahmed Ali",
    role: "Teacher",
    date: "2026-06-15",
    status: "Present",
    checkIn: "07:55",
    checkOut: "14:00",
  },

  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Sara Omar",
    role: "Secretary",
    date: "2026-06-15",
    status: "Late",
    checkIn: "08:25",
    checkOut: "14:00",
  },

  {
    id: "3",
    employeeId: "EMP003",
    employeeName:
      "Mohammad Hasan",
    role: "Supervisor",
    date: "2026-06-15",
    status: "Absent",
    absenceType:
      "Unexcused",
  },
];