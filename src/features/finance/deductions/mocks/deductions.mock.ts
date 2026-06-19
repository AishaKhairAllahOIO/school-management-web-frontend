import type {
  Deduction,
} from "../types/deduction.types";

export const deductionsMock: Deduction[] = [
  {
    id: "DED-001",

    employeeId: "EMP-001",

    employeeName: "Ahmad Ali",

    role: "Teacher",

    type: "Leave Deduction",

    reason:
      "Exceeded annual leave allowance",

    amount: 250,

    status: "Applied",

    date: "2026-05-18",

    createdBy: "Administrator",
  },

  {
    id: "DED-002",

    employeeId: "EMP-002",

    employeeName: "Sarah Hassan",

    role: "Supervisor",

    type: "Attendance Deduction",

    reason:
      "Late attendance violations",

    amount: 100,

    status: "Pending",

    date: "2026-05-20",

    createdBy: "HR Manager",
  },
];