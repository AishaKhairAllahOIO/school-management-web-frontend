import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

import { TeachersPage } from "@/features/users/teachers/pages/TeachersPage";

import { SchoolConfigPage } from "@/features/settings/school-config/pages/SchoolConfigPage";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div
      className="
        rounded-3xl
        bg-card
        p-8
        shadow-soft
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          text-foreground
        "
      >
        {title}
      </h1>

      <p
        className="
          mt-2
          text-muted-foreground
        "
      >
        This page content appears
        inside the dashboard container.
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate
        to="/login"
        replace
      />
    ),
  },

  // ================= AUTH =================
  {
    element: <AuthLayout />,

    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },

      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },

      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },

      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  // ================= DASHBOARD =================
  {
    path: "/",

    element: <DashboardLayout />,

    children: [
      {
        index: true,
        element: (
          <PlaceholderPage title="Dashboard" />
        ),
      },

      // ================= USERS =================
      {
        path: "users",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="students"
                replace
              />
            ),
          },

          {
            path: "students",
            element: (
              <PlaceholderPage title="Students" />
            ),
          },

          {
            path: "teachers",
            element: <TeachersPage />,
          },

          {
            path: "parents",
            element: (
              <PlaceholderPage title="Parents" />
            ),
          },

          {
            path: "secretaries",
            element: (
              <PlaceholderPage title="Secretaries" />
            ),
          },

          {
            path: "supervisors",
            element: (
              <PlaceholderPage title="Supervisors" />
            ),
          },

          {
            path: "counselors",
            element: (
              <PlaceholderPage title="Counselors" />
            ),
          },

          {
            path: "service-staff",
            element: (
              <PlaceholderPage title="Service Staff" />
            ),
          },
        ],
      },

      // ================= ACADEMICS =================
      {
        path: "academics",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="classes"
                replace
              />
            ),
          },

          {
            path: "classes",
            element: (
              <PlaceholderPage title="Classes" />
            ),
          },

          {
            path: "sections",
            element: (
              <PlaceholderPage title="Sections" />
            ),
          },

          {
            path: "subjects",
            element: (
              <PlaceholderPage title="Subjects" />
            ),
          },

          {
            path: "exams",
            element: (
              <PlaceholderPage title="Exams" />
            ),
          },

          {
            path: "grades",
            element: (
              <PlaceholderPage title="Grades" />
            ),
          },

          {
            path: "promotions",
            element: (
              <PlaceholderPage title="Promotions" />
            ),
          },
        ],
      },

      // ================= ATTENDANCE =================
      {
        path: "attendance",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="students"
                replace
              />
            ),
          },

          {
            path: "students",
            element: (
              <PlaceholderPage title="Students Attendance" />
            ),
          },

          {
            path: "staff",
            element: (
              <PlaceholderPage title="Staff Attendance" />
            ),
          },
        ],
      },

      // ================= SCHEDULING =================
      {
        path: "scheduling",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="classes"
                replace
              />
            ),
          },

          {
            path: "classes",
            element: (
              <PlaceholderPage title="Class Schedules" />
            ),
          },

          {
            path: "teachers",
            element: (
              <PlaceholderPage title="Teacher Schedules" />
            ),
          },

          {
            path: "exams",
            element: (
              <PlaceholderPage title="Exam Schedules" />
            ),
          },

          {
            path: "holidays",
            element: (
              <PlaceholderPage title="Holidays" />
            ),
          },
        ],
      },

      // ================= FINANCE =================
      {
        path: "finance",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="fees"
                replace
              />
            ),
          },

          {
            path: "fees",
            element: (
              <PlaceholderPage title="Fees" />
            ),
          },

          {
            path: "payments",
            element: (
              <PlaceholderPage title="Payments" />
            ),
          },

          {
            path: "installments",
            element: (
              <PlaceholderPage title="Installments" />
            ),
          },

          {
            path: "salaries",
            element: (
              <PlaceholderPage title="Salaries" />
            ),
          },

          {
            path: "deductions",
            element: (
              <PlaceholderPage title="Deductions" />
            ),
          },
        ],
      },

      // ================= COMMUNICATION =================
      {
        path: "communication",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="announcements"
                replace
              />
            ),
          },

          {
            path: "announcements",
            element: (
              <PlaceholderPage title="Announcements" />
            ),
          },

          {
            path: "notifications",
            element: (
              <PlaceholderPage title="Notifications" />
            ),
          },

          {
            path: "complaints",
            element: (
              <PlaceholderPage title="Complaints" />
            ),
          },

          {
            path: "activities",
            element: (
              <PlaceholderPage title="Activities" />
            ),
          },
        ],
      },

      // ================= REPORTS =================
      {
        path: "reports",
        element: (
          <PlaceholderPage title="Reports" />
        ),
      },

      // ================= SETTINGS =================
      {
        path: "settings",

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="roles"
                replace
              />
            ),
          },

          {
            path: "roles",
            element: (
              <PlaceholderPage title="Roles" />
            ),
          },

          {
            path: "permissions",
            element: (
              <PlaceholderPage title="Permissions" />
            ),
          },

          {
            path: "school-config",
            element: <SchoolConfigPage />,
          },

          {
            path: "system-config",
            element: (
              <PlaceholderPage title="System Config" />
            ),
          },
        ],
      },

      // ================= LOGOUT =================
      {
        path: "logout",
        element: (
          <PlaceholderPage title="Logout" />
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <RouterProvider router={router} />
  );
}