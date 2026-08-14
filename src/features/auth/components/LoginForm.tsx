import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getAxiosValidationErrors,
} from "@/services/axios/axiosError";
import {
  Button,
} from "@/shared/ui/button";
import {
  Checkbox,
} from "@/shared/ui/checkbox";
import {
  Input,
} from "@/shared/ui/input";
import {
  Label,
} from "@/shared/ui/label";

import {
  AUTH_ROUTES,
} from "../constants/auth.constants";
import {
  useLogin,
} from "../hooks/use-login";
import {
  loginSchema,
  type LoginSchema,
} from "../schemas/login.schema";
import type {
  LoginResponse,
} from "../types/auth.types";

type LoginFormProps = {
  dir?: "ltr" | "rtl";
};

export function LoginForm({
  dir = "ltr",
}: LoginFormProps) {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const isRtl = dir === "rtl";

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const form = useForm<LoginSchema>({
    resolver:
      zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(
    values: LoginSchema,
  ) {
    form.clearErrors();

    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (response) => {
          const responseData =
            response.data.data as
              | LoginResponse
              | null
              | undefined;

          navigate(
            AUTH_ROUTES.VERIFY_OTP,
            {
              state: {
                email: values.email,
                isResetFlow: false,
                rememberMe:
                  values.rememberMe,
                remainingTime:
                  responseData
                    ?.remaining_time ??
                  60,
              },
            },
          );
        },

        onError: (error) => {
          const validationErrors =
            getAxiosValidationErrors(
              error,
            );

          const emailMessage =
            validationErrors.email?.[0];

          const passwordMessage =
            validationErrors.password?.[0];

          if (emailMessage) {
            form.setError(
              "email",
              {
                type: "server",
                message:
                  emailMessage,
              },
            );
          }

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
      autoComplete="on"
      noValidate
    >
      <div className="space-y-2 text-start">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-foreground"
        >
          {isRtl
            ? "البريد الإلكتروني"
            : "Email address"}
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="login-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={
              isRtl
                ? "أدخل بريدك الإلكتروني"
                : "Enter your email"
            }
            aria-invalid={
              form.formState.errors.email
                ? "true"
                : "false"
            }
            className="h-14 rounded-xl border-input bg-background ps-12 pe-4 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register("email")}
          />
        </div>

        {form.formState.errors.email
          ?.message && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .email.message
            }
          </p>
        )}
      </div>

      <div className="space-y-2 text-start">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-foreground"
        >
          {isRtl
            ? "كلمة المرور"
            : "Password"}
        </label>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="login-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            placeholder={
              isRtl
                ? "أدخل كلمة المرور"
                : "Enter your password"
            }
            aria-invalid={
              form.formState.errors
                .password
                ? "true"
                : "false"
            }
            className="h-14 rounded-xl border-input bg-background ps-12 pe-12 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            {...form.register(
              "password",
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) =>
                  !current,
              )
            }
            className="absolute end-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={
              showPassword
                ? isRtl
                  ? "إخفاء كلمة المرور"
                  : "Hide password"
                : isRtl
                  ? "إظهار كلمة المرور"
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

        {form.formState.errors.password
          ?.message && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .password.message
            }
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-1">
          <Controller
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(
                    checked,
                  ) =>
                    field.onChange(
                      checked === true,
                    )
                  }
                  className="h-4 w-4 rounded border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />

                <Label
                  htmlFor="remember-me"
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  {isRtl
                    ? "تذكرني"
                    : "Remember me"}
                </Label>
              </div>
            )}
          />

          <Link
            to={
              AUTH_ROUTES.FORGOT_PASSWORD
            }
            className="shrink-0 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            {isRtl
              ? "نسيت كلمة المرور؟"
              : "Forgot password?"}
          </Link>
        </div>
      </div>

      {loginMutation.isError &&
        !form.formState.errors.email &&
        !form.formState.errors.password && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {isRtl
              ? "تعذر تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى."
              : "We couldn't sign you in. Please check your credentials and try again."}
          </div>
        )}

      <Button
        type="submit"
        disabled={
          loginMutation.isPending
        }
        className="group h-14 w-full rounded-xl primary-gradient text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
      >
        {loginMutation.isPending ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />

            {isRtl
              ? "جارٍ تسجيل الدخول..."
              : "Signing in..."}
          </>
        ) : (
          <>
            {isRtl
              ? "تسجيل الدخول"
              : "Sign in"}

            {isRtl ? (
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </>
        )}
      </Button>

      <p className="pt-1 text-center text-sm text-muted-foreground">
        {isRtl
          ? "الوصول مخصص لموظفي وإداريي المدرسة المصرح لهم."
          : "Access is limited to authorized school staff and administrators."}
      </p>
    </form>
  );
}