export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_LOGIN_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/password/forgot",
    VERIFY_PASSWORD_OTP: "/auth/password/verify-otp",
    RESEND_PASSWORD_OTP: "/auth/password/resend-otp",
    RESET_PASSWORD: "/auth/password/reset",
    DEVICE_TOKENS: "/auth/device-tokens",
    LOGOUT: "/auth/logout",
  },
} as const;
