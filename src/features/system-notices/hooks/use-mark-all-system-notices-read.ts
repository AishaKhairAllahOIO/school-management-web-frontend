import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  toast,
} from "sonner";

import {
  getAxiosErrorMessage,
} from "@/services/axios/axiosError";

import {
  systemNoticesApi,
} from "../api/system-notices.api";
import {
  systemNoticesKeys,
} from "./system-notices.keys";

export function useMarkAllSystemNoticesRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      systemNoticesApi.markAllRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey:
          systemNoticesKeys.unreadCount,
      });

      const previousCount =
        queryClient.getQueryData<number>(
          systemNoticesKeys.unreadCount,
        );

      queryClient.setQueryData(
        systemNoticesKeys.unreadCount,
        0,
      );

      return {
        previousCount,
      };
    },

    onError: (error, _variables, context) => {
      if (
        typeof context?.previousCount ===
        "number"
      ) {
        queryClient.setQueryData(
          systemNoticesKeys.unreadCount,
          context.previousCount,
        );
      }

      toast.error(
        getAxiosErrorMessage(error),
      );
    },

    onSuccess: (response) => {
      queryClient.setQueryData(
        systemNoticesKeys.unreadCount,
        response.data.data
          ?.unread_count ?? 0,
      );

      toast.success(
        response.data.message ||
          "All notifications marked as read.",
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey:
          systemNoticesKeys.all,
      });
    },
  });
}
