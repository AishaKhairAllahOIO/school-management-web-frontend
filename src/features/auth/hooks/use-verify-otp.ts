import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { verifyOtp }
from "../api/auth.api";

import { useAuthStore }
from "../store/auth.store";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

import { rolesConfig }
from "@/shared/constants/roles.config";

import type { UserRole }
from "@/shared/constants/roles.config";

export function useVerifyOtp() {

  const navigate = useNavigate();

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  return useMutation({

    mutationFn: verifyOtp,

    onSuccess: (data) => {
    console.log("VERIFY OTP DATA:", data);
    console.log("USER:", data.user);
    console.log("ROLE:", data.user?.role);
      const {
        token,
        user,
      } = data;

      const allowedRoles: UserRole[] = [
        rolesConfig.SUPER_ADMIN,
        rolesConfig.ADVISOR,
        rolesConfig.SECRETARY,
      ];

      if (
        !allowedRoles.includes(user.role)
      ) {

        notify.error(
          "هذا الحساب مخصص للموبايل فقط"
        );

        return;
      }

      setAuth(
        token,
        user,   
        [] // permissions
      );

      notify.success(
        "Login successful"
      );

      setTimeout(() => {
      if (
        user.role ===
        rolesConfig.SUPER_ADMIN
      ) {

        navigate(
          "/"
        );
      }

      else if (
        user.role ===
        rolesConfig.ADVISOR
      ) {

        navigate(
          "/"
        );
      }

      else if (
        user.role ===
        rolesConfig.SECRETARY
      ) {

        navigate(
          "/"
        );
      }
    
 
     }, 1200);

      },

    onError: (error) => {

      handleApiError(error);
    },
  });
}