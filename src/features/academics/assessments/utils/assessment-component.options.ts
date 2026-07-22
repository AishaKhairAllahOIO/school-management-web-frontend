import type {
  AssessmentComponentType,
} from "../types/assessment-component.types";

import type {
  GradeSubject,
} from "../../grade-subjects/types/grade-subject.types";

export type AssessmentSelectOption = {
  value: string;
  label: string;
};

export const assessmentTypeOptions: AssessmentSelectOption[] = [
  {
    value: "oral",
    label: "Oral",
  },
  {
    value: "homework",
    label: "Homework",
  },
  {
    value: "quiz1",
    label: "Quiz 1",
  },
  {
    value: "quiz2",
    label: "Quiz 2",
  },
  {
    value: "exam",
    label: "Exam",
  },
  {
    value: "participation",
    label: "Participation",
  },
];

export function getAssessmentTypeLabel(
  type: AssessmentComponentType,
): string {
  return (
    assessmentTypeOptions.find(
      (option) => option.value === type,
    )?.label ?? type
  );
}

export function createGradeSubjectOptions(
  gradeSubjects: GradeSubject[],
): AssessmentSelectOption[] {
  return gradeSubjects.map((gradeSubject) => {
    const subjectName =
      gradeSubject.subjectName?.trim() ||
      "Unknown subject";

    return {
      value: String(gradeSubject.id),
      label: subjectName,
    };
  });
}

export function getOptionLabel(
  options: AssessmentSelectOption[],
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const normalizedValue = String(value);

  return (
    options.find(
      (option) =>
        option.value === normalizedValue,
    )?.label ?? "Unknown grade subject"
  );
}