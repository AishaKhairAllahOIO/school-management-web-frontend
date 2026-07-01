export type RegisterDeviceTokenPayload =
{
  user_id: number;
  fcm_token: string;
};

export type DeleteDeviceTokenPayload = 
{
  fcm_token: string;
};