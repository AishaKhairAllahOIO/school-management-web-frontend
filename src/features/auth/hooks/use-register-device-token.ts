import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { deviceTokenService } from "../api/device-token.service";

export function useRegisterDeviceToken() {
  return useMutation({
    mutationFn: deviceTokenService.register,

    onSuccess: (response) => {
      toast.success(response.data.message);
    },
  });
}