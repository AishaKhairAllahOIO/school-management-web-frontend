import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((module) => ({
    default: module.NotificationsPage,
  })),
);

function NotificationCenterRoute() {
  return (
    <Suspense
      fallback={
        <div className="h-[420px] animate-pulse rounded-[24px] border border-border/60 bg-card" />
      }
    >
      <NotificationsPage />
    </Suspense>
  );
}

export const notificationCenterRoutes = [
  {
    path: "view/notifications",
    element: <NotificationCenterRoute />,
  },
  {
    path: "view/notification",
    element: <Navigate to="/view/notifications" replace />,
  },
] satisfies RouteObject[];
