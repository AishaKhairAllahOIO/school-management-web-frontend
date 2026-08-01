import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { StaffAttendanceHistoryPage } from "@/features/attendance/staff/pages/StaffAttendanceHistoryPage";
import { StaffAttendancePage } from "@/features/attendance/staff/pages/StaffAttendancePage";
import { StudentAttendanceHistoryPage } from "@/features/attendance/students/pages/StudentAttendanceHistoryPage";
import { StudentAttendancePage } from "@/features/attendance/students/pages/StudentAttendancePage";

export const attendanceRoutes = [
  {
    path: "attendance",
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentAttendancePage /> },
      { path: "students/:studentId", element: <StudentAttendanceHistoryPage /> },
      { path: "staff", element: <StaffAttendancePage /> },
      { path: "staff/:employeeId", element: <StaffAttendanceHistoryPage /> },
      { path: "vacations", element: <Navigate to="../staff" replace /> },
    ],
  },
] satisfies RouteObject[];
