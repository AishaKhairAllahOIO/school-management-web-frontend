import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { FinanceOperationsPage } from "./student/pages/FinanceOperationsPage";
import { StudentFinancialAccountsPage } from "./student/pages/StudentFinancialAccountsPage";
import { StudentFinancialProfilePage } from "./student/pages/StudentFinancialProfilePage";
import { StaffPayrollPage } from "./staff/pages/StaffPayrollPage";
import { StaffPayrollProfilePage } from "./staff/pages/StaffPayrollProfilePage";

export const financeRoutes = [
  {
    path: "finance",
    element: <FinanceOperationsPage />,
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentFinancialAccountsPage /> },
      { path: "students/:studentId", element: <StudentFinancialProfilePage /> },
      { path: "staff", element: <StaffPayrollPage /> },
      { path: "staff/:staffId", element: <StaffPayrollProfilePage /> },
      { path: "payroll", element: <Navigate to="/finance/staff" replace /> },
      {
        path: "contracts",
        element: <Navigate to="/finance/students" replace />,
      },
      {
        path: "installments",
        element: <Navigate to="/finance/students" replace />,
      },
      {
        path: "payments",
        element: <Navigate to="/finance/students" replace />,
      },
    ],
  },
] satisfies RouteObject[];
