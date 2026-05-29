import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { verifyPasswordOtp }
from "../api/auth.api";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

export function useVerifyPasswordOtp() {

  const navigate = useNavigate();

  return useMutation({

    mutationFn:
      verifyPasswordOtp,

    onSuccess: (
      data,
      variables
    ) => {

      notify.success(
        "OTP verified"
      );

      navigate(
        "/reset-password",
        {
          state: {
            email:
              variables.email,

            tempToken:
              data.temp_token,
          },
        }
      );
    },

    onError: (error) => {

      handleApiError(error);
    },
  });
}