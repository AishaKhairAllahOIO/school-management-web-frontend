import {
  useQuery,
} from "@tanstack/react-query";

import {
  systemNoticesApi,
} from "../api/system-notices.api";
import {
  systemNoticesKeys,
} from "./system-notices.keys";

export function useUnreadSystemNoticesCount() {
  return useQuery({
    queryKey:
      systemNoticesKeys.unreadCount(),

    queryFn: async () => {
      const response =
        await systemNoticesApi.unreadCount();

      return (
        response.data.data
          ?.unread_count ?? 0
      );
    },

    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}
