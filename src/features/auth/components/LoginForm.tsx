 import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginSchema,
} from "../schemas/login.schema";

import { useLogin } from "../hooks/use-login";

import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";

import { Label } from "@/shared/ui/label";

import { Checkbox } from "@/shared/ui/checkbox";

export function LoginForm() {

  const [showPassword, setShowPassword] =
    useState(false);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({

    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  function onSubmit(values: LoginSchema) {

    loginMutation.mutate(values);
  }

  return (
    <div
      className="
        w-full
        max-w-md
      "
    >

      {/* Header */}
      <div className="mb-8">

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-[#5B4FC7]
              text-white
              text-xl
              font-bold
              shadow-lg
            "
          >
            S
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-[#1A1A2E]
              "
            >
              School Desk
            </h1>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              School Management Dashboard
            </p>
          </div>
        </div>

        <h2
          className="
            text-3xl
            font-bold
            text-[#1A1A2E]
          "
        >
          Welcome Back 👋
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-500
          "
        >
          Login to continue managing
          your school system.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* Email */}
        <div className="space-y-2">

          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="admin@school.com"
            autoComplete="email"
            {...register("email")}
          />

          {errors.email && (
            <p
              className="
                text-sm
                text-red-500
              "
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">

          <Label htmlFor="password">
            Password
          </Label>

          <div className="relative">

            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              className="pr-12"
              {...register("password")}
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
                text-gray-500
                transition-colors
                hover:text-[#5B4FC7]
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
                text-red-500
              "
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me + Forgot */}
        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => {

                setValue(
                  "rememberMe",
                  Boolean(checked)
                );
              }}
            />

            <Label
              htmlFor="rememberMe"
              className="
                cursor-pointer
                text-sm
                text-gray-600
              "
            >
              Remember me
            </Label>
          </div>

          <button
            type="button"
            className="
              text-sm
              font-medium
              text-[#5B4FC7]
              transition-colors
              hover:text-[#4A3FB5]
              hover:underline
            "
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="
            h-12
            w-full
            rounded-xl
            bg-[#5B4FC7]
            text-white
            font-medium
            shadow-lg
            transition-all
            hover:bg-[#4A3FB5]
            hover:shadow-xl
          "
        >
          {
            loginMutation.isPending
              ? "Signing In..."
              : "Sign In"
          }
        </Button>
      </form>

      {/* Footer */}
      <div
        className="
          mt-8
          text-center
          text-sm
          text-gray-400
        "
      >
        © 2026 School Desk.
        All rights reserved.
      </div>
    </div>
  );
}