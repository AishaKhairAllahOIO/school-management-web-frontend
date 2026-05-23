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
import { useResendPasswordOtp } from "../hooks/useResendPasswordOtp";

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

  // login otp mutation
  const verifyOtpMutation =
    useVerifyOtp();

  // forgot password otp mutation
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

    // forgot password flow
    if (isResetFlow) {

      verifyPasswordOtpMutation.mutate({
        email,
        otp,
      });

      return;
    }

    // login flow
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

  // login resend later
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
        border-white/20
        bg-white/80
        p-8
        shadow-2xl
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
          text-gray-500
          transition-colors
          hover:text-[#5B4FC7]
        "
      >
        <ArrowLeft size={16} />

        Back
      </Link>

      <h1
        className="
          text-3xl
          font-bold
          text-[#1A1A2E]
        "
      >
        Verify OTP
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-gray-500
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
        className="
          mt-8
          h-12
          w-full
          rounded-2xl
          bg-[#5B4FC7]
          text-white
          hover:bg-[#4A3FB5]
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
          text-gray-500
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
          text-[#5B4FC7]
          disabled:text-gray-400
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