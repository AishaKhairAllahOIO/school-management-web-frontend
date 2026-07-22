import type {
  RouteObject,
} from "react-router-dom";

import {
  UsersOverviewPage,
} from "@/features/users/pages/UsersOverviewPage";

import {
  StudentsPage,
} from "@/features/users/students/pages/StudentsPage";

import {
  StudentRegistrationPage,
} from "@/features/users/students/pages/StudentRegistrationPage";

import {
  StudentImportPage,
} from "@/features/users/students/pages/StudentImportPage";

import {
  StudentProfilePage,
} from "@/features/users/students/pages/StudentProfilePage";

import {
  StudentEditPage,
} from "@/features/users/students/pages/StudentEditPage";

import {
  TeachersPage,
} from "@/features/users/teachers/pages/TeachersPage";

import {
  SupervisorsPage,
} from "@/features/users/supervisors/pages/SupervisorsPage";

import {
  SecretariesPage,
} from "@/features/users/secretaries/pages/SecretariesPage";

import {
  CounselorsPage,
} from "@/features/users/counselors/pages/CounselorsPage";

import {
  ServiceStaffPage,
} from "@/features/users/service-staff/pages/ServiceStaffPage";

export const usersRoutes = [
  {
    path: "users",

    children: [
      {
        index: true,
        element:
          <UsersOverviewPage />,
      },

    
      {
        path: "students",
        element:
          <StudentsPage />,
      },

      {
        path: "students/new",
        element:
          <StudentRegistrationPage />,
      },

      {
        path: "students/import",
        element:
          <StudentImportPage />,
      },

      {
        path: "students/:enrollmentId/edit",
        element:
          <StudentEditPage />,
      },

      {
        path: "students/:enrollmentId",
        element:
          <StudentProfilePage />,
      },

     
      {
        path: "teachers",
        element:
          <TeachersPage />,
      },

      {
        path: "supervisors",
        element:
          <SupervisorsPage />,
      },

      {
        path: "secretaries",
        element:
          <SecretariesPage />,
      },

      {
        path: "counselors",
        element:
          <CounselorsPage />,
      },

      {
        path: "service-staff",
        element:
          <ServiceStaffPage />,
      },
    ],
  },
] satisfies RouteObject[];