import type { BaseUser } from "../../shared/types/base-user.types";
import type { EmploymentInformation } from "../../shared/types/employment.types";

export type TeacherUser = BaseUser & EmploymentInformation & {
  category: "teacher";

  teacherCode: string;

  teacherEmail: string;

  email: string;
  phone: string;
  city: string;
  subject: string;
  department: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  status: "active" | "inactive" | "on_leave";
  studyStartDate: string;
  studyEndDate: string;
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