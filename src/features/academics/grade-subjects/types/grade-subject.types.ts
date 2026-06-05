export type GradeSubject = {
  id: string;

  gradeId: string;
  subjectId: string;

  weeklyHours: number;
  isCore: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateGradeSubjectPayload = {
  gradeId: string;
  subjectId: string;
  weeklyHours: number;
  isCore: boolean;
  isActive: boolean;
};

export type UpdateGradeSubjectPayload = Partial<CreateGradeSubjectPayload>;