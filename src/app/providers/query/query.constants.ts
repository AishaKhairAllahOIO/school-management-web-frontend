import type { DefaultOptions } from "@tanstack/react-query";

export const QUERY_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  },
};