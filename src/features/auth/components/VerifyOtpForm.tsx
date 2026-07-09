import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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

  function onSubmit(values: OtpSchema) {
    if (isResetFlow) {
      verifyPasswordMutation.mutate({
        email,
        otp: values.otp,
      });

      return;
    }

    verifyLoginMutation.mutate({
      email,
      otp: values.otp,
      remember_me: values.rememberMe ? "1" : "0",
    });
  }

  function resendResetOtp() {
    if (!isResetFlow || !timer.canResend) return;

    resendPasswordMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          timer.restart(response.data.data?.remaining_time ?? 60);
        },
      }
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

      {form.formState.errors.otp && (
        <p className="text-center text-xs font-bold text-destructive">
          {form.formState.errors.otp.message}
        </p>
      )}

      {!isResetFlow && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <Checkbox
            id="rememberMe"
            checked={form.watch("rememberMe")}
            onCheckedChange={(checked) =>
              form.setValue("rememberMe", checked === true, {
                shouldValidate: true,
              })
            }
          />

          <Label
            htmlFor="rememberMe"
            className="cursor-pointer text-sm font-bold text-slate-600"
          >
            Remember me
          </Label>
        </div>
      )}

      <Button
        type="submit"
        className="h-14 w-full rounded-2xl primary-gradient text-base font-black text-white shadow-[0_20px_42px_rgba(103,58,244,0.28)]"
        disabled={isPending}
      >
        {isPending
          ? "Verifying..."
          : isResetFlow
            ? "Verify"
            : "Verify & Sign In"}
      </Button>

      <div className="text-center text-sm text-slate-500">
        {isResetFlow ? (
          <button
            type="button"
            onClick={resendResetOtp}
            disabled={!timer.canResend || resendPasswordMutation.isPending}
            className="font-extrabold text-primary transition hover:opacity-75 disabled:text-slate-400"
          >
            {resendPasswordMutation.isPending
              ? "Resending..."
              : timer.canResend
                ? "Resend code"
                : `Resend in ${timer.seconds}s`}
          </button>
        ) : (
          <span className="font-medium">
            Check your email for the verification code.
          </span>
        )}
      </div>

      <Link
        to={isResetFlow ? AUTH_ROUTES.FORGOT_PASSWORD : AUTH_ROUTES.LOGIN}
        className="mx-auto inline-flex items-center gap-2 text-sm font-extrabold text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
    </form>
  );
}