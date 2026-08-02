import {
  useQuery,
} from "@tanstack/react-query";

import {
  systemNoticesApi,
} from "../api/system-notices.api";
import {
  systemNoticesKeys,
} from "./system-notices.keys";

type UseSystemNoticesOptions = {
  enabled?: boolean;
  page?: number;
};

export function useSystemNotices({
  enabled = true,
  page = 1,
}: UseSystemNoticesOptions = {}) {
  return useQuery({
    queryKey:
      systemNoticesKeys.list(page),

    queryFn: async () => {
      const response =
        await systemNoticesApi.list(page);

      return response.data;
    },

    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}
