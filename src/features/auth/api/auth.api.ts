import { axiosClient } from "@/services/axios/axiosClient";

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