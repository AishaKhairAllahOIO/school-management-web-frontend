import { useMutation } from "@tanstack/react-query";
import { communicationsService } from "../services/communications.service";
import type { DeviceTokenPayload } from "../types/deviceToken.types";

export function useDeviceToken() {
  const store = useMutation({
    mutationFn: async (payload: DeviceTokenPayload) =>
      communicationsService.storeDeviceToken(payload),
  });

  return { store };
}
