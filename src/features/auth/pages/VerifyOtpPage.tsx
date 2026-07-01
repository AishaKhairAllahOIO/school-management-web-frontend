import { Navigate, useLocation } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

import { AuthLayout } from "../components/AuthLayout";
import { VerifyOtpForm } from "../components/VerifyOtpForm";
import { AUTH_ROUTES } from "../constants/auth.constants";
import type {
  LoginOtpRouteState,
  ResetOtpRouteState,
} from "../types/auth.types";

export function VerifyOtpPage() {
  const location = useLocation();

  const state = location.state as LoginOtpRouteState | ResetOtpRouteState | null;

  if (!state?.email) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  return (
    <AuthLayout>
      <div className="rounded-[2.5rem] border border-white/80 bg-white/95 p-7 shadow-[0_34px_100px_rgba(48,36,120,0.16)] backdrop-blur-2xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-primary">
            <BadgeCheck className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#15132E]">
            Verify OTP
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Enter the 6-digit code sent to{" "}
            <span className="font-black text-[#15132E]">{state.email}</span>.
          </p>
        </div>

        <VerifyOtpForm
          email={state.email}
          isResetFlow={Boolean(state.isResetFlow)}
          initialRemainingTime={(state as ResetOtpRouteState).remainingTime}
        />
      </div>
    </AuthLayout>
  );
}