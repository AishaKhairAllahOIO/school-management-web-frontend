import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { FinanceOperationsPage } from "./pages/FinanceOperationsPage";
import { StudentFinancialAccountsPage } from "./pages/StudentFinancialAccountsPage";
import { StudentFinancialProfilePage } from "./pages/StudentFinancialProfilePage";
import { StaffPayrollPage } from "./pages/StaffPayrollPage";

export const financeRoutes = [
  {
    path: "finance",
    element: <FinanceOperationsPage />,
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentFinancialAccountsPage /> },
      { path: "students/:studentId", element: <StudentFinancialProfilePage /> },
      { path: "payroll", element: <StaffPayrollPage /> },
      { path: "contracts", element: <Navigate to="/finance/students" replace /> },
      { path: "installments", element: <Navigate to="/finance/students" replace /> },
      { path: "payments", element: <Navigate to="/finance/students" replace /> },
    ],
  },
] satisfies RouteObject[];
