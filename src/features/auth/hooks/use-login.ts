import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import { login } from "../api/auth.api";

import { notify } from "@/shared/lib/toast";

import { handleApiError } from "@/shared/lib/error-handler";

export function useLogin() {

  const navigate = useNavigate();

  return useMutation({

    mutationFn: login,

    onSuccess: (_, variables) => {

      notify.success(
        "OTP sent successfully"
      );

      navigate(
        "/verify-otp",
        {
          state: {
            email: variables.email,
            rememberMe:
              variables.rememberMe,
          },
        }
      );
    },

   onError: (error) => {

  console.log("LOGIN ERROR:", error);

  handleApiError(error);
},
  });
}
 