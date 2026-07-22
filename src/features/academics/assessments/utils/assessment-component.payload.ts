import type {
  AssessmentComponent,
  AssessmentComponentType,
  CreateAssessmentComponentPayload,
  UpdateAssessmentComponentPayload,
} from "../types/assessment-component.types";

export type AssessmentComponentFormValues = {
  gradeSubjectId: string;

  type: AssessmentComponentType;

  name: string;

  maxMark: number | string;

  weightPercentage: number | string;
};

function normalizeNumber(
  value: number | string,
): number {
  const normalizedValue = Number(value);

  return Number.isFinite(normalizedValue)
    ? normalizedValue
    : 0;
}

export function toAssessmentComponentFormValues(
  row: AssessmentComponent,
): AssessmentComponentFormValues {
  return {
    gradeSubjectId:
      String(row.gradeSubjectId),

    type: row.type,

    name: row.name,

    maxMark: row.maxMark,

    weightPercentage:
      row.weightPercentage,
  };
}

export function buildCreateAssessmentComponentPayload(
  values: AssessmentComponentFormValues,
): CreateAssessmentComponentPayload {
  return {
    /*
     * القيمة جاءت من select.
     * المستخدم اختار اسم المادة،
     * بينما القيمة الداخلية هي id.
     */
    gradeSubjectId:
      String(values.gradeSubjectId),

    type: values.type,

    name: values.name.trim(),

    maxMark: normalizeNumber(
      values.maxMark,
    ),

    weightPercentage:
      normalizeNumber(
        values.weightPercentage,
      ),
  };
}

export function buildUpdateAssessmentComponentPayload(
  values: AssessmentComponentFormValues,
): UpdateAssessmentComponentPayload {
  return {
    gradeSubjectId:
      String(values.gradeSubjectId),

    type: values.type,

    name: values.name.trim(),

    maxMark: normalizeNumber(
      values.maxMark,
    ),

    weightPercentage:
      normalizeNumber(
        values.weightPercentage,
      ),
  };
}