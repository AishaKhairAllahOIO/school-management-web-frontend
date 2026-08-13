import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Mail,
} from "lucide-react";
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
  useForgotPassword,
} from "../hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";

type ForgotPasswordFormProps = {
  dir?: "ltr" | "rtl";
};

export function ForgotPasswordForm({
  dir = "ltr",
}: ForgotPasswordFormProps) {
  const isRtl = dir === "rtl";

  const forgotPasswordMutation =
    useForgotPassword();

  const form =
    useForm<ForgotPasswordSchema>({
      resolver:
        zodResolver(
          forgotPasswordSchema,
        ),
      defaultValues: {
        email: "",
      },
    });

  function onSubmit(
    values: ForgotPasswordSchema,
  ) {
    form.clearErrors();

    forgotPasswordMutation.mutate(
      values,
      {
        onError: (error) => {
          const validationErrors =
            getAxiosValidationErrors(
              error,
            );

          const emailMessage =
            validationErrors.email?.[0];

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
      <div className="space-y-2 text-start">
        <label
          htmlFor="forgot-email"
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
            id="forgot-email"
            type="email"
            dir="ltr"
            autoComplete="email"
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

      <Button
        type="submit"
        disabled={
          forgotPasswordMutation.isPending
        }
        className="group h-14 w-full rounded-xl primary-gradient text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />

            {isRtl
              ? "جارٍ إرسال الرمز..."
              : "Sending code..."}
          </>
        ) : (
          <>
            {isRtl
              ? "إرسال رمز التحقق"
              : "Send verification code"}

            {isRtl ? (
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </>
        )}
      </Button>

      <Link
        to={AUTH_ROUTES.LOGIN}
        className="mx-auto flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {isRtl ? (
          <ArrowRight className="h-4 w-4" />
        ) : (
          <ArrowLeft className="h-4 w-4" />
        )}

        {isRtl
          ? "العودة إلى تسجيل الدخول"
          : "Back to sign in"}
      </Link>
    </form>
  );
}