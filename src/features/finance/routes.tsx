import { FeesPage } from "@/features/finance/pages/FeesPage";
import { PaymentsPage } from "@/features/finance/pages/PaymentsPage";
import { InstallmentsPage } from "@/features/finance/pages/InstallmentsPage";

export const financeRoutes = {
  path: "finance",
  children: [
    { index: true, element: <FeesPage /> },
    { path: "fees", element: <FeesPage /> },
    { path: "payments", element: <PaymentsPage /> },
    { path: "installments", element: <InstallmentsPage /> },
    { path: "salaries", element: <FeesPage /> },
    { path: "deductions", element: <FeesPage /> },
  ],
};