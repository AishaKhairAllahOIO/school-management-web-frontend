import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";
import type { SchoolSubject } from "../../shared/types/school.enums";

export type TeacherUser = BaseUser & EmploymentInformation & {
  category: "teacher";

  teacherCode: string;

  teacherEmail: string;

  subjects: SchoolSubject[];
};

export type TeacherClassroomAssignment = {
  id: string;

  teacherId: string;

  classroomId: string;

  subject: SchoolSubject;
};