import { useLocation } from "react-router-dom";

import { AuthFormShell } from "../components/AuthFormShell";
import { AuthLayout } from "../components/AuthLayout";
import { VerifyOtpForm } from "../components/VerifyOtpForm";

type VerifyOtpLocationState = {
  email?: string;
  isResetFlow?: boolean;
};

export function VerifyOtpPage() {
  const location = useLocation();

  const state =
    location.state as VerifyOtpLocationState | null;

  const email = state?.email ?? "";

  return (
    <AuthLayout>
      <AuthFormShell
        title="Verify your account"
        description={
          <>
            Enter the 6-digit verification code sent to{" "}
            <span className="font-semibold text-foreground">
              {email}
            </span>
            .
          </>
        }
      >
        <VerifyOtpForm />
      </AuthFormShell>
    </AuthLayout>
  );
}