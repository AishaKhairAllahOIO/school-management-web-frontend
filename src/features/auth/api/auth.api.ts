import { axiosClient } from "@/services/axios/axiosClient";
// import { apiEndpoints } from "@/services/api/apiEndpoints";
// import type { ApiResponse } from "@/services/api/ApiResponse";
// import type { LoginPayload, LoginResponse } from "@/types/auth.types";

import type {
  LoginPayload,
  LoginResponse,
}
from "../types/auth.types";

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {

  const { data } = await axiosClient.post(
    "/auth/login",
    payload
  );

  return data;
}
 

// export const login = async (payload: LoginPayload) => {
//   const { data } = await axiosClient.post<ApiResponse<LoginResponse>>(
//     apiEndpoints.AUTH.LOGIN,
//     payload
//   );

//   return data.data;
// };