import { Navigate, useLocation } from "react-router-dom";

import { AuthFormShell } from "../components/AuthFormShell";
import { AuthLayout } from "../components/AuthLayout";
import { VerifyOtpForm } from "../components/VerifyOtpForm";
import { AUTH_ROUTES } from "../constants/auth.constants";

type VerifyOtpLocationState = {
  email?: string;
  isResetFlow?: boolean;
  remainingTime?: number;
};

export function VerifyOtpPage() {
  const location = useLocation();
  const state = location.state as VerifyOtpLocationState | null;

  if (!state?.email) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  return (
    <AuthLayout>
      <AuthFormShell
        title={
          state.isResetFlow
            ? "Verify reset code"
            : "Verify your account"
        }
        description={
          <>
            Enter the 6-digit verification code sent to{" "}
            <span className="font-semibold text-foreground">
              {state.email}
            </span>
            .
          </>
        }
      >
        <VerifyOtpForm
          email={state.email}
          isResetFlow={state.isResetFlow}
          initialRemainingTime={state.remainingTime}
        />
      </AuthFormShell>
    </AuthLayout>
  );
}
