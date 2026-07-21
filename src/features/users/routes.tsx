import type { RouteObject } from "react-router-dom";

import {
  BookOpen,
  BriefcaseBusiness,
  HeartHandshake,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { UsersOverviewPage } from "@/features/users/pages/UsersOverviewPage";
import { UserTypePlaceholderPage } from "@/features/users/pages/UserTypePlaceholderPage";

import { StudentsPage } from "@/features/users/students/pages/StudentsPage";
import { StudentRegistrationPage } from "@/features/users/students/pages/StudentRegistrationPage";
import { StudentImportPage } from "@/features/users/students/pages/StudentImportPage";
import { StudentProfilePage } from "@/features/users/students/pages/StudentProfilePage";
import { StudentEditPage } from "@/features/users/students/pages/StudentEditPage";

export const usersRoutes = [
  {
    path: "users",

    children: [
      {
        index: true,
        element: <UsersOverviewPage />,
      },

      /*
      |--------------------------------------------------------------------------
      | Students
      |--------------------------------------------------------------------------
      */

      {
        path: "students",
        element: <StudentsPage />,
      },

      {
        path: "students/new",
        element: <StudentRegistrationPage />,
      },

      /*
       * يجب وضع import قبل :enrollmentId
       * حتى لا يعتبر React Router كلمة import معرف طالب.
       */
      {
        path: "students/import",
        element: <StudentImportPage />,
      },

      /*
       * يجب وضع edit قبل صفحة البروفايل العامة.
       */
      {
        path: "students/:enrollmentId/edit",
        element: <StudentEditPage />,
      },

      {
        path: "students/:enrollmentId",
        element: <StudentProfilePage />,
      },

      /*
      |--------------------------------------------------------------------------
      | Teachers placeholder
      |--------------------------------------------------------------------------
      */

      {
        path: "teachers",
        element: (
          <UserTypePlaceholderPage
            title="Teachers"
            description="The teachers management page is not connected yet. It will include teacher records, school information, employment details, and account controls."
            icon={BookOpen}
          />
        ),
      },

      /*
      |--------------------------------------------------------------------------
      | Supervisors placeholder
      |--------------------------------------------------------------------------
      */

      {
        path: "supervisors",
        element: (
          <UserTypePlaceholderPage
            title="Supervisors"
            description="The supervisors page is currently under development. It will contain supervisor profiles, assignments, and school-related information."
            icon={ShieldCheck}
          />
        ),
      },

      /*
      |--------------------------------------------------------------------------
      | Secretaries placeholder
      |--------------------------------------------------------------------------
      */

      {
        path: "secretaries",
        element: (
          <UserTypePlaceholderPage
            title="Secretaries"
            description="The secretaries management page will be added later with personal, employment, and account information."
            icon={BriefcaseBusiness}
          />
        ),
      },

      /*
      |--------------------------------------------------------------------------
      | Counselors placeholder
      |--------------------------------------------------------------------------
      */

      {
        path: "counselors",
        element: (
          <UserTypePlaceholderPage
            title="Counselors"
            description="The counselors page is not available yet. It will include counselor profiles and their school responsibilities."
            icon={HeartHandshake}
          />
        ),
      },

      /*
      |--------------------------------------------------------------------------
      | Service staff placeholder
      |--------------------------------------------------------------------------
      */

      {
        path: "service-staff",
        element: (
          <UserTypePlaceholderPage
            title="Service Staff"
            description="The service staff page is currently a placeholder and will later include employee records, employment information, and account status."
            icon={UserCog}
          />
        ),
      },
    ],
  },
] satisfies RouteObject[];