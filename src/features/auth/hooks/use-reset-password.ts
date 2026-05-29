import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { resetPassword }
from "../api/auth.api";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

export function useResetPassword() {

  const navigate = useNavigate();

  return useMutation({

    mutationFn: resetPassword,

    onSuccess: () => {

      notify.success(
        "Password changed successfully"
      );

      navigate("/login");
    },

    onError: (error) => {

      handleApiError(error);
    },
  });
}