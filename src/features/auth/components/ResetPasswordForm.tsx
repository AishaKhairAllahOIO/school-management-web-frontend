import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  Link,
} from "react-router-dom";

import {
  getAxiosValidationErrors,
} from "@/services/axios/axiosError";
import {
  Button,
} from "@/shared/ui/button";
import {
  Input,
} from "@/shared/ui/input";

import {
  AUTH_ROUTES,
} from "../constants/auth.constants";
import {
  useResetPassword,
} from "../hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";

type ResetPasswordFormProps = {
  email: string;
  tempToken: string;
};

type PasswordRequirementProps = {
  isMet: boolean;
  label: string;
};

function PasswordRequirement({
  isMet,
  label,
}: PasswordRequirementProps) {
  return (
    <span
      className={[
        "flex items-center gap-1.5",
        "text-[11px] leading-4",
        "transition-colors duration-200",
        isMet
          ? "text-primary"
          : "text-muted-foreground",
      ].join(" ")}
    >
      {isMet ? (
        <Check
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={2.2}
        />
      ) : (
        <Circle
          aria-hidden="true"
          className="h-3 w-3 shrink-0"
          strokeWidth={1.8}
        />
      )}

      {label}
    </span>
  );
}

export function ResetPasswordForm({
  email,
  tempToken,
}: ResetPasswordFormProps) {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const resetPasswordMutation =
    useResetPassword();

  const form =
    useForm<ResetPasswordSchema>({
      resolver: zodResolver(
        resetPasswordSchema,
      ),

      defaultValues: {
        password: "",
        passwordConfirmation: "",
      },
    });

  const password =
    form.watch("password");

  const passwordChecks =
    useMemo(
      () => ({
        hasLength:
          password.length >= 8,

        hasUppercase:
          /[A-Z]/.test(password),

        hasLowercase:
          /[a-z]/.test(password),

        hasNumber:
          /\d/.test(password),

        hasSymbol:
          /[^A-Za-z0-9]/.test(
            password,
          ),
      }),
      [password],
    );

  const strength = useMemo(
    () =>
      Object.values(
        passwordChecks,
      ).filter(Boolean).length,
    [passwordChecks],
  );

  const strengthLabel =
    !password
      ? "Start typing"
      : strength >= 5
        ? "Excellent"
        : strength >= 4
          ? "Strong"
          : strength >= 3
            ? "Good"
            : "Needs work";

  function onSubmit(
    values: ResetPasswordSchema,
  ) {
    form.clearErrors();

    resetPasswordMutation.mutate(
      {
        email,
        tempToken,
        password:
          values.password,

        password_confirmation:
          values.passwordConfirmation,
      },
      {
        onError: (error) => {
          const validationErrors =
            getAxiosValidationErrors(
              error,
            );

          const passwordMessage =
            validationErrors
              .password?.[0];

          const confirmationMessage =
            validationErrors
              .password_confirmation?.[0];

          if (passwordMessage) {
            form.setError(
              "password",
              {
                type: "server",
                message:
                  passwordMessage,
              },
            );
          }

          if (
            confirmationMessage
          ) {
            form.setError(
              "passwordConfirmation",
              {
                type: "server",
                message:
                  confirmationMessage,
              },
            );
          }
        },
      },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit,
      )}
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
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            placeholder="Enter your new password"
            aria-invalid={
              form.formState.errors
                .password
                ? "true"
                : "false"
            }
            className="h-14 rounded-xl border-input bg-background pl-12 pr-12 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register(
              "password",
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (value) =>
                  !value,
              )
            }
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="rounded-[16px] border border-border/60 bg-muted/[0.22] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck
                aria-hidden="true"
                className="h-4 w-4 text-primary"
                strokeWidth={1.9}
              />

              Password strength
            </span>

            <span className="text-xs font-semibold text-foreground">
              {strengthLabel}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <span
                key={index}
                className={[
                  "h-1.5 rounded-full",
                  "transition-colors duration-200",
                  index < strength
                    ? "bg-primary"
                    : "bg-border/75",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">
            <PasswordRequirement
  isMet={passwordChecks.hasLength}
  label="8+ characters"
/>

<PasswordRequirement
  isMet={passwordChecks.hasUppercase}
  label="Uppercase"
/>

<PasswordRequirement
  isMet={passwordChecks.hasLowercase}
  label="Lowercase"
/>

<PasswordRequirement
  isMet={passwordChecks.hasNumber}
  label="Number"
/>

<PasswordRequirement
  isMet={passwordChecks.hasSymbol}
  label="Symbol"
/>
          </div>
        </div>

        {form.formState.errors
          .password?.message && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .password.message
            }
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
            type={
              showConfirmation
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            placeholder="Confirm your new password"
            aria-invalid={
              form.formState.errors
                .passwordConfirmation
                ? "true"
                : "false"
            }
            className="h-14 rounded-xl border-input bg-background pl-12 pr-12 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register(
              "passwordConfirmation",
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmation(
                (value) =>
                  !value,
              )
            }
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

        {form.formState.errors
          .passwordConfirmation
          ?.message && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .passwordConfirmation
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          resetPasswordMutation.isPending
        }
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

      <Link
        to={AUTH_ROUTES.LOGIN}
        className="
          mx-auto
          flex
          w-fit
          items-center
          gap-2
          text-sm
          font-medium
          text-muted-foreground
          transition-colors
          duration-200
          hover:text-foreground
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-primary/10
        "
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4"
          strokeWidth={1.9}
        />

        Back to sign in
      </Link>
    </form>
  );
}