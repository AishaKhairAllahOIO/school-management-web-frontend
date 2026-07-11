import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";
import { getAxiosValidationErrors } from "@/services/axios/axiosError";

type ResetPasswordFormProps = {
  email: string;
  tempToken: string;
};

export function ResetPasswordForm({
  email,
  tempToken,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const password = form.watch("password");

  const strength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  }, [password]);

 function onSubmit(values: ResetPasswordSchema) {
  form.clearErrors();

  resetPasswordMutation.mutate(
    {
      email,
      tempToken,
      password: values.password,
      password_confirmation: values.passwordConfirmation,
    },
    {
      onError: (error) => {
        const validationErrors = getAxiosValidationErrors(error);

        const passwordMessage = validationErrors.password?.[0];
        const passwordConfirmationMessage =
          validationErrors.password_confirmation?.[0];

        if (passwordMessage) {
          form.setError("password", {
            type: "server",
            message: passwordMessage,
          });
        }

        if (passwordConfirmationMessage) {
          form.setError("passwordConfirmation", {
            type: "server",
            message: passwordConfirmationMessage,
          });
        }
      },
    },
  );
}

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-black text-[#17142F]">
          New Password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter new password"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-12 pr-12 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-primary/20"
            {...form.register("password")}
          />

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={[
                "h-1.5 rounded-full transition",
                password && index < strength ? "bg-emerald-500" : "bg-slate-200",
              ].join(" ")}
            />
          ))}
        </div>

        {password && (
          <p className="text-xs font-bold text-slate-500">
            Password strength:{" "}
            <span
              className={
                strength >= 4
                  ? "text-emerald-600"
                  : strength >= 3
                    ? "text-amber-600"
                    : "text-destructive"
              }
            >
              {strength >= 4 ? "Strong" : strength >= 3 ? "Medium" : "Weak"}
            </span>
          </p>
        )}

        {form.formState.errors.password && (
          <p className="text-xs font-bold text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="passwordConfirmation"
          className="text-sm font-black text-[#17142F]"
        >
          Confirm Password
        </label>

        <Input
          id="passwordConfirmation"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm new password"
          className="h-14 rounded-2xl border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-primary/20"
          {...form.register("passwordConfirmation")}
        />

        {form.formState.errors.passwordConfirmation && (
          <p className="text-xs font-bold text-destructive">
            {form.formState.errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-14 w-full rounded-2xl primary-gradient text-base font-black text-white shadow-[0_20px_42px_rgba(103,58,244,0.28)]"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}