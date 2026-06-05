import type { BaseUser } from "../../shared/types/base-user.types";


export type StudentUser = BaseUser & {
  category: "student";

  studentCode: string;

  parentId: string;


  gradeId: string;

  classroomId: string;

};