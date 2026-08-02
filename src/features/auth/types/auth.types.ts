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

export type OtpPurpose =
  | "login"
  | "password_reset";

export type ForgotPasswordPayload = {
  email: string;
  purpose?: "password_reset";
};

export type VerifyPasswordOtpPayload = {
  email: string;
  otp: string;
};

export type ResendOtpPayload = {
  email: string;
  purpose: OtpPurpose;
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

export type LoginResponse = {
  remaining_time?: number;
};

export type VerifyLoginOtpResponse =
  AuthSessionResponse;

export type ForgotPasswordResponse = {
  remaining_time: number;
};

export type VerifyPasswordOtpResponse = {
  temp_token: string;
};

export type ResendOtpResponse = {
  remaining_time: number;
};

export type ResetPasswordResponse =
  AuthSessionResponse;

export type LogoutResponse = undefined;

export type AuthStorageData = {
  token: string;
  user: AuthUser;
  permissions: string[];
  rememberMe: boolean;
};

export type LoginOtpRouteState = {
  email: string;
  isResetFlow?: false;
  rememberMe?: boolean;
  remainingTime?: number;
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
