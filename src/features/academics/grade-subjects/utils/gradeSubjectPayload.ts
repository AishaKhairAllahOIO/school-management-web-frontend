import type {
  FormValues,
} from "../../shared/components/CrudPage";

import type {
  CreateGradeSubjectPayload,
  GradeSubject,
  UpdateGradeSubjectPayload,
} from "../types/grade-subject.types";

export function toNumberArray(
  value: FormValues[string],
): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(Number)
    .filter(Number.isFinite);
}

export function toGradeSubjectFormValues(
  row: GradeSubject,
): FormValues {
  return {
    academicYearId:
      row.academicYearId,

    academicTermId:
      row.academicTermId,

    gradeId:
      row.gradeId,

    subjectId:
      row.subjectId,

    weeklyPeriods:
      row.weeklyPeriods,

    difficulty:
      row.difficulty,

    maxMark:
      row.maxMark,

    passingMark:
      row.passingMark,

    isFailingSubject:
      row.isFailingSubject,

    weightInTotal:
      row.weightInTotal,

    maxPeriodsPerDay:
      row.maxPeriodsPerDay,

    avoidFirstPeriod:
      row.avoidFirstPeriod,

    avoidLastPeriod:
      row.avoidLastPeriod,

    preferredPeriodIndexes:
      row.preferredPeriodIndexes.map(
        String,
      ),
  };
}

export function buildCreateGradeSubjectPayload(
  values: FormValues,
): CreateGradeSubjectPayload {
  return {
    academicYearId:
      String(
        values.academicYearId ?? "",
      ),

    academicTermId:
      String(
        values.academicTermId ?? "",
      ),

    gradeId:
      String(
        values.gradeId ?? "",
      ),

    subjectId:
      String(
        values.subjectId ?? "",
      ),

    weeklyPeriods:
      Number(
        values.weeklyPeriods,
      ),

    difficulty:
      values.difficulty as
        CreateGradeSubjectPayload["difficulty"],

    maxMark:
      Number(
        values.maxMark,
      ),

    passingMark:
      Number(
        values.passingMark,
      ),

    isFailingSubject:
      Boolean(
        values.isFailingSubject,
      ),

    weightInTotal:
      Number(
        values.weightInTotal,
      ),

    maxPeriodsPerDay:
      Number(
        values.maxPeriodsPerDay,
      ),

    avoidFirstPeriod:
      Boolean(
        values.avoidFirstPeriod,
      ),

    avoidLastPeriod:
      Boolean(
        values.avoidLastPeriod,
      ),

    preferredPeriodIndexes:
      toNumberArray(
        values.preferredPeriodIndexes,
      ),
  };
}

export function buildUpdateGradeSubjectPayload(
  values: FormValues,
): UpdateGradeSubjectPayload {
  return {
    academicYearId:
      String(
        values.academicYearId ?? "",
      ),

    academicTermId:
      String(
        values.academicTermId ?? "",
      ),

    gradeId:
      String(
        values.gradeId ?? "",
      ),

    subjectId:
      String(
        values.subjectId ?? "",
      ),

    weeklyPeriods:
      Number(
        values.weeklyPeriods,
      ),

    difficulty:
      values.difficulty as
        UpdateGradeSubjectPayload["difficulty"],

    maxMark:
      Number(
        values.maxMark,
      ),

    passingMark:
      Number(
        values.passingMark,
      ),

    isFailingSubject:
      Boolean(
        values.isFailingSubject,
      ),

    weightInTotal:
      Number(
        values.weightInTotal,
      ),

    maxPeriodsPerDay:
      Number(
        values.maxPeriodsPerDay,
      ),

    avoidFirstPeriod:
      Boolean(
        values.avoidFirstPeriod,
      ),

    avoidLastPeriod:
      Boolean(
        values.avoidLastPeriod,
      ),

    preferredPeriodIndexes:
      toNumberArray(
        values.preferredPeriodIndexes,
      ),
  };
}