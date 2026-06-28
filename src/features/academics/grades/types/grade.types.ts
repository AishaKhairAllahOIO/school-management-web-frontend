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
  academicStageId: string;

  name: string;

  level: number;

  isGraduationGrade: boolean;

};

export type UpdateGradePayload = Partial<CreateGradePayload>;