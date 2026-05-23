import { useMutation }
from "@tanstack/react-query";

import { notify }
from "@/shared/lib/toast";

import { handleApiError }
from "@/shared/lib/error-handler";

import { resendPasswordOtp } from "../api/auth.api";
export function useResendPasswordOtp() {

  return useMutation({

mutationFn: resendPasswordOtp,

    onSuccess: () => {

      notify.success(
        "OTP resent successfully"
      );
    },

    onError: (error) => {

      handleApiError(error);
    },
  });
}