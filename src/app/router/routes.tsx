import { Navigate } from "react-router-dom";

import { dashboardRoutes } from "@/features/dashboard/routes";
import { schedulingRoutes } from "@/features/scheduling/routes";

import { SchoolConfigPage } from "@/features/settings/school-config/pages/SchoolConfigPage";
import { ParentsPage } from "@/features/users/parents/pages/ParentsPage";
import { StudentsPage } from "@/features/users/students/pages/StudentsPage";
import { TeachersPage } from "@/features/users/teachers/pages/TeachersPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>

      <p className="mt-2 text-muted-foreground">
        This page content appears inside the dashboard container.
      </p>
    </div>
  );
}

export const appRoutes = [
  ...dashboardRoutes,

  {
    path: "users",
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentsPage /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "parents", element: <ParentsPage /> },
      { path: "secretaries", element: <PlaceholderPage title="Secretaries" /> },
      { path: "supervisors", element: <PlaceholderPage title="Supervisors" /> },
      { path: "counselors", element: <PlaceholderPage title="Counselors" /> },
      { path: "service-staff", element: <PlaceholderPage title="Service Staff" /> },
    ],
  },

  {
    path: "academics",
    children: [
      { index: true, element: <Navigate to="classes" replace /> },
      { path: "classes", element: <PlaceholderPage title="Classes" /> },
      { path: "subjects", element: <PlaceholderPage title="Subjects" /> },
      { path: "exams", element: <PlaceholderPage title="Exams" /> },
      { path: "grades", element: <PlaceholderPage title="Grades" /> },
      { path: "promotions", element: <PlaceholderPage title="Promotions" /> },
    ],
  },

  {
    path: "attendance",
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <PlaceholderPage title="Students Attendance" /> },
      { path: "staff", element: <PlaceholderPage title="Staff Attendance" /> },
    ],
  },

  schedulingRoutes,

  {
    path: "finance",
    children: [
      { index: true, element: <Navigate to="fees" replace /> },
      { path: "fees", element: <PlaceholderPage title="Fees" /> },
      { path: "payments", element: <PlaceholderPage title="Payments" /> },
      { path: "installments", element: <PlaceholderPage title="Installments" /> },
      { path: "salaries", element: <PlaceholderPage title="Salaries" /> },
      { path: "deductions", element: <PlaceholderPage title="Deductions" /> },
    ],
  },

  {
    path: "settings",
    children: [
      { index: true, element: <Navigate to="roles" replace /> },
      { path: "roles", element: <PlaceholderPage title="Roles" /> },
      { path: "permissions", element: <PlaceholderPage title="Permissions" /> },
      { path: "school-config", element: <SchoolConfigPage /> },
      { path: "system-config", element: <PlaceholderPage title="System Config" /> },
    ],
  },
];