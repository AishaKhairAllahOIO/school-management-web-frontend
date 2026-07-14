import type { DefaultOptions } from "@tanstack/react-query";

const ONE_MINUTE = 1000 * 60;
const FIVE_MINUTES = ONE_MINUTE * 5;

export const QUERY_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    retry: 1,
    staleTime: ONE_MINUTE,
    gcTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },

  mutations: {
    retry: 0,
  },
};