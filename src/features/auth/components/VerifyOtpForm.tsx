import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { getAxiosValidationErrors } from "@/services/axios/axiosError";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

import { AUTH_ROUTES } from "../constants/auth.constants";
import { useResendOtpTimer } from "../hooks/use-resend-otp-timer";
import { useResendPasswordOtp } from "../hooks/use-resend-password-otp";
import { useVerifyOtp } from "../hooks/use-verify-otp";
import { useVerifyPasswordOtp } from "../hooks/use-verify-password-otp";
import { otpSchema, type OtpSchema } from "../schemas/otp.schema";
import { OtpInput } from "./OtpInput";

type VerifyOtpFormProps = {
  email: string;
  isResetFlow?: boolean;
  initialRemainingTime?: number;
};

export function VerifyOtpForm({
  email,
  isResetFlow = false,
  initialRemainingTime = 60,
}: VerifyOtpFormProps) {
  const verifyLoginMutation = useVerifyOtp();
  const verifyPasswordMutation = useVerifyPasswordOtp();
  const resendPasswordMutation = useResendPasswordOtp();
  const timer = useResendOtpTimer(initialRemainingTime || 60);

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      rememberMe: false,
    },
  });

  const isPending =
    verifyLoginMutation.isPending || verifyPasswordMutation.isPending;

  function handleOtpError(error: unknown) {
    const validationErrors = getAxiosValidationErrors(error);
    const otpMessage = validationErrors.otp?.[0];

    if (otpMessage) {
      form.setError("otp", {
        type: "server",
        message: otpMessage,
      });
    }
  }

  function onSubmit(values: OtpSchema) {
    form.clearErrors();

    if (isResetFlow) {
      verifyPasswordMutation.mutate(
        {
          email,
          otp: values.otp,
        },
        {
          onError: handleOtpError,
        },
      );

      return;
    }

    verifyLoginMutation.mutate(
      {
        email,
        otp: values.otp,
        remember_me: values.rememberMe ? "1" : "0",
      },
      {
        onError: handleOtpError,
      },
    );
  }

  function resendResetOtp() {
    if (!isResetFlow || !timer.canResend) {
      return;
    }

    resendPasswordMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          timer.restart(response.data.data?.remaining_time ?? 60);
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
      <Controller
        control={form.control}
        name="otp"
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            disabled={isPending}
          />
        )}
      />

      {form.formState.errors.otp?.message && (
        <p className="text-center text-sm text-destructive">
          {form.formState.errors.otp.message}
        </p>
      )}

      {!isResetFlow && (
        <Controller
  control={form.control}
  name="rememberMe"
  render={({ field }) => (
    <div className="flex items-center gap-2">
      <Checkbox
        id="remember-device"
        checked={field.value}
        onCheckedChange={(checked) =>
          form.setValue("rememberMe", checked === true, {
            shouldValidate: true,
          })
        }
        className="h-4 w-4 rounded border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      />

      <Label
        htmlFor="remember-device"
        className="cursor-pointer text-sm text-muted-foreground"
      >
        Remember me
      </Label>
    </div>
  )}
/>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="group h-14 w-full rounded-xl primary-gradient text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            {isResetFlow ? "Verify code" : "Verify and sign in"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      <div className="text-center text-sm">
        {isResetFlow ? (
          <button
            type="button"
            onClick={resendResetOtp}
            disabled={resendPasswordMutation.isPending || !timer.canResend}
            className="font-semibold text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            {resendPasswordMutation.isPending
              ? "Resending..."
              : timer.canResend
                ? "Resend verification code"
                : `Resend code in ${timer.seconds}s`}
          </button>
        ) : (
          <p className="text-muted-foreground">
            Check your email for the verification code.
          </p>
        )}
      </div>

      <Link
        to={AUTH_ROUTES.LOGIN}
        className="mx-auto flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </form>
  );
}
