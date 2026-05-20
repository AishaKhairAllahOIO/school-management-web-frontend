import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/config/roles.config";

import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

import { notify } from "@/shared/lib/toast";
import { handleApiError } from "@/shared/lib/error-handler";
import { rolesConfig } from "@/config/roles.config";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const { token, user, permissions } = data;

      // 1) منع دخول أدوار الموبايل
      const allowedRoles: UserRole[] = [
      rolesConfig.SUPER_ADMIN,
      rolesConfig.ADVISOR,
      rolesConfig.SECRETARY,
       ]; 
  

      if (!user || !user.role) {
        notify.error("Invalid user data returned from server");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        notify.error("هذا الحساب مخصص لتطبيق الموبايل فقط");
        return;
      }

      // 2) حفظ بيانات المستخدم
      setAuth(token, user, permissions);

      notify.success("Welcome back");

      // 3) توجيه حسب الدور
      if (user.role === rolesConfig.SUPER_ADMIN) {
        navigate("/dashboard/admin");
      } else if (user.role === rolesConfig.ADVISOR) {
        navigate("/dashboard/advisor");
      } else if (user.role === rolesConfig.SECRETARY) {
        navigate("/dashboard/secretary");
      }
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}

 