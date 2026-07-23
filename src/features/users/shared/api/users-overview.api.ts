import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type {
  UsersOverviewCounts,
  UsersRoleCountsApiData,
  UsersRoleCountsApiResponse,
} from "../types/users-overview.types";

function toSafeCount(
  value: unknown,
): number | undefined {
  if (
    value === null ||
    value === undefined
  ) {
    return undefined;
  }

  const count = Number(value);

  return Number.isFinite(count)
    ? count
    : undefined;
}

function mapRoleCounts(
  data: UsersRoleCountsApiData,
): UsersOverviewCounts {
  return {
    students: toSafeCount(
      data.student,
    ),

    teachers: toSafeCount(
      data.teacher,
    ),

    supervisors: toSafeCount(
      data.adviser,
    ),

    secretaries: toSafeCount(
      data.secretary,
    ),

    counselors: toSafeCount(
      data.counselor,
    ),

    serviceStaff: toSafeCount(
      data.service_staff,
    ),

    total: toSafeCount(
      data.total,
    ),
  };
}

export const usersOverviewApi = {
  async getRoleCounts(): Promise<UsersOverviewCounts> {
    const response =
      await axiosClient.get<UsersRoleCountsApiResponse>(
        API_ENDPOINTS.STAFF.ROLE_COUNTS,
      );

    return mapRoleCounts(
      response.data.data ?? {},
    );
  },
};
