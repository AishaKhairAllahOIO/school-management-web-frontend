import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";

export function AuthGuard() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
