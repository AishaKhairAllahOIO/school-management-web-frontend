import { Navigate } from "react-router-dom";

import { StudentsPage } from "@/features/users/students/pages/StudentsPage";
import { TeachersPage } from "@/features/users/teachers/pages/TeachersPage";
import { ParentsPage } from "@/features/users/parents/pages/ParentsPage";

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

export const usersRoutes = {
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
};