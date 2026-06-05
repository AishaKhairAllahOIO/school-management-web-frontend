import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type TeacherUser = BaseUser & EmploymentInformation & {
  category: "teacher";

  teacherCode: string;

  teacherEmail: string;

subjectIds: string[];
};


export type TeacherAssignment = {
  id: string;

  teacherId: string;
  classroomId: string;
  subjectId: string;

  academicYearId: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};