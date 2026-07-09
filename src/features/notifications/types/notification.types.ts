export type DeviceTokenPayload = {
  fcm_token: string;
};

export type DeviceTokenResponse = {
  status: boolean;
  message?: string;
};