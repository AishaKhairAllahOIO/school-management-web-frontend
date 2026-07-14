import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type SecretaryUser = BaseUser & EmploymentInformation & {
    category: "secretary";

    secretaryCode: string;
};