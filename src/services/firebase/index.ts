export { firebaseConfig, firebaseVapidKey } from "./firebase.config";
export { firebaseApp } from "./firebase.app";

export {
  getFirebaseMessaging,
  requestNotificationPermission,
  requestFcmToken,
  listenToForegroundMessages,
} from "./firebase.messaging";