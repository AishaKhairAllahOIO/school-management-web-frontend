export interface VerifyPasswordOtpPayload {

  email: string;

  otp: string;
}

export interface VerifyPasswordOtpResponse {

  temp_token: string;
}