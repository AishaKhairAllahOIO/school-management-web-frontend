import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { AUTH_ROUTES } from "../constants/auth.constants";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { getAxiosValidationErrors } from "@/services/axios/axiosError";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginSchema) {
  form.clearErrors();

  loginMutation.mutate(
    {
      email: values.email,
      password: values.password,
    },
    {
      onSuccess: () => {
        navigate(AUTH_ROUTES.VERIFY_OTP, {
          state: {
            email: values.email,
            isResetFlow: false,
          },
        });
      },

      onError: (error) => {
        const validationErrors = getAxiosValidationErrors(error);

        const emailMessage = validationErrors.email?.[0];
        const passwordMessage = validationErrors.password?.[0];

        if (emailMessage) {
          form.setError("email", {
            type: "server",
            message: emailMessage,
          });
        }

        if (passwordMessage) {
          form.setError("password", {
            type: "server",
            message: passwordMessage,
          });
        }
      },
    },
  );
}
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-black text-[#17142F]">
          Email
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-primary/20"
            {...form.register("email")}
          />
        </div>

        {form.formState.errors.email && (
          <p className="text-xs font-bold text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-black text-[#17142F]">
          Password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-12 pr-12 text-sm font-bold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus-visible:ring-primary/20"
            {...form.register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {form.formState.errors.password && (
          <p className="text-xs font-bold text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to={AUTH_ROUTES.FORGOT_PASSWORD}
          className="text-sm font-black text-primary transition hover:opacity-75"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="group h-14 w-full rounded-2xl primary-gradient text-base font-black text-white shadow-[0_20px_42px_rgba(103,58,244,0.28)] transition hover:scale-[1.01] disabled:hover:scale-100"
      >
        {loginMutation.isPending ? "Sending code..." : "Sign In"}
        {!loginMutation.isPending && (
          <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
        )}
      </Button>
    </form>
  );
}