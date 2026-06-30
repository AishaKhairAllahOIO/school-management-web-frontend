export type AssessmentComponentType =
  | "oral"
  | "homework"
  | "quiz1"
  | "quiz2"
  | "exam"
  | "participation";

export type AssessmentComponent = {
  id: string;
  gradeSubjectId: string;
  type: AssessmentComponentType;
  name: string;
  maxMark: number;
  weightPercentage: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssessmentComponentPayload = {
  gradeSubjectId: string;
  type: AssessmentComponentType;
  name: string;
  maxMark: number;
  weightPercentage: number;
};

export type UpdateAssessmentComponentPayload = Partial<CreateAssessmentComponentPayload>;
