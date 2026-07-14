import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { LeaveRequestsPage } from "@/features/attendance/Leave Requests/pages/LeaveRequestsPage";
import { StaffAttendancePage } from "@/features/attendance/staff/pages/StaffAttendancePage";
import { StudentAttendancePage } from "@/features/attendance/students/pages/StudentAttendancePage";

export const attendanceRoutes = [
  {
    path: "attendance",
    children: [
      {
        index: true,
        element: <Navigate to="students" replace />,
      },
      {
        path: "students",
        element: <StudentAttendancePage />,
      },
      {
        path: "staff",
        element: <StaffAttendancePage />,
      },
      {
        path: "vacations",
        element: <LeaveRequestsPage />,
      },
    ],
  },
] satisfies RouteObject[];