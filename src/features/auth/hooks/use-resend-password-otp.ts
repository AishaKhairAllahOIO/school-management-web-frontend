import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import { authService } from "../api/auth.service";
import type { ResendPasswordOtpPayload } from "../types/auth.types";

export function useResendPasswordOtp() {
  return useMutation({
    mutationFn: (payload: ResendPasswordOtpPayload) => authService.resendPasswordOtp(payload),
    onSuccess: (response) => toast.success(response.data.message || "Verification code resent successfully."),
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });
}
