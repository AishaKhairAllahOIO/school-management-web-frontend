import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { authService } from "../api/auth.service";
import { AUTH_ROUTES } from "../constants/auth.constants";
import type { VerifyPasswordOtpPayload } from "../types/auth.types";

export function useVerifyPasswordOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: VerifyPasswordOtpPayload) =>
      authService.verifyPasswordOtp(payload),

    onSuccess: (response, variables) => {
      const tempToken = response.data.data?.temp_token;

      if (!tempToken) {
        toast.error("Invalid verification response. Please try again.");
        return;
      }

      toast.success(response.data.message || "Code verified successfully.");

      navigate(AUTH_ROUTES.RESET_PASSWORD, {
        replace: true,
        state: {
          email: variables.email,
          tempToken,
        },
      });
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}