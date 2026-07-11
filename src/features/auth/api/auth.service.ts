import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  ResendPasswordOtpPayload,
  ResendPasswordOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyLoginOtpPayload,
  VerifyLoginOtpResponse,
  VerifyPasswordOtpPayload,
  VerifyPasswordOtpResponse,
} from "../types/auth.types";

export const authService = {
  login(payload: LoginPayload) {
    return axiosClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
  },

  verifyLoginOtp(payload: VerifyLoginOtpPayload) {
    return axiosClient.post<ApiResponse<VerifyLoginOtpResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_LOGIN_OTP,
      payload,
    );
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return axiosClient.post<ApiResponse<ForgotPasswordResponse>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload,
    );
  },

  verifyPasswordOtp(payload: VerifyPasswordOtpPayload) {
    return axiosClient.post<ApiResponse<VerifyPasswordOtpResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_PASSWORD_OTP,
      payload,
    );
  },

  resendPasswordOtp(payload: ResendPasswordOtpPayload) {
    return axiosClient.post<ApiResponse<ResendPasswordOtpResponse>>(
      API_ENDPOINTS.AUTH.RESEND_PASSWORD_OTP,
      payload,
    );
  },

  resetPassword(payload: ResetPasswordPayload) {
    return axiosClient.post<ApiResponse<ResetPasswordResponse>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
    );
  },

  logout() {
    return axiosClient.delete<ApiResponse<LogoutResponse>>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
  },
};