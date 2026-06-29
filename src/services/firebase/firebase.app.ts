import { getApps, initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebase.config";

export const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);