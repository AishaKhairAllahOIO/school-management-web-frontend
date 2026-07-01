import { useEffect } from "react";

import {
  listenToForegroundMessages,
  registerFirebaseServiceWorker,
} from "@/services/firebase";

export function FirebaseMessagingProvider() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    registerFirebaseServiceWorker();

    listenToForegroundMessages().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return null;
}