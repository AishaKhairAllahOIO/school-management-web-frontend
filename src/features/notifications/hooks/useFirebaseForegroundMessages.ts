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
    if (!enabled) return;

    let unsubscribe: (() => void) | undefined;

    async function listen() {
      unsubscribe = await listenToForegroundMessages((payload) => {
        const title =
          payload.notification?.title ?? "School Management System";

        const body = payload.notification?.body ?? "وصل إشعار جديد";

        toast.info(title, {
          description: body,
        });

        console.log("Foreground Firebase message:", payload);
      });
    }

    listen();

    return () => {
      unsubscribe?.();
    };
  }, [enabled]);
}