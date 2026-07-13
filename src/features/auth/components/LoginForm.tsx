import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { getAxiosValidationErrors } from "@/services/axios/axiosError";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { AUTH_ROUTES } from "../constants/auth.constants";
import { useLogin } from "../hooks/use-login";
import {
  loginSchema,
  type LoginSchema,
} from "../schemas/login.schema";


export function LoginForm() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  

  function onSubmit(values: LoginSchema) {
    form.clearErrors();

    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {

          navigate(AUTH_ROUTES.VERIFY_OTP, {
            state: {
              email: values.email,
              isResetFlow: false,
            },
          });
        },

        onError: (error) => {
          const validationErrors =
            getAxiosValidationErrors(error);

          const emailMessage = validationErrors.email?.[0];
          const passwordMessage =
            validationErrors.password?.[0];

          if (emailMessage) {
            form.setError("email", {
              type: "server",
              message: emailMessage,
            });
          }

          if (passwordMessage) {
            form.setError("password", {
              type: "server",
              message: passwordMessage,
            });
          }
        },
      },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-foreground"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            aria-invalid={
              form.formState.errors.email ? "true" : "false"
            }
            className="h-14 rounded-xl border-border bg-background pl-12 pr-4 text-base text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register("email")}
          />
        </div>

        {form.formState.errors.email?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-foreground"
          >
            Password
          </label>

          <Link
            to={AUTH_ROUTES.FORGOT_PASSWORD}
            className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={
              form.formState.errors.password
                ? "true"
                : "false"
            }
            className="h-14 rounded-xl border-border bg-background pl-12 pr-12 text-base text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register("password")}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
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

        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {loginMutation.isError &&
        !form.formState.errors.email &&
        !form.formState.errors.password && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            We couldn&apos;t sign you in. Please check your
            credentials and try again.
          </div>
        )}

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="group h-14 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        {loginMutation.isPending ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="h-5 w-5 animate-spin"
            />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </Button>

      <p className="pt-1 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <span className="font-medium text-primary">
          Contact your administrator
        </span>
      </p>
    </form>
  );
}