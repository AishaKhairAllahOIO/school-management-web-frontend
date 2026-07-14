import type { RouteObject } from "react-router-dom";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const dashboardRoutes = [
  {
    index: true,
    element: <DashboardPage />,
  },
] satisfies RouteObject[];