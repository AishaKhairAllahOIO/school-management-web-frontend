import { Navigate, useLocation } from "react-router-dom";

import { AuthBrandLogo } from "../components/AuthBrandLogo";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { AUTH_ROUTES } from "../constants/auth.constants";
import type { ResetPasswordRouteState } from "../types/auth.types";

export function ResetPasswordPage() {
  const location = useLocation();
  const state = location.state as ResetPasswordRouteState | null;

  if (!state?.email || !state?.tempToken) {
    return <Navigate to={AUTH_ROUTES.FORGOT_PASSWORD} replace />;
  }

  return (
    <AuthLayout>
      <div className="rounded-[2.25rem] border border-border/75 bg-card/95 p-7 shadow-[0_18px_45px_rgba(31,25,78,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <AuthBrandLogo size="md" variant="dark" className="mx-auto mb-5" />

          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Reset Password
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
            Create a strong new password for your account.
          </p>
        </div>

        <ResetPasswordForm email={state.email} tempToken={state.tempToken} />
      </div>
    </AuthLayout>
  );
}