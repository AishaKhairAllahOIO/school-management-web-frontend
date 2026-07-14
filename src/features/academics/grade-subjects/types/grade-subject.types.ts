export type SubjectDifficulty = "light" | "medium" | "heavy";

export type GradeSubject = {
  id: string;
  academicYearId: string;
  academicTermId: string;
  gradeId: string;
  subjectId: string;
  weeklyPeriods: number;
  difficulty: SubjectDifficulty;
  maxMark: number;
  passingMark: number;
  isFailingSubject: boolean;
  weightInTotal: number;
  maxPeriodsPerDay: number;
  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;
  preferredPeriodIndexes?: number[];
  createdAt: string;
  updatedAt: string;
};

export type CreateGradeSubjectPayload = {
  academicYearId: string;
  academicTermId: string;
  gradeId: string;
  subjectId: string;
  weeklyPeriods: number;
  difficulty: SubjectDifficulty;
  maxMark: number;
  passingMark: number;
  isFailingSubject: boolean;
  weightInTotal: number;
  maxPeriodsPerDay: number;
  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;
  preferredPeriodIndexes?: number[];
};

export type UpdateGradeSubjectPayload = Partial<CreateGradeSubjectPayload>;
