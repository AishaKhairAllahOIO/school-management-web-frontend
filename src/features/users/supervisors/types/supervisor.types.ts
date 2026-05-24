import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";
import type { SchoolGrade, SchoolSubject } from "../../../settings/school-config/types/school.enums";

export type SupervisorUser = BaseUser & EmploymentInformation & {
  category: "supervisor";

  supervisorCode: string;

  supervisorEmail: string;
};

export type SupervisorGradeAssignment = {
  id: string;

  supervisorId: string;

  grade: SchoolGrade;

  subject?: SchoolSubject;
};