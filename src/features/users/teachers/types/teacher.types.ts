import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type TeacherUser = BaseUser & EmploymentInformation & {
  category: "teacher";
};

export type TeacherFormData = Omit<
  TeacherUser,
  | "id"
  | "category"
  | "teacherCode"
  | "teacherEmail"
  | "recordStatus"
  | "accountStatus"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

export type Teacher = TeacherUser;