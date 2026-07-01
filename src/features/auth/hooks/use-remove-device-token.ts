import { useMutation } from "@tanstack/react-query";

import { deviceTokenService } from "../api/device-token.service";

export function useRemoveDeviceToken() {
  return useMutation({
    mutationFn: deviceTokenService.remove,
  });
}