import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type SuperAdminUser = BaseUser & EmploymentInformation & {
  category: "super_admin";
<<<<<<< HEAD

  superAdminCode: string;
  superAdminEmail: string;
};
=======
  superAdminCode: string;
  superAdminEmail: string;
};
>>>>>>> eda85da6a42b280ef2904d76f2bf1c05c3269c29
