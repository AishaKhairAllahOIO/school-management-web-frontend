import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AcademicSettingsPage } from "@/features/settings/academic/pages/AcademicSettingsPage";
import { GeneralSettingsPage } from "@/features/settings/general/pages/GeneralSettingsPage";
import { FinancialSettingsPage } from "@/features/settings/financial/pages/FinancialSettingsPage";
import { StudentAttendanceSettingsPage } from "@/features/settings/attendance/pages/StudentAttendanceSettingsPage";

export const settingsRoutes = [
  {
    path: "settings",
    children: [
      {
        index: true,
        element: <Navigate to="general" replace />,
      },
      {
        path: "general",
        element: <GeneralSettingsPage />,
      },
      {
        path: "academic",
        element: <AcademicSettingsPage />,
      },
      {
        path: "financial",
        element: <FinancialSettingsPage />
      },
      {
        path: "attendance",
        element: <StudentAttendanceSettingsPage />
      },
  
      
    ],
  },
] satisfies RouteObject[];