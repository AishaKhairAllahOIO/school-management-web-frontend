import type {
  ApiResponse,
} from "./api.types";

export type UsersOverviewCounts = {
  students?: number;
  teachers?: number;
  supervisors?: number;
  secretaries?: number;
  counselors?: number;
  serviceStaff?: number;
  total?: number;
};

export type UsersRoleCountsApiData = {
  teacher?: number;
  adviser?: number;
  counselor?: number;
  secretary?: number;
  service_staff?: number;
  student?: number;
  total?: number;
};

export type UsersRoleCountsApiResponse =
  ApiResponse<UsersRoleCountsApiData>;
