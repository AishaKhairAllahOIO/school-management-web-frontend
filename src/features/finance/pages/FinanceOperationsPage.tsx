import { Navigate, Outlet } from "react-router-dom";

export const FinanceOperationsPage = () => <Outlet />;

export const FinanceIndexRedirect = () => <Navigate to="contracts" replace />;
