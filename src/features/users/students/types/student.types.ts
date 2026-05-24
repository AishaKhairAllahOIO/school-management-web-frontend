import type { BaseUser } from "../../shared/types/base-user.types";
import type { SchoolGrade } from "../../../settings/school-config/types/school.enums";

export type StudentAcademicStatus = 
  | "studying"
  | "passed" 
  | "failed" 
  | "graduated";

export type StudentUser = BaseUser & {
  category: "student";

  studentCode: string;

  parentId: string;

  grade: SchoolGrade;

  classroomId: string;

  enrollmentDate: string;

  academicStatus: StudentAcademicStatus;
};