import { KeyRound } from "lucide-react";

import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="rounded-[2.5rem] border border-white/80 bg-white/95 p-7 shadow-[0_34px_100px_rgba(48,36,120,0.16)] backdrop-blur-2xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-primary">
            <KeyRound className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#15132E]">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Enter your email and we will send you a reset code.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}