import { axiosClient } from "@/services/axios/axiosClient";

import type {
  UsersOverviewCounts,
  UsersRoleCountsApiData,
  UsersRoleCountsApiResponse,
} from "../types/users-overview.types";

const USERS_ROLE_COUNTS_ENDPOINT =
  "/user/counts/roles";

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

    /*
     * الراوت الحالي لا يعيد guardian.
     * لذلك لا نضع قيمة وهمية.
     */
    parents: undefined,

    teachers: toSafeCount(
      data.teacher,
    ),

    /*
     * اسم الدور في الباك adviser،
     * بينما البطاقة في الواجهة Supervisors.
     */
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
      await axiosClient.get<
        UsersRoleCountsApiResponse
      >(
        USERS_ROLE_COUNTS_ENDPOINT,
      );

    return mapRoleCounts(
      response.data.data ?? {},
    );
  },
};