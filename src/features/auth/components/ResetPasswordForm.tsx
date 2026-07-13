import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { getAxiosValidationErrors } from "@/services/axios/axiosError";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
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
          const confirmationMessage =
            validationErrors.password_confirmation?.[0];

          if (passwordMessage) {
            form.setError("password", {
              type: "server",
              message: passwordMessage,
            });
          }

          if (confirmationMessage) {
            form.setError("passwordConfirmation", {
              type: "server",
              message: confirmationMessage,
            });
          }
        },
      },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-foreground"
        >
          New password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your new password"
            className="h-14 rounded-xl border-input bg-background pl-12 pr-12 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={[
                "h-1.5 rounded-full transition",
                index < strength ? "bg-primary" : "bg-muted",
              ].join(" ")}
            />
          ))}
        </div>

        {password && (
          <p className="text-xs text-muted-foreground">
            Password strength:{" "}
            <span className="font-semibold text-foreground">
              {strength >= 4
                ? "Strong"
                : strength >= 3
                  ? "Medium"
                  : "Weak"}
            </span>
          </p>
        )}

        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-foreground"
        >
          Confirm password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="confirm-password"
            type={showConfirmation ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            className="h-14 rounded-xl border-input bg-background pl-12 pr-12 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register("passwordConfirmation")}
          />

          <button
            type="button"
            onClick={() => setShowConfirmation((value) => !value)}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={
              showConfirmation
                ? "Hide password confirmation"
                : "Show password confirmation"
            }
          >
            {showConfirmation ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {form.formState.errors.passwordConfirmation?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="group h-14 w-full rounded-xl primary-gradient text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
      >
        {resetPasswordMutation.isPending ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Resetting password...
          </>
        ) : (
          <>
            Reset password
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
