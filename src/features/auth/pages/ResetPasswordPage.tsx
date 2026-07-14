import { Navigate, useLocation } from "react-router-dom";

import { AuthFormShell } from "../components/AuthFormShell";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { AUTH_ROUTES } from "../constants/auth.constants";

type ResetPasswordLocationState = {
  email?: string;
  tempToken?: string;
};

export function ResetPasswordPage() {
  const location = useLocation();
  const state = location.state as ResetPasswordLocationState | null;

  if (!state?.email || !state.tempToken) {
    return <Navigate to={AUTH_ROUTES.FORGOT_PASSWORD} replace />;
  }

  return (
    <AuthLayout>
      <AuthFormShell
        title="Create a new password"
        description="Choose a strong password that you have not used before."
      >
        <ResetPasswordForm
          email={state.email}
          tempToken={state.tempToken}
        />
      </AuthFormShell>
    </AuthLayout>
  );
}
