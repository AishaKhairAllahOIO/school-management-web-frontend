import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

export type RegisterDeviceTokenPayload = {
  fcm_token: string;
};

export type DeleteDeviceTokenPayload = {
  fcm_token: string;
};

export const deviceTokenService = {
  register(payload: RegisterDeviceTokenPayload) {
    return axiosClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.DEVICE_TOKENS,
      payload
    );
  },

  remove(payload: DeleteDeviceTokenPayload) {
    return axiosClient.delete<ApiResponse>(
      API_ENDPOINTS.AUTH.DEVICE_TOKENS,
      {
        data: payload,
      }
    );
  },
};