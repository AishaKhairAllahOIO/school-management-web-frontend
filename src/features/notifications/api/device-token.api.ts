import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  DeviceTokenPayload,
  DeviceTokenResponse,
} from "../types/notification.types";

export const deviceTokenService = {
  register(payload: DeviceTokenPayload) {
    return axiosClient.post<ApiResponse<DeviceTokenResponse>>(
      API_ENDPOINTS.AUTH.DEVICE_TOKENS,
      payload
    );
  },

  remove(payload: DeviceTokenPayload) {
    return axiosClient.delete<ApiResponse<DeviceTokenResponse>>(
      API_ENDPOINTS.AUTH.DEVICE_TOKENS,
      {
        data: payload,
      }
    );
  },
};