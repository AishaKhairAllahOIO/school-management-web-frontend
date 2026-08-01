import type {
  StaffAttendance,
  StaffAttendanceHistoryRecord,
} from "../types/staffAttendance.types";

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

export const staffAttendanceHistoryMock: Record<
  string,
  StaffAttendanceHistoryRecord[]
> = {
  EMP001: [
    {
      id: "EMP001-1",
      employeeId: "EMP001",
      date: "2026-06-15",
      status: "Present",
      requiredPeriods: 6,
      attendedPeriods: 5,
    },
    {
      id: "EMP001-2",
      employeeId: "EMP001",
      date: "2026-06-14",
      status: "Present",
      requiredPeriods: 4,
      attendedPeriods: 4,
    },
    {
      id: "EMP001-3",
      employeeId: "EMP001",
      date: "2026-06-13",
      status: "Absent",
      absenceType: "Excused",
      requiredPeriods: 5,
      attendedPeriods: 0,
    },
  ],
  EMP002: [
    {
      id: "EMP002-1",
      employeeId: "EMP002",
      date: "2026-06-15",
      status: "Present",
    },
    {
      id: "EMP002-2",
      employeeId: "EMP002",
      date: "2026-06-14",
      status: "Absent",
      absenceType: "Excused",
    },
  ],
  EMP003: [
    {
      id: "EMP003-1",
      employeeId: "EMP003",
      date: "2026-06-15",
      status: "Absent",
      absenceType: "Unexcused",
    },
    {
      id: "EMP003-2",
      employeeId: "EMP003",
      date: "2026-06-14",
      status: "Present",
    },
  ],
  EMP004: [
    {
      id: "EMP004-1",
      employeeId: "EMP004",
      date: "2026-06-15",
      status: "Present",
    },
  ],
  EMP005: [
    {
      id: "EMP005-1",
      employeeId: "EMP005",
      date: "2026-06-15",
      status: "Absent",
      absenceType: "Excused",
    },
  ],
};
