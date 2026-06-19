import { FeesPage } from "@/features/finance/pages/FeesPage";
import { PaymentsPage } from "@/features/finance/pages/PaymentsPage";
import { InstallmentsPage } from "@/features/finance/pages/InstallmentsPage";
import { Navigate } from "react-router-dom";
import { SalariesPage } from "./salaries/pages/SalariesPage";
import { PayrollHistoryPage } from "./payroll-history/pages/PayrollHistoryPage";
import { DeductionsPage } from "./deductions/pages/DeductionsPage";

export const financeRoutes = {
  path: "finance",
  children: [
    {
      index: true,
      element: (
        <Navigate
          to="fees"
          replace
        />
      ),
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
      element: (
        <InstallmentsPage />
      ),
    },

    {
      path: "salaries",
      element: <SalariesPage />,
    },

    {
      path: "payroll-history",
      element: (
        <PayrollHistoryPage />
      ),
    },

    {
      path: "deductions",
      element: <DeductionsPage />,
    },
  ],
};