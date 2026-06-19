import type {
  SalaryProfile,
  PayrollRecord,
} from "../salaries/types/salary.types";

export const salaryProfilesMock: SalaryProfile[] = [
  {
    id: "SAL-001",

    employeeId: "EMP-001",

    employeeName: "Ahmad Ali",

    role: "Teacher",

    department: "Mathematics",

    salaryType: "Per Session",

    sessionRate: 60,

    expectedSessions: 80,

    baseSalary: 4800,

    active: true,
  },

  {
    id: "SAL-002",

    employeeId: "EMP-002",

    employeeName: "Sarah Hassan",

    role: "Supervisor",

    department: "Academic",

    salaryType: "Monthly",

    baseSalary: 4500,

    active: true,
  },

  {
    id: "SAL-003",

    employeeId: "EMP-003",

    employeeName: "Omar Khaled",

    role: "Secretary",

    department: "Administration",

    salaryType: "Monthly",

    baseSalary: 3500,

    active: true,
  },
];

export const payrollMock: PayrollRecord[] = [
  {
    id: "PAY-001",

    employeeId: "EMP-001",

    month: "May 2026",

    baseSalary: 4800,

    leaveDeduction: 100,

    attendanceDeduction: 50,

    manualDeduction: 0,

    netSalary: 4650,

    status: "Paid",

    paidDate: "2026-05-30",
  },

  {
    id: "PAY-002",

    employeeId: "EMP-002",

    month: "May 2026",

    baseSalary: 4500,

    leaveDeduction: 0,

    attendanceDeduction: 0,

    manualDeduction: 0,

    netSalary: 4500,

    status: "Pending",
  },
];