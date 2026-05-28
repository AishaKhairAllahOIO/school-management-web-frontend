import { Navigate } from "react-router-dom";

import { dashboardRoutes } from "@/features/dashboard/routes";
import { SchoolConfigPage } from "@/features/settings/school-config/pages/SchoolConfigPage";
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
      { path: "students", element: <PlaceholderPage title="Students" /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "parents", element: <PlaceholderPage title="Parents" /> },
      { path: "secretaries", element: <PlaceholderPage title="Secretaries" /> },
      { path: "supervisors", element: <PlaceholderPage title="Supervisors" /> },
      { path: "counselors", element: <PlaceholderPage title="Counselors" /> },
      { path: "service-staff", element: <PlaceholderPage title="Service Staff" /> },
    ],
  },

  {
    path: "settings",
    children: [
      { index: true, element: <Navigate to="roles" replace /> },
      { path: "roles", element: <PlaceholderPage title="Roles" /> },
      { path: "permissions", element: <PlaceholderPage title="Permissions" /> },
      { path: "school-config", element: <SchoolConfigPage /> },
    ],
  },
];