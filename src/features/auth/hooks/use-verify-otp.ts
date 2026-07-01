import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import { requestFcmToken } from "@/services/firebase/firebase.messaging";

import { authService } from "../api/auth.service";
import { deviceTokenService } from "../api/device-token.service";
import { AUTH_ROUTES } from "../constants/auth.constants";
import { isAllowedWebUser } from "../lib/auth.utils";
import { useAuthStore } from "../store/auth.store";
import type { VerifyLoginOtpPayload } from "../types/auth.types";

export function useVerifyOtp() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (payload: VerifyLoginOtpPayload) =>
      authService.verifyLoginOtp(payload),

    onSuccess: async (response, variables) => {
      const authData = response.data.data;

      if (!authData?.token || !authData.user) {
        toast.error("Invalid login response. Please try again.");
        return;
      }

      if (!isAllowedWebUser(authData.user)) {
        clearAuth();
        toast.error("Your account role is not allowed to access the dashboard.");
        return;
      }

      const rememberMe = variables.remember_me === "1";

      setAuth({
        token: authData.token,
        user: authData.user,
        permissions: authData.user.permissions,
        rememberMe,
      });

      try {
        const fcmToken = await requestFcmToken();

        if (fcmToken) {
          await deviceTokenService.register({
            fcm_token: fcmToken,
          });
        }
      } catch {
        // فشل الإشعارات لا يمنع تسجيل الدخول
      }

      toast.success(response.data.message || "Logged in successfully.");
      navigate(AUTH_ROUTES.DASHBOARD, { replace: true });
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}