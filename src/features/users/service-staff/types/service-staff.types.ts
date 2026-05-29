import type { BaseUser } from "../../shared/types/base-user.types";

export type ServiceStaffJobType =
  | "cleaner"
  | "security"
  | "maintenance"
  | "other";

export type ServiceStaffUser = BaseUser & {
  category: "service_staff";

  hireDate: string;

  jobType: ServiceStaffJobType;
};