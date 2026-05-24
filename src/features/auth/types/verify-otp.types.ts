 import type { User } from "./auth.types";

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  remember_me?: boolean;
}

export interface VerifyOtpResponse {
  user: User;

  token: string;
}