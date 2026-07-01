import { Navigate, useLocation } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

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
      <div className="rounded-[2.5rem] border border-white/80 bg-white/95 p-7 shadow-[0_34px_100px_rgba(48,36,120,0.16)] backdrop-blur-2xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-primary">
            <LockKeyhole className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#15132E]">
            Reset Password
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Create a strong new password for your account.
          </p>
        </div>

        <ResetPasswordForm email={state.email} tempToken={state.tempToken} />
      </div>
    </AuthLayout>
  );
}