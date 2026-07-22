import {
  useQuery,
} from "@tanstack/react-query";

import {
  usersOverviewApi,
} from "../api/users-overview.api";

import type {
  UsersOverviewCounts,
} from "../../shared/types/users-overview.types";

export const usersOverviewKeys = {
  all: [
    "users-overview",
  ] as const,

  roleCounts: () =>
    [
      ...usersOverviewKeys.all,
      "role-counts",
    ] as const,
};

export function useUsersOverviewCounts() {
  return useQuery<
    UsersOverviewCounts,
    Error
  >({
    queryKey:
      usersOverviewKeys.roleCounts(),

    queryFn:
      usersOverviewApi.getRoleCounts,

    staleTime: 60_000,
  });
}