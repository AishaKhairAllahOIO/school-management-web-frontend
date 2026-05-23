 import { Navigate } from "react-router-dom";

import { useAuthStore }
from "@/features/auth/store/auth.store";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}