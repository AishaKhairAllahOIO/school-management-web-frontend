import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type SuperAdminUser = BaseUser & EmploymentInformation & {
  category: "super_admin";
  superAdminCode: string;
  superAdminEmail: string;
};
