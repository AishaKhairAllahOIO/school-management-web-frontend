 import { axiosClient } from "@/services/axios/axiosClient";

import { apiEndpoints } from "@/services/api/apiEndpoints";

import type { LoginPayload, LoginResponse } from "../types/auth.types";

import type { ApiResponse } from "@/services/api/apiResponse";

import type { VerifyOtpPayload, VerifyOtpResponse} from "../types/verify-otp.types";

import type { ForgotPasswordPayload, ForgotPasswordResponse } from "../types/forgot-password.types";

import type { VerifyPasswordOtpPayload, VerifyPasswordOtpResponse } from "../types/verify-password-otp.types";

import type { ResetPasswordPayload } from "../types/reset-password.types";


// export const login = async (payload: LoginPayload) => {
//   const { data } = await axiosClient.post<ApiResponse<LoginResponse>>(
//     apiEndpoints.AUTH.LOGIN,
//     payload
//   );

//   return data;
// };
export const login = async (
  payload: LoginPayload
) => {

  console.log("LOGIN PAYLOAD:", payload);

  console.log(
    "FULL URL:",
    `${import.meta.env.VITE_API_URL}${apiEndpoints.AUTH.LOGIN}`
  );

  const { data } =
    await axiosClient.post<
      ApiResponse<LoginResponse>
    >(
      apiEndpoints.AUTH.LOGIN,
      payload
    );

  console.log("LOGIN RESPONSE:", data);

  return data;
};


export const verifyOtp = async (
  payload: VerifyOtpPayload
) => {

  const { data } =
    await axiosClient.post<
      ApiResponse<VerifyOtpResponse>
    >(
      apiEndpoints.AUTH.VERIFY_OTP,
      payload
    );

  return data.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
) => {

  const { data } =
    await axiosClient.post<
      ApiResponse<ForgotPasswordResponse>
    >(
      apiEndpoints.AUTH.FORGOT_PASSWORD,
      payload
    );

  return data.data;
};

export const verifyPasswordOtp =
  async (
    payload:
      VerifyPasswordOtpPayload
  ) => {

    const { data } =
      await axiosClient.post<
        ApiResponse<VerifyPasswordOtpResponse>
      >(
        apiEndpoints.AUTH
          .VERIFY_PASSWORD_OTP,
        payload
      );

    return data.data;
};

export const resendPasswordOtp =
  async (
    payload: ForgotPasswordPayload
  ) => {

    const { data } =
      await axiosClient.post<
        ApiResponse<ForgotPasswordResponse>
      >(
        apiEndpoints.AUTH
          .RESEND_PASSWORD_OTP,
        payload
      );

    return data.data;
};

export const resetPassword =
  async (
    payload:
      ResetPasswordPayload
  ) => {

    const { data } =
      await axiosClient.post(
        apiEndpoints.AUTH
          .RESET_PASSWORD,
        payload
      );

    return data;
};

export const logout = async () => {

  const { data } =
    await axiosClient.post(
      apiEndpoints.AUTH.LOGOUT
    );

  return data;
};

