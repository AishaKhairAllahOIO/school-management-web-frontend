import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { logout }
from "../api/auth.api";

import { useAuthStore }
from "../store/auth.store";

import { notify }
from "@/shared/lib/toast";

export function useLogout() {

  const navigate = useNavigate();

  const logoutStore =
    useAuthStore(
      (state) => state.logout
    );

  return useMutation({

    mutationFn: logout,

    onSuccess: () => {

      logoutStore();

      notify.success(
        "Logged out successfully"
      );

      navigate("/login");
    },

    onError: () => {

      logoutStore();

      navigate("/login");
    },
  });
}