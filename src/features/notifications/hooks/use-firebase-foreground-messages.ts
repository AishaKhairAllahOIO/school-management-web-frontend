import { useEffect } from "react";
import { toast } from "sonner";

import { listenToForegroundMessages } from "@/services/firebase";

type UseFirebaseForegroundMessagesOptions = {
  enabled: boolean;
};

export function useFirebaseForegroundMessages({
  enabled,
}: UseFirebaseForegroundMessagesOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isDisposed = false;
    let unsubscribe: (() => void) | undefined;

    async function startListening() {
      try {
        const cleanup = await listenToForegroundMessages(
          (payload) => {
            const title =
              payload.notification?.title ??
              "School Management System";

            const body =
              payload.notification?.body ??
              "You have received a new notification.";

            toast.info(title, {
              description: body,
            });

            if (import.meta.env.DEV) {
              console.debug(
                "Foreground Firebase message:",
                payload,
              );
            }
          },
        );

        if (isDisposed) {
          cleanup?.();
          return;
        }

        unsubscribe = cleanup;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(
            "Failed to start Firebase foreground listener:",
            error,
          );
        }
      }
    }

    void startListening();

    return () => {
      isDisposed = true;
      unsubscribe?.();
    };
  }, [enabled]);
}