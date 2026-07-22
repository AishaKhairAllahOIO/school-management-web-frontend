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

export type UpdateAssessmentComponentPayload =
  Partial<CreateAssessmentComponentPayload>;

export type AssessmentComponentApiRecord = {
  id: string | number;

  gradeSubjectId?: string | number;
  grade_subject_id?: string | number;

  type: AssessmentComponentType;

  name: string;

  maxMark?: string | number;
  max_mark?: string | number;

  weightPercentage?: string | number;
  weight_percentage?: string | number;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
};

export type AssessmentSubjectGroup = {
  gradeSubjectId: string;

  subjectId?: string;

  subjectName: string;

  gradeId?: string;

  gradeName?: string;

  components: AssessmentComponent[];
};

export type AssessmentGroupedApiRecord = {
  gradeSubjectId?: string | number;
  grade_subject_id?: string | number;

  subjectId?: string | number;
  subject_id?: string | number;

  subjectName?: string;
  subject_name?: string;

  gradeId?: string | number;
  grade_id?: string | number;
  gradeLevelId?: string | number;
  grade_level_id?: string | number;

  gradeName?: string;
  grade_name?: string;
  gradeLevelName?: string;
  grade_level_name?: string;

  components?: AssessmentComponentApiRecord[];
  assessments?: AssessmentComponentApiRecord[];
  assessmentComponents?: AssessmentComponentApiRecord[];
  assessment_components?: AssessmentComponentApiRecord[];
};