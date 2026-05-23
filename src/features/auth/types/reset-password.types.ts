export interface ResetPasswordPayload {

  email: string;

  password: string;

  password_confirmation: string;

  tempToken: string;
}