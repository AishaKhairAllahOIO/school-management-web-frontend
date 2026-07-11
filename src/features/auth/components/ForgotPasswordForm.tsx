import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { AUTH_ROUTES } from "../constants/auth.constants";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { getAxiosValidationErrors } from "@/services/axios/axiosError";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmit(values: ForgotPasswordSchema) {
  form.clearErrors();

  forgotPasswordMutation.mutate(values, {
    onError: (error) => {
      const validationErrors = getAxiosValidationErrors(error);
      const emailMessage = validationErrors.email?.[0];

      if (emailMessage) {
        form.setError("email", {
          type: "server",
          message: emailMessage,
        });
      }
    },
  });
}

  return (
 <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="space-y-5"
>
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

      <Button
        type="submit"
        className="h-14 w-full rounded-2xl primary-gradient text-base font-black text-white shadow-[0_20px_42px_rgba(103,58,244,0.28)]"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? "Sending code..." : "Send OTP"}
      </Button>

      <Link
        to={AUTH_ROUTES.LOGIN}
        className="mx-auto inline-flex items-center gap-2 text-sm font-extrabold text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </form>
  );
}