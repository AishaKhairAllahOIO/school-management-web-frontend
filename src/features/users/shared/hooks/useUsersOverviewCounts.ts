import {
  useQuery,
} from "@tanstack/react-query";

import {
  usersOverviewApi,
} from "../api/users-overview.api";

export const usersOverviewKeys = {
  all: [
    "users-overview",
  ] as const,

  roleCounts: () =>
    [
      ...usersOverviewKeys.all,
      "role-counts",
    ] as const,
} as const;

export function useUsersOverviewCounts() {
  return useQuery({
    queryKey:
      usersOverviewKeys.roleCounts(),

    queryFn: () =>
      usersOverviewApi.getRoleCounts(),

    staleTime: 60_000,
  });
}
