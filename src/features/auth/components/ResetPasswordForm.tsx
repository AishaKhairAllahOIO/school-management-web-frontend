import { useState } from "react";

import { motion } from "framer-motion";

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver }
from "@hookform/resolvers/zod";

import { useLocation }
from "react-router-dom";

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";

import { useResetPassword }
from "../hooks/use-reset-password";

import { Button }
from "@/shared/ui/button";

import { Input }
from "@/shared/ui/input";

import { Label }
from "@/shared/ui/label";

export function ResetPasswordForm() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const location = useLocation();

  const { email, tempToken } =
    location.state || {};

  const resetPasswordMutation =
    useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver:
      zodResolver(
        resetPasswordSchema
      ),
  });

  function onSubmit(
    values: ResetPasswordSchema
  ) {

    resetPasswordMutation.mutate({
      email,

      password:
        values.password,

      password_confirmation:
        values.confirmPassword,

      tempToken,
    });
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

      <h1
        className="
          text-3xl
          font-bold
          text-foreground
        "
      >
        Reset Password
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        Create a new secure password
        for your account.
      </p>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="
          mt-8
          space-y-5
        "
      >

        <div className="space-y-2">

          <Label>
            New Password
          </Label>

          <div className="relative">

            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter new password"
              className="pr-12"
              {...register(
                "password"
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-muted-foreground
                transition-colors
                hover:text-primary
              "
            >
              {
                showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
              }
            </button>
          </div>

          {errors.password && (

            <p
              className="
                text-sm
                text-destructive
              "
            >
              {
                errors.password
                  .message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">

          <Label>
            Confirm Password
          </Label>

          <div className="relative">

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
              className="pr-12"
              {...register(
                "confirmPassword"
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-muted-foreground
                transition-colors
                hover:text-primary
              "
            >
              {
                showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
              }
            </button>
          </div>

          {errors.confirmPassword && (

            <p
              className="
                text-sm
                text-destructive
              "
            >
              {
                errors
                  .confirmPassword
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
          size="lg"
          className="
            w-full
            rounded-2xl
            shadow-soft
            hover:shadow-soft-lg
          "
        >
          {
            resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"
          }
        </Button>
      </form>
    </motion.div>
  );
}