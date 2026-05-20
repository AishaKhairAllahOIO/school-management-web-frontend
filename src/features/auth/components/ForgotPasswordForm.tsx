import { useForm } from "react-hook-form";

import { zodResolver }
from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function ForgotPasswordForm() {
const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver:
      zodResolver(forgotPasswordSchema),
  });

  function onSubmit(
    values: ForgotPasswordSchema
  ) {
    console.log(values);
     navigate("/verify-otp");
  }
 
  return (
    <div className="rounded-[32px] border border-white/20 bg-white/80 p-15 shadow-2xl backdrop-blur-xl">

      <Link
        to="/login"
        className="mb-15 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#5B4FC7]"
      >
        <ArrowLeft size={18} />
        Back to login
      </Link>

      <h1 className="text-3xl font-bold text-[#1A1A2E]">
        Forgot Password
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        Enter your email address and we
        will send you an OTP code.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-10"
      >

        <div className="space-y-5">

          <Label>Email</Label>

          <Input
            type="email"
            placeholder="admin@school.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#5B4FC7] text-white hover:bg-[#4A3FB5]"
        >
          Send OTP
        </Button>
      </form>
    </div>
  );
}