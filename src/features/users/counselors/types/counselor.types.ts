import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type CounselorUser = BaseUser & EmploymentInformation & {
    category: "counselor";

    counselorCode: string;

    counselorEmail: string;

    office?: string | null;
};