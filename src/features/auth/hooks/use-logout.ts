import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getCurrentFcmToken } from "@/services/firebase/firebase.messaging";

import { authService } from "../api/auth.service";
import { deviceTokenService } from "../api/device-token.service";
import { AUTH_ROUTES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      try {
        const fcmToken = await getCurrentFcmToken();

        if (fcmToken) {
          await deviceTokenService.remove({
            fcm_token: fcmToken,
          });
        }
      } catch {
        // Do not block logout if FCM unregister fails.
      }

      return authService.logout();
    },

    onSuccess: (response) => {
      toast.success(response.data.message || "Logged out successfully.");
    },

    onError: () => {
      toast.error("Session ended locally.");
    },

    onSettled: () => {
      clearAuth();
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    },
  });
}