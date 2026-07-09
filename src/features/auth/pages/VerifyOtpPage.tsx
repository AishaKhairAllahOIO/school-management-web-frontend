import { Navigate, useLocation } from "react-router-dom";

import { AuthBrandLogo } from "../components/AuthBrandLogo";
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
      <div className="rounded-[2.25rem] border border-border/75 bg-card/95 p-7 shadow-[0_18px_45px_rgba(31,25,78,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <AuthBrandLogo size="md" variant="dark" className="mx-auto mb-5" />

          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Verify OTP
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-black text-foreground">{state.email}</span>.
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