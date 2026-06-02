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

import { Link } from "react-router-dom";

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

          {/* Logo */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-accent-foreground
              text-primary-foreground
              text-xl
              font-bold
              shadow-soft
            "
          >
            S
          </div>

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-foreground
              "
            >
              Welcome to login system
            </h1>
          </div>
        </div>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-muted-foreground
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
            className="
            focus-visible:ring-2
            focus-visible:ring-primary/50
            focus-visible:border-primary
          "
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
              className="
                pr-12
                focus-visible:ring-2
                focus-visible:ring-primary/50
                focus-visible:border-primary
              "
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
                text-accent-foreground
              "
            >
              Remember me
            </Label>
          </div>

          <Link
            to="/forgot-password"
            className="
              text-sm
              font-medium
              text-accent-foreground
              transition-colors
              hover:text-primary-dark
              hover:underline
            "
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          size="lg"
          className="
            h-13
            w-full
            rounded-xl
            shadow-soft
            hover:shadow-soft-lg
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
          text-muted-foreground
        "
      >
        © 2026 School Desk.
        All rights reserved.
      </div>
    </div>
  );
}