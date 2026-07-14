import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { CounselorsPage } from "@/features/users/counselors/pages/CounselorsPage";
import { SecretariesPage } from "@/features/users/secretaries/pages/SecretariesPage";
import { ServiceStaffPage } from "@/features/users/service-staff/pages/ServiceStaffPage";
import { StudentsPage } from "@/features/users/students/pages/StudentsPage";
import { SupervisorsPage } from "@/features/users/supervisors/pages/SupervisorsPage";
import { TeachersPage } from "@/features/users/teachers/pages/TeachersPage";

export const usersRoutes = [
  {
    path: "users",
    children: [
      {
        index: true,
        element: <Navigate to="students" replace />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "teachers",
        element: <TeachersPage />,
      },
      {
        path: "secretaries",
        element: <SecretariesPage />,
      },
      {
        path: "supervisors",
        element: <SupervisorsPage />,
      },
      {
        path: "counselors",
        element: <CounselorsPage />,
      },
      {
        path: "service-staff",
        element: <ServiceStaffPage />,
      },
    ],
  },
] satisfies RouteObject[];