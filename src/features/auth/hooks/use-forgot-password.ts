import { useMutation }
from "@tanstack/react-query";

import { useNavigate }
from "react-router-dom";

import { forgotPassword }
from "../api/auth.api";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

export function useForgotPassword() {

  const navigate = useNavigate();

  return useMutation({

    mutationFn: forgotPassword,

    onSuccess: (
      data,
      variables
    ) => {

      notify.success(
        "OTP sent successfully"
      );

      navigate(
        "/verify-otp",
        {
          state: {
            email:
              variables.email,

            remainingTime:
              data.remaining_time,

            isResetFlow: true,
          },
        }
      );
    },

    onError: (error) => {

      handleApiError(error);
    },
  });
}