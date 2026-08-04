export type Grade = {
  id: string;
  academicStageId: string;
  name: string;
  level: number;
  isGraduationGrade: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateGradePayload = {
  academicStageId: number;
  name: string;
  isGraduationGrade: boolean;
};

export type UpdateGradePayload = {
  academicStageId?: number;
  name?: string;
  isGraduationGrade?: boolean;
};

export type AvailableGradeOption = {
  key: string;
};

export type AcademicStageWithGrades = {
  id: string;
  stage: string;
  displayLabel: string;
  grades: AvailableGradeOption[];
};
