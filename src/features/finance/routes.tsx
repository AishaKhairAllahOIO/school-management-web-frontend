import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { FinanceOperationsPage } from "./pages/FinanceOperationsPage";
import { FinancialContractsPage } from "./pages/FinancialContractsPage";
import { StudentInstallmentsPage } from "./pages/StudentInstallmentsPage";
import { StudentPaymentsPage } from "./pages/StudentPaymentsPage";
import { StaffPayrollPage } from "./pages/StaffPayrollPage";

export const financeRoutes = [
  {
    path: "finance",
    element: <FinanceOperationsPage />,
    children: [
      {
        index: true,
        element: <Navigate to="contracts" replace />,
      },
      {
        path: "contracts",
        element: <FinancialContractsPage />,
      },
      {
        path: "installments",
        element: <StudentInstallmentsPage />,
      },
      {
        path: "payments",
        element: <StudentPaymentsPage />,
      },
      {
        path: "payroll",
        element: <StaffPayrollPage />,
      },
    ],
  },
] satisfies RouteObject[];
