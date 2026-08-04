import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { unifiedNotificationsApi } from "../api/unified-notifications.api";
import { unifiedNotificationsKeys } from "./unified-notifications.keys";

export function useUnifiedNotifications(options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: unifiedNotificationsKeys.list,
    queryFn: unifiedNotificationsApi.list,
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useUnifiedUnreadCount() {
  return useQuery({
    queryKey: unifiedNotificationsKeys.unread,
    queryFn: unifiedNotificationsApi.unreadCount,
    staleTime: 20_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

export function useMarkAllUnifiedNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unifiedNotificationsApi.markAllRead,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: unifiedNotificationsKeys.unread,
      });

      const previous = queryClient.getQueryData<number>(
        unifiedNotificationsKeys.unread,
      );

      queryClient.setQueryData(
        unifiedNotificationsKeys.unread,
        0,
      );

      queryClient.setQueryData(
        unifiedNotificationsKeys.list,
        (current: unknown) =>
          Array.isArray(current)
            ? current.map((item) => ({
                ...item,
                isRead: true,
              }))
            : current,
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (typeof context?.previous === "number") {
        queryClient.setQueryData(
          unifiedNotificationsKeys.unread,
          context.previous,
        );
      }
      toast.error(getAxiosErrorMessage(error));
    },
    onSuccess: () => {
      toast.success("All notifications marked as read.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: unifiedNotificationsKeys.all,
      });
    },
  });
}
