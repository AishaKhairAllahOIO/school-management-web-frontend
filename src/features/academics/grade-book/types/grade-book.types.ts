export type AssessmentType =
  | "quiz"
  | "exam"
  | "homework"
  | "project"
  | "participation";

export type GradeBookEntry = {
  id: string;

  studentId: string;
  classroomId: string;
  subjectId: string;
  teacherAssignmentId: string;

  academicYearId: string;
  termId: string;

  assessmentTitle: string;
  assessmentType: AssessmentType;

  score: number;
  maxScore: number;

  note?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateGradeBookEntryPayload = {
  studentId: string;
  classroomId: string;
  subjectId: string;
  teacherAssignmentId: string;

  academicYearId: string;
  termId: string;

  assessmentTitle: string;
  assessmentType: AssessmentType;

  score: number;
  maxScore: number;

  note?: string | null;
};

export type UpdateGradeBookEntryPayload =
  Partial<CreateGradeBookEntryPayload>;