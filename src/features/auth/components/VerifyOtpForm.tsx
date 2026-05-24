import { useState } from "react";

import { motion }
from "framer-motion";

import { ArrowLeft }
from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { Button }
from "@/shared/ui/button";

import { OtpInput }
from "./OtpInput";

import { useResendOtpTimer }
from "../hooks/use-resend-otp-timer";

import { useVerifyPasswordOtp }
from "../hooks/use-verify-password-otp";

import { useVerifyOtp }
from "../hooks/use-verify-otp";

import { useResendPasswordOtp }
from "../hooks/useResendPasswordOtp";

export function VerifyOtpForm() {

  const location = useLocation();

  const {
    email,
    rememberMe,
    isResetFlow,
  } = location.state || {};

  const [otp, setOtp] =
    useState("");

  const {
    timeLeft,
    canResend,
    resetTimer,
  } = useResendOtpTimer(60);

  const verifyOtpMutation =
    useVerifyOtp();

  const verifyPasswordOtpMutation =
    useVerifyPasswordOtp();

  const resendPasswordOtpMutation =
    useResendPasswordOtp();

  function handleComplete(
    value: string
  ) {

    setOtp(value);
  }

  function handleSubmit() {

    if (!email) return;

    if (isResetFlow) {

      verifyPasswordOtpMutation.mutate({
        email,
        otp,
      });

      return;
    }

    verifyOtpMutation.mutate({
      email,
      otp,
      remember_me:
        rememberMe || false,
    });
  }

  function handleResendOtp() {

    if (!canResend || !email)
      return;

    if (isResetFlow) {

      resendPasswordOtpMutation.mutate({
        email,
      });

      resetTimer();

      return;
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        w-full
        max-w-md
        rounded-[32px]
        border
        border-border
        bg-card/80
        p-8
        shadow-soft-lg
        backdrop-blur-xl
      "
    >

      <Link
        to={
          isResetFlow
            ? "/forgot-password"
            : "/login"
        }
        className="
          mb-6
          inline-flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
          transition-colors
          hover:text-primary
        "
      >
        <ArrowLeft size={16} />

        Back
      </Link>

      <h1
        className="
          text-3xl
          font-bold
          text-foreground
        "
      >
        Verify OTP
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        Enter the 6-digit code
        sent to your email.
      </p>

      <div className="mt-8">

        <OtpInput
          onComplete={
            handleComplete
          }
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          otp.length < 6 ||
          verifyOtpMutation.isPending ||
          verifyPasswordOtpMutation.isPending
        }
        size="lg"
        className="
          mt-8
          w-full
          rounded-2xl
          shadow-soft
          hover:shadow-soft-lg
        "
      >
        {
          verifyOtpMutation.isPending ||
          verifyPasswordOtpMutation.isPending
            ? "Verifying..."
            : "Verify OTP"
        }
      </Button>

      <div
        className="
          mt-6
          text-center
          text-sm
          text-muted-foreground
        "
      >
        Didn’t receive the code?
      </div>

      <button
        onClick={handleResendOtp}
        disabled={!canResend}
        className="
          mt-2
          w-full
          text-sm
          font-medium
          text-primary
          transition-colors
          hover:text-primary/80
          disabled:text-muted-foreground
        "
      >
        {
          timeLeft > 0
            ? `Resend in ${timeLeft}s`
            : "Resend OTP"
        }
      </button>
    </motion.div>
  );
}