import type {
  LeaveRequest,
} from "../types/staffLeave.types";

export const leaveRequestsMock:
LeaveRequest[] = [
  {
    id: "1",

    employeeId: "EMP001",

    employeeName:
      "Ahmed Ali",

    role:
      "Teacher",

    department:
      "Science",

    leaveType:
      "Annual Leave",

    startDate:
      "2026-06-10",

    endDate:
      "2026-06-15",

    status:
      "Approved",

    approvedBy:
      "Sarah Johnson",

    reason:
      "Family vacation",

    createdAt:
      "2026-06-01",
  },

  {
    id: "2",

    employeeId: "EMP002",

    employeeName:
      "Sara Omar",

    role:
      "Secretary",

    department:
      "Administration",

    leaveType:
      "Sick Leave",

    startDate:
      "2026-06-20",

    endDate:
      "2026-06-22",

    status:
      "Pending",

    reason:
      "Medical leave",

    createdAt:
      "2026-06-18",
  },

  {
    id: "3",

    employeeId: "EMP003",

    employeeName:
      "Mohammad Hasan",

    role:
      "Supervisor",

    department:
      "Academic",

    leaveType:
      "Emergency Leave",

    startDate:
      "2026-06-25",

    endDate:
      "2026-06-27",

    status:
      "Rejected",

    approvedBy:
      "Sarah Johnson",

    reason:
      "Personal issue",

    createdAt:
      "2026-06-20",
  },
];