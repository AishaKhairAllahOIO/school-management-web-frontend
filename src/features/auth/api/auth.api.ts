 import { axiosClient } from "@/services/axios/axiosClient";
import { apiEndpoints } from "@/services/api/apiEndpoints";

import type { LoginPayload, LoginResponse } from "../types/auth.types";
import type { ApiResponse } from "@/services/api/apiResponse";

export const login = async (payload: LoginPayload) => {
  const { data } = await axiosClient.post<ApiResponse<LoginResponse>>(
    apiEndpoints.AUTH.LOGIN,
    payload
  );

  return data.data;
};
