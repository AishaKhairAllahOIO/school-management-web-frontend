export type SubjectDifficulty =
  | "light"
  | "medium"
  | "heavy";

/**
 * الموديل الداخلي الذي تستخدمه الواجهة.
 *
 * جميع المعرفات تبقى داخلية ولا نعرضها
 * للمستخدم في الجداول أو الحقول كنصوص.
 */
export type GradeSubject = {
  id: string;

  academicYearId: string;
  academicTermId: string;
  gradeId: string;
  subjectId: string;

  /**
   * الباك يعيد اسم المادة مباشرة.
   */
  subjectName: string;

  /**
   * هذه الأسماء سيملؤها الفرونت من
   * قوائم السنوات والفصول والصفوف.
   */
  academicYearName?: string;
  academicTermName?: string;
  gradeName?: string;

  weeklyPeriods: number;
  difficulty: SubjectDifficulty;

  maxMark: number;
  passingMark: number;

  isFailingSubject: boolean;
  weightInTotal: number;

  maxPeriodsPerDay: number;
  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;

  preferredPeriodIndexes: number[];

  createdAt: string;
  updatedAt: string;
};

/**
 * الشكل القادم من GradeSubjectResource في الباك.
 */
export type GradeSubjectApiItem = {
  id: string | number;

  academicYearId:
    | string
    | number;

  semesterId:
    | string
    | number;

  gradeId:
    | string
    | number;

  subjectId:
    | string
    | number;

  subjectName?: string | null;

  weeklyPeriods:
    | number
    | string;

  difficulty:
    SubjectDifficulty;

  maxMark:
    | number
    | string;

  passingMark:
    | number
    | string;

  isFailingSubject:
    | boolean
    | number;

  weightInTotal:
    | number
    | string;

  maxPeriodsPerDay:
    | number
    | string;

  avoidFirstPeriod:
    | boolean
    | number;

  avoidLastPeriod:
    | boolean
    | number;

  preferredPeriodIndexes?:
    | Array<number | string>
    | null;

  createdAt?: string | null;
  updatedAt?: string | null;
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