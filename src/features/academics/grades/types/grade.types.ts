export type Grade = {
  id: string;

  academicStageId: string;

  name: string;
  level: number;

  isGraduationGrade: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateGradePayload = {
  academicStageId: number;

  name: string;
  level: number;

  isGraduationGrade: boolean;
};

export type UpdateGradePayload = {
  name?: string;
  isGraduationGrade?: boolean;
};