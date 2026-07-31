import type { RouteObject } from "react-router-dom";
import { FinanceOperationsPage } from "./pages/FinanceOperationsPage";
export const financeRoutes = [
  { path: "finance", element: <FinanceOperationsPage /> },
  { path: "finance/contracts", element: <FinanceOperationsPage /> },
  { path: "finance/installments", element: <FinanceOperationsPage /> },
  { path: "finance/payments", element: <FinanceOperationsPage /> },
] satisfies RouteObject[];
