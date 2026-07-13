import { AuthFormShell } from "../components/AuthFormShell";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthFormShell
        title="Forgot your password?"
        description="Enter your email address and we will send you a verification code."
      >
        <ForgotPasswordForm />
      </AuthFormShell>
    </AuthLayout>
  );
}
