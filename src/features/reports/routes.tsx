import type { RouteObject } from "react-router-dom";

import { ReportsPage } from "@/features/reports/pages/ReportsPage";

export const reportsRoutes = [
  {
    path: "reports",
    element: <ReportsPage />,
  },
] satisfies RouteObject[];