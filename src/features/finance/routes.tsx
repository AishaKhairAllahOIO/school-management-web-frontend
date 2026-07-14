import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { DeductionsPage } from "@/features/finance/deductions/pages/DeductionsPage";
import { InstallmentsPage } from "@/features/finance/pages/InstallmentsPage";
import { FeesPage } from "@/features/finance/pages/FeesPage";
import { PaymentsPage } from "@/features/finance/pages/PaymentsPage";
import { PayrollHistoryPage } from "@/features/finance/payroll-history/pages/PayrollHistoryPage";
import { SalariesPage } from "@/features/finance/salaries/pages/SalariesPage";

export const financeRoutes = [
  {
    path: "finance",
    children: [
      {
        index: true,
        element: <Navigate to="fees" replace />,
      },
      {
        path: "fees",
        element: <FeesPage />,
      },
      {
        path: "payments",
        element: <PaymentsPage />,
      },
      {
        path: "installments",
        element: <InstallmentsPage />,
      },
      {
        path: "salaries",
        element: <SalariesPage />,
      },
      {
        path: "payroll-history",
        element: <PayrollHistoryPage />,
      },
      {
        path: "deductions",
        element: <DeductionsPage />,
      },
    ],
  },
] satisfies RouteObject[];