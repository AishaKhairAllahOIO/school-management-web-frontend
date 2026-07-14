import { z } from "zod";
import { OTP_LENGTH } from "../constants/auth.constants";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit verification code.`)
    .regex(/^\d{6}$/, "Verification code must contain numbers only."),
  rememberMe: z.boolean().optional(),
});

export type OtpSchema = z.infer<typeof otpSchema>;