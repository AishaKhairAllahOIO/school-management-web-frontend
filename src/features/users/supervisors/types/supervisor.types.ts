import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type SupervisorUser = BaseUser & EmploymentInformation & {
  category: "supervisor";

  supervisorCode: string;
};
