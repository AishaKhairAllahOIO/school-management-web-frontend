import type {
  ApiId,
  StaffRole,
} from "../types/staff.types";

export const staffKeys = {
  all: [
    "staff",
  ] as const,

  profile: () =>
    [
      ...staffKeys.all,
      "profile",
    ] as const,

  roleCounts: () =>
    [
      ...staffKeys.all,
      "role-counts",
    ] as const,

  roles: () =>
    [
      ...staffKeys.all,
      "roles",
    ] as const,

  role: (
    role: StaffRole,
  ) =>
    [
      ...staffKeys.roles(),
      role,
    ] as const,

  rolePage: (
    role: StaffRole,
    page: number,
    perPage: number,
  ) =>
    [
      ...staffKeys.role(role),
      {
        page,
        perPage,
      },
    ] as const,

  details: () =>
    [
      ...staffKeys.all,
      "details",
    ] as const,

  detail: (
    staffId: ApiId,
  ) =>
    [
      ...staffKeys.details(),
      staffId,
    ] as const,
} as const;
