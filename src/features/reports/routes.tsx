import type { RouteObject } from "react-router-dom";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { ReportCardsPage } from "@/features/reports/pages/ReportCardsPage";

export const reportsRoutes = [
  {
    path: "reports",
    children: [
      {
        index: true, 
        element: <ReportsPage />,
      },
      {
        path: "report-cards",
        element: <ReportCardsPage />,
      },
    ],
  },
] satisfies RouteObject[];