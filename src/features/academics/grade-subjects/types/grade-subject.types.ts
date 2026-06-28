
export type SubjectDifficulty = "light" | "medium" | "heavy";

export type GradeSubject = {
  id: string;

  academicYearId: string;
  academicTermId: string;

  gradeId: string;
  subjectId: string;

  weeklyPeriods: number;

  difficulty: SubjectDifficulty;

  maxMark: number;//ا المحصلة(مجموع الشفهي والكتابي والخ)
  passingMark: number;//علامة النجاح

  isFailingSubject: boolean;//هل هي مادة مرسبة
  weightInTotal: number; // النسبة من مجموع المواد

  maxPeriodsPerDay: number;

  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;

  preferredPeriodIndexes?: number[];// الحصص التي يفضل ان توضع بها المادة يمكن ان تعتبر سوفت كونسترين

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

export type UpdateGradeSubjectPayload =
  Partial<CreateGradeSubjectPayload>;