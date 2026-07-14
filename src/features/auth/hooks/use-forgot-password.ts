import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { authService } from "../api/auth.service";
import { AUTH_ROUTES } from "../constants/auth.constants";
import type { ForgotPasswordPayload } from "../types/auth.types";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),

    onSuccess: (response, variables) => {
      toast.success(
        response.data.message || "Password reset code sent successfully."
      );

      navigate(AUTH_ROUTES.VERIFY_OTP, {
        replace: true,
        state: {
          email: variables.email,
          isResetFlow: true,
          remainingTime: response.data.data?.remaining_time,
        },
      });
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}