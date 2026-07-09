export type AuthRole = string;

export type AuthUser = {
  id: number;
  role: AuthRole[];
  email: string;
  is_active: boolean;
  permissions: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyLoginOtpPayload = {
  email: string;
  otp: string;
  remember_me?: "1" | "0";
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyPasswordOtpPayload = {
  email: string;
  otp: string;
};

export type ResendPasswordOtpPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  tempToken: string;
  password: string;
  password_confirmation: string;
};

export type AuthSessionResponse = {
  user: AuthUser;
  token: string;
};

export type VerifyLoginOtpResponse = AuthSessionResponse;

export type ResetPasswordResponse = AuthSessionResponse;

export type ForgotPasswordResponse = {
  remaining_time: number;
};

export type ResendPasswordOtpResponse = {
  remaining_time: number;
};

export type VerifyPasswordOtpResponse = {
  temp_token: string;
};

export type AuthStorageData = {
  token: string;
  user: AuthUser;
  permissions: string[];
  rememberMe: boolean;
};

export type LoginOtpRouteState = {
  email: string;
  isResetFlow?: false;
};

export type ResetOtpRouteState = {
  email: string;
  isResetFlow: true;
  remainingTime?: number;
};

export type ResetPasswordRouteState = {
  email: string;
  tempToken: string;
};