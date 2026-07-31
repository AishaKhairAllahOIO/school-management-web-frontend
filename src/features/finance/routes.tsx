import type { RouteObject } from "react-router-dom";
import { FinanceIndexRedirect, FinanceOperationsPage } from "./pages/FinanceOperationsPage";
import { FinancialContractsPage } from "./pages/FinancialContractsPage";
import { StudentInstallmentsPage } from "./pages/StudentInstallmentsPage";
import { StudentPaymentsPage } from "./pages/StudentPaymentsPage";

export const financeRoutes = [
  {
    path: "finance",
    element: <FinanceOperationsPage />,
    children: [
      { index: true, element: <FinanceIndexRedirect /> },
      { path: "contracts", element: <FinancialContractsPage /> },
      { path: "installments", element: <StudentInstallmentsPage /> },
      { path: "payments", element: <StudentPaymentsPage /> },
    ],
  },
] satisfies RouteObject[];
