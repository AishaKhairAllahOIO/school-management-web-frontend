import type { ReactNode } from "react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFirebaseForegroundMessages } from "@/features/notifications";

type NotificationsProviderProps = {
  children: ReactNode;
};

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useFirebaseForegroundMessages({
    enabled: isAuthenticated,
  });

  return children;
}