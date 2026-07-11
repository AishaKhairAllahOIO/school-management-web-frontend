import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { queryClient } from "@/app/providers/query/queryClient";
import { unregisterCurrentFirebaseDevice } from "@/features/notifications";

import { authService } from "../api/auth.service";
import { AUTH_ROUTES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      try {
        await unregisterCurrentFirebaseDevice();
      } catch {
        // Device-token deletion failure must not block logout.
      }

      return authService.logout();
    },

    onSuccess: (response) => {
      toast.success(
        response.data.message || "Logged out successfully.",
      );
    },

    onError: () => {
      toast.error("Session ended locally.");
    },

    onSettled: async () => {
      clearAuth();

      await queryClient.cancelQueries();
      queryClient.clear();

      navigate(AUTH_ROUTES.LOGIN, {
        replace: true,
      });
    },
  });
}