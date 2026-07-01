import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";

export function GuestGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
