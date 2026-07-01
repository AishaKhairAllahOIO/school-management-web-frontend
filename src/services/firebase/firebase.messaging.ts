import { getToken, onMessage, type Unsubscribe } from "firebase/messaging";
import { toast } from "sonner";

import { FIREBASE_VAPID_KEY } from "./firebase.constants";
import { getFirebaseMessaging } from "./firebase.config";

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export async function requestFcmToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) return null;

  if (!FIREBASE_VAPID_KEY) {
    throw new Error("Missing VITE_FIREBASE_VAPID_KEY.");
  }

  const token = await getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
  });

  return token || null;
}

export async function getCurrentFcmToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  if (!FIREBASE_VAPID_KEY) return null;

  const token = await getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
  });

  return token || null;
}

export async function listenToForegroundMessages(): Promise<Unsubscribe> {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title || "New notification";
    const body = payload.notification?.body || "";

    toast.info(title, {
      description: body,
    });
  });
}