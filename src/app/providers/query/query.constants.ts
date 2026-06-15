import type { DefaultOptions } from "@tanstack/react-query";

const ONE_MINUTE = 1000 * 60;

export const QUERY_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: ONE_MINUTE,
  },
};