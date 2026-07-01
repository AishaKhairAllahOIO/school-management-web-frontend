import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";

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

  function onSubmit(values: ResetPasswordSchema) {
    resetPasswordMutation.mutate({
      email,
      tempToken,
      password: values.password,
      password_confirmation: values.passwordConfirmation,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="font-black text-[#17142F]">
          New Password
        </Label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-violet-50 text-primary">
            <LockKeyhole className="h-4 w-4" />
          </div>

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-14 pr-14 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-[#6D5FDB]/25"
            {...form.register("password")}
          />

          <button
            type="button"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {form.formState.errors.password && (
          <p className="text-xs font-bold text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="passwordConfirmation"
          className="font-black text-[#17142F]"
        >
          Confirm Password
        </Label>

        <Input
          id="passwordConfirmation"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat your new password"
          className="h-14 rounded-2xl border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-[#6D5FDB]/25"
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
        {resetPasswordMutation.isPending
          ? "Resetting password..."
          : "Reset Password"}
      </Button>
    </form>
  );
}