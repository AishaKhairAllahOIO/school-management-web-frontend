import { Navigate } from "react-router-dom";

import { StudentAttendancePage } from "@/features/attendance/students/pages/StudentAttendancePage";
import { StaffAttendancePage } from "@/features/attendance/staff/pages/StaffAttendancePage";
import { LeaveRequestsPage } from "@/features/attendance/Leave Requests/pages/LeaveRequestsPage";

export const attendanceRoutes = {
  path: "attendance",
  children: [
    { index: true, element: <Navigate to="students" replace /> },
    { path: "students", element: <StudentAttendancePage /> },
    { path: "staff", element: <StaffAttendancePage /> },
    { path: "vacations", element: <LeaveRequestsPage /> },
  ],
};