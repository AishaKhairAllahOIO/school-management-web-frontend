import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { login }
from "../api/auth.api";

import { useAuthStore }
from "../store/auth.store";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

export function useLogin() {

  const navigate = useNavigate();

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  return useMutation({

    mutationFn: login,

    onSuccess: (data) => {

      setAuth(
        data.token,
        data.user
      );

      notify.success(
        "Welcome back"
      );

      navigate("/dashboard");
    },

    onError: (error) => {

      handleApiError(error);
    },
  });
}