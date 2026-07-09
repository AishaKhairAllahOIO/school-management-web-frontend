import { requestFcmToken } from "@/services/firebase";

import { deviceTokenService } from "../api/device-token.api";
import { notificationTokenStorage } from "../lib/notification-token.storage";

export async function registerCurrentFirebaseDevice() {
  const fcmToken = await requestFcmToken();

  if (!fcmToken) {
    return null;
  }

  const storedToken = notificationTokenStorage.get();

  if (storedToken === fcmToken) {
    return fcmToken;
  }

  await deviceTokenService.register({
    fcm_token: fcmToken,
  });

  notificationTokenStorage.set(fcmToken);

  return fcmToken;
}

export async function unregisterCurrentFirebaseDevice() {
  const storedToken = notificationTokenStorage.get();

  if (!storedToken) {
    return null;
  }

  await deviceTokenService.remove({
    fcm_token: storedToken,
  });

  notificationTokenStorage.clear();

  return storedToken;
}