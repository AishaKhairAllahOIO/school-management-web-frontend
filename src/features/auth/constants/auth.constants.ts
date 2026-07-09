export const AUTH_STORAGE_KEYS =
{
  TOKEN: "auth_token",
  USER: "auth_user",
  PERMISSIONS: "auth_permissions",
  REMEMBER_ME: "auth_remember_me",
} as const;

export const AUTH_ROUTES = 
{
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/",
} as const;

export const OTP_LENGTH = 6;