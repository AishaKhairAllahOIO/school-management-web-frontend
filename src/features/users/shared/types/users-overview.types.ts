export type UsersOverviewCounts = {
  students?: number;
  parents?: number;
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
  super_admin?: number;
  student?: number;
  total?: number;
};

export type UsersRoleCountsApiResponse = {
  success: boolean;
  message: string;
  data: UsersRoleCountsApiData;
};