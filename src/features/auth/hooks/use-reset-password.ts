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
import type { ResetPasswordPayload } from "../types/auth.types";

export function useResetPassword() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),

    onSuccess: (response) => {
      const authData = response.data.data;

      if (!authData?.token || !authData.user) {
        toast.error("Password reset succeeded, but login data was not returned.");
        navigate(AUTH_ROUTES.LOGIN, { replace: true });
        return;
      }

      if (!isAllowedWebUser(authData.user)) {
        clearAuth();
        toast.error("This account is not allowed to access the web dashboard.");
        navigate(AUTH_ROUTES.LOGIN, { replace: true });
        return;
      }

      setAuth({
        token: authData.token,
        user: authData.user,
        permissions: authData.user.permissions,
        rememberMe: false,
      });

      requestFcmToken()
        .then((fcmToken) => {
          if (!fcmToken) return;

          return deviceTokenService.register({
            fcm_token: fcmToken,
          });
        })
        .catch(() => {
        });

      toast.success(
        response.data.message || "Password reset successfully. Welcome back."
      );

      navigate(AUTH_ROUTES.DASHBOARD, { replace: true });
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}