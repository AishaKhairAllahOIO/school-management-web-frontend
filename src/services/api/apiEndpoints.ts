 export const apiEndpoints = {
    AUTH: {

    LOGIN:
      "/auth/login",

    VERIFY_OTP:
      "/auth/verify-otp",

    FORGOT_PASSWORD:
      "/auth/password/forgot",

    RESEND_PASSWORD_OTP:
      "/auth/password/resend-otp",

    VERIFY_PASSWORD_OTP:
      "/auth/password/verify-otp",

    RESET_PASSWORD:
      "/auth/password/reset",

    LOGOUT:
      "/auth/logout",
  },
 
} as const;
