import { useForm } from "react-hook-form";

import { zodResolver }
from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";

import { Link } from "react-router-dom";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { useForgotPassword }
from "../hooks/use-forgot-password";

export function ForgotPasswordForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver:
      zodResolver(
        forgotPasswordSchema
      ),
  });

  const forgotPasswordMutation =
    useForgotPassword();

  function onSubmit(
    values: ForgotPasswordSchema
  ) {

    forgotPasswordMutation.mutate({
      email: values.email,
    });
  }

  return (

    <div
      className="
        rounded-[32px]
        border
        border-border
        bg-card/80
        p-15
        shadow-soft-lg
        backdrop-blur-xl
      "
    >

      <Link
        to="/login"
        className="
          mb-15
          inline-flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
          transition-colors
          hover:text-primary
        "
      >
        <ArrowLeft size={18} />

        Back to login
      </Link>

      <h1
        className="
          text-3xl
          font-bold
          text-foreground
        "
      >
        Forgot Password
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        Enter your email address and we
        will send you an OTP code.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          mt-8
          space-y-10
        "
      >

        <div className="space-y-5">

          <Label>
            Email
          </Label>

          <Input
            type="email"
            placeholder="admin@school.com"
            {...register("email")}
          />

          {errors.email && (

            <p
              className="
                text-sm
                text-destructive
              "
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            forgotPasswordMutation.isPending
          }
          size="lg"
          className="
            h-12
            w-full
            rounded-2xl
            shadow-soft
            hover:shadow-soft-lg
          "
        >
          {
            forgotPasswordMutation.isPending
              ? "Sending..."
              : "Send OTP"
          }
        </Button>
      </form>
    </div>
  );
}