import type {
  RouteObject,
} from "react-router-dom";

import {
  UsersOverviewPage,
} from "@/features/users/pages/UsersOverviewPage";

import { UsersRouteScrollRestoration } from "@/features/users/shared/components/UsersRouteScrollRestoration";

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

import {
  StaffRegistrationPage,
} from "@/features/users/staff/pages/StaffRegistrationPage";

import {
  StaffProfilePage,
} from "@/features/users/staff/pages/StaffProfilePage";

import {
  StaffEditPage,
} from "@/features/users/staff/pages/StaffEditPage";

import {
  StaffImportPage,
} from "@/features/users/staff/pages/StaffImportPage";

import {
  AdministratorsPage,
} from "@/features/users/administrators/pages/AdministratorsPage";

import {
  AdministratorProfilePage,
} from "@/features/users/administrators/pages/AdministratorProfilePage";

import {
  AdministratorEditPage,
} from "@/features/users/administrators/pages/AdministratorEditPage";

import {
  AdministratorRegistrationPage,
} from "@/features/users/administrators/pages/AdministratorRegistrationPage";

export const usersRoutes = [
  {
    path: "users",
    element: <UsersRouteScrollRestoration />,

    children: [
      {
        index: true,
        element: <UsersOverviewPage />,
      },


      {
        path: "administrators",
        element: <AdministratorsPage />,
      },

      {
        path: "administrators/new",
        element: <AdministratorRegistrationPage />,
      },

      {
        path: "administrators/:staffId/edit",
        element: <AdministratorEditPage />,
      },

      {
        path: "administrators/:staffId",
        element: <AdministratorProfilePage />,
      },

      {
        path: "students",
        element: <StudentsPage />,
      },

      {
        path: "students/new",
        element: <StudentRegistrationPage />,
      },

      {
        path: "students/import",
        element: <StudentImportPage />,
      },

      {
        path: "students/:enrollmentId/edit",
        element: <StudentEditPage />,
      },

      {
        path: "students/:enrollmentId",
        element: <StudentProfilePage />,
      },


      {
        path: "teachers",
        element: <TeachersPage />,
      },

      {
        path: "teachers/import",
        element: <StaffImportPage role="teacher" />,
      },

      {
        path: "teachers/new",
        element: (
          <StaffRegistrationPage role="teacher" />
        ),
      },

      {
        path: "teachers/:staffId/edit",
        element: (
          <StaffEditPage role="teacher" />
        ),
      },

      {
        path: "teachers/:staffId",
        element: (
          <StaffProfilePage role="teacher" />
        ),
      },

      {
        path: "supervisors",
        element: <SupervisorsPage />,
      },

      {
        path: "supervisors/import",
        element: <StaffImportPage role="adviser" />,
      },

      {
        path: "supervisors/new",
        element: (
          <StaffRegistrationPage role="adviser" />
        ),
      },

      {
        path: "supervisors/:staffId/edit",
        element: (
          <StaffEditPage role="adviser" />
        ),
      },

      {
        path: "supervisors/:staffId",
        element: (
          <StaffProfilePage role="adviser" />
        ),
      },

      {
        path: "secretaries",
        element: <SecretariesPage />,
      },

      {
        path: "secretaries/import",
        element: <StaffImportPage role="secretary" />,
      },

      {
        path: "secretaries/new",
        element: (
          <StaffRegistrationPage role="secretary" />
        ),
      },

      {
        path: "secretaries/:staffId/edit",
        element: (
          <StaffEditPage role="secretary" />
        ),
      },

      {
        path: "secretaries/:staffId",
        element: (
          <StaffProfilePage role="secretary" />
        ),
      },

      {
        path: "counselors",
        element: <CounselorsPage />,
      },

      {
        path: "counselors/import",
        element: <StaffImportPage role="counselor" />,
      },

      {
        path: "counselors/new",
        element: (
          <StaffRegistrationPage role="counselor" />
        ),
      },

      {
        path: "counselors/:staffId/edit",
        element: (
          <StaffEditPage role="counselor" />
        ),
      },

      {
        path: "counselors/:staffId",
        element: (
          <StaffProfilePage role="counselor" />
        ),
      },

      {
        path: "service-staff",
        element: <ServiceStaffPage />,
      },

      {
        path: "service-staff/import",
        element: <StaffImportPage role="service_staff" />,
      },

      {
        path: "service-staff/new",
        element: (
          <StaffRegistrationPage role="service_staff" />
        ),
      },

      {
        path: "service-staff/:staffId/edit",
        element: (
          <StaffEditPage role="service_staff" />
        ),
      },

      {
        path: "service-staff/:staffId",
        element: (
          <StaffProfilePage role="service_staff" />
        ),
      },
    ],
  },
] satisfies RouteObject[];