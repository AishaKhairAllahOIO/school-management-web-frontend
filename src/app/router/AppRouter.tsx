import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>

      <p className="mt-2 text-muted-foreground">
        This page content appears inside the dashboard container.
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <PlaceholderPage title="Dashboard" />,
      },
      {
        path: "users",
        element: <PlaceholderPage title="Users" />,
      },
      {
        path: "academics",
        element: <PlaceholderPage title="Academic" />,
      },
      {
        path: "attendance",
        element: <PlaceholderPage title="Attendance" />,
      },
      {
        path: "scheduling",
        element: <PlaceholderPage title="Scheduling" />,
      },
      {
        path: "finance",
        element: <PlaceholderPage title="Finance" />,
      },
      {
        path: "reports",
        element: <PlaceholderPage title="Reports" />,
      },
      {
        path: "settings",
        element: <PlaceholderPage title="Settings" />,
      },
      {
        path: "logout",
        element: <PlaceholderPage title="Logout" />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}