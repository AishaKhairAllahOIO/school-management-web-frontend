import {
  useMutation,
} from "@tanstack/react-query";
import {
  toast,
} from "sonner";

import {
  getAxiosErrorMessage,
} from "@/services/axios/axiosError";

import {
  authService,
} from "../api/auth.service";
import type {
  ResendOtpPayload,
} from "../types/auth.types";

export function useResendOtp() {
  return useMutation({
    mutationFn: (
      payload: ResendOtpPayload,
    ) =>
      authService.resendOtp(
        payload,
      ),

    onSuccess: (response) => {
      toast.success(
        response.data.message ||
          "Verification code resent successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}
