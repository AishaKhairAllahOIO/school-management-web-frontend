import type {
  PayrollHistory,
} from "../types/payrollHistory.types";

export const payrollHistoryMock: PayrollHistory[] = [
  {
    id: "PAY-001",

    employeeId: "EMP-001",

    employeeName: "Ahmad Ali",

    role: "Teacher",

    month: "May 2026",

    baseSalary: 4800,

    leaveDeduction: 100,

    attendanceDeduction: 50,

    manualDeduction: 0,

    bonus: 200,

    netSalary: 4850,

    status: "Paid",

    paidDate: "2026-05-31",
  },

  {
    id: "PAY-002",

    employeeId: "EMP-002",

    employeeName: "Sarah Hassan",

    role: "Supervisor",

    month: "May 2026",

    baseSalary: 4500,

    leaveDeduction: 0,

    attendanceDeduction: 0,

    manualDeduction: 0,

    bonus: 0,

    netSalary: 4500,

    status: "Pending",

    paidDate: "",
  },
];