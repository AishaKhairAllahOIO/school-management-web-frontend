import type {
  AssessmentComponent,
} from "../types/assessment-component.types";

import {
  getAssessmentTypeLabel,
  getOptionLabel,
  type AssessmentSelectOption,
} from "../utils/assessment-component.options";

type CreateAssessmentComponentColumnsParams = {
  gradeSubjectOptions: AssessmentSelectOption[];
};

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    },
  ).format(value);
}

export function createAssessmentComponentColumns({
  gradeSubjectOptions,
}: CreateAssessmentComponentColumnsParams) {
  return [
    {
      key: "name",
      header: "Assessment",

      render: (
        row: AssessmentComponent,
      ) => row.name,
    },

    {
      key: "gradeSubjectId",
      header: "Subject",

      render: (
        row: AssessmentComponent,
      ) =>
        getOptionLabel(
          gradeSubjectOptions,
          row.gradeSubjectId,
        ),
    },

    {
      key: "type",
      header: "Type",

      render: (
        row: AssessmentComponent,
      ) =>
        getAssessmentTypeLabel(
          row.type,
        ),
    },

    {
      key: "maxMark",
      header: "Max Mark",

      render: (
        row: AssessmentComponent,
      ) =>
        formatNumber(row.maxMark),
    },

    {
      key: "weightPercentage",
      header: "Weight",

      render: (
        row: AssessmentComponent,
      ) =>
        `${formatNumber(
          row.weightPercentage,
        )}%`,
    },
  ];
}