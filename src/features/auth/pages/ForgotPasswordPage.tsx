import { AuthBrandLogo } from "../components/AuthBrandLogo";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="rounded-[2.25rem] border border-border/75 bg-card/95 p-7 shadow-[0_18px_45px_rgba(31,25,78,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <AuthBrandLogo size="md" variant="dark" className="mx-auto mb-5" />

          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
            Enter your email and we will send you a reset code.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}