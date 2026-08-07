import type {
  CrudField,
} from "../../shared/components/CrudPage";

import type {
  AssessmentComponent,
} from "../types/assessment-component.types";

import {
  assessmentTypeOptions,
  type AssessmentSelectOption,
} from "../utils/assessment-component.options";

type CreateAssessmentComponentFieldsParams = {
  gradeSubjectOptions: AssessmentSelectOption[];
};

export function createAssessmentComponentFields({
  gradeSubjectOptions,
}: CreateAssessmentComponentFieldsParams): CrudField<AssessmentComponent>[] {

  return [
    {
      name: "gradeSubjectId",
      label: "Grade Subject",
      type: "select",
      required: true,
      options: gradeSubjectOptions,
      defaultValue: "Select a subject",
    },

    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: assessmentTypeOptions,
      defaultValue: "Select assessment type",
    },

    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      defaultValue: "Enter assessment name",
    },

    {
      name: "maxMark",
      label: "Max Mark",
      type: "number",
      required: true,
      min: 0,
      
      defaultValue: "Enter maximum mark",
    },

    {
      name: "weightPercentage",
      label: "Weight Percentage",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      
      defaultValue: "Enter weight percentage",
    },
  ];
}