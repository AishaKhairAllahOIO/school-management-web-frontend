import type { RouteObject } from "react-router-dom";
import {FinanceOperationsPage} from "./pages/FinanceOperationsPage";  

export const financeRoutes = [
  {
    path: "finance",
    element: <FinanceOperationsPage />,
  },
] satisfies RouteObject[];