import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

import { FIREBASE_CONFIG } from "./firebase.constants";

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

export async function getFirebaseMessaging() {
  const supported = await isSupported();

  if (!supported) return null;

  return getMessaging(firebaseApp);
}