import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";

import { firebaseVapidKey } from "./firebase.config";
import { firebaseApp } from "./firebase.app";

const FIREBASE_MESSAGING_SW_PATH = "/firebase-messaging-sw.js";

export async function getFirebaseMessaging() {
  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getMessaging(firebaseApp);
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported" as const;
  }

  return Notification.requestPermission();
}

export async function requestFcmToken() {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return null;
  }

  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    FIREBASE_MESSAGING_SW_PATH
  );

  return getToken(messaging, {
    vapidKey: firebaseVapidKey,
    serviceWorkerRegistration: registration,
  });
}

export async function listenToForegroundMessages(
  callback: (payload: MessagePayload) => void
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, callback);
}