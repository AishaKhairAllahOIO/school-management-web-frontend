import {
  API_ENDPOINTS,
} from "@/services/api/endpoints";
import {
  axiosClient,
} from "@/services/axios/axiosClient";
import type {
  ApiResponse,
} from "@/services/types/apiResponse";

import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyLoginOtpPayload,
  VerifyLoginOtpResponse,
  VerifyPasswordOtpPayload,
  VerifyPasswordOtpResponse,
} from "../types/auth.types";

export const authService = {
  login(payload: LoginPayload) {
    return axiosClient.post<
      ApiResponse<LoginResponse>
    >(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
  },

  verifyLoginOtp(
    payload: VerifyLoginOtpPayload,
  ) {
    return axiosClient.post<
      ApiResponse<VerifyLoginOtpResponse>
    >(
      API_ENDPOINTS.AUTH
        .VERIFY_LOGIN_OTP,
      payload,
    );
  },

  forgotPassword(
    payload: ForgotPasswordPayload,
  ) {
    return axiosClient.post<
      ApiResponse<ForgotPasswordResponse>
    >(
      API_ENDPOINTS.AUTH
        .FORGOT_PASSWORD,
      {
        ...payload,
        purpose:
          payload.purpose ??
          "password_reset",
      },
    );
  },

  verifyPasswordOtp(
    payload: VerifyPasswordOtpPayload,
  ) {
    return axiosClient.post<
      ApiResponse<VerifyPasswordOtpResponse>
    >(
      API_ENDPOINTS.AUTH
        .VERIFY_PASSWORD_OTP,
      payload,
    );
  },

  /*
   * The backend now uses the existing forgot-password
   * endpoint for both OTP resend flows.
   */
  resendOtp(
    payload: ResendOtpPayload,
  ) {
    return axiosClient.post<
      ApiResponse<ResendOtpResponse>
    >(
      API_ENDPOINTS.AUTH
        .FORGOT_PASSWORD,
      payload,
    );
  },

  resetPassword(
    payload: ResetPasswordPayload,
  ) {
    return axiosClient.post<
      ApiResponse<ResetPasswordResponse>
    >(
      API_ENDPOINTS.AUTH
        .RESET_PASSWORD,
      payload,
    );
  },

  logout() {
    return axiosClient.delete<
      ApiResponse<LogoutResponse>
    >(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
  },
};
