
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { authService } from "../api/auth.service";
import type { LoginPayload } from "../types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (response) => {
      toast.success(
        response.data.message || "Verification code sent successfully."
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}