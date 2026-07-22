import type {
  SelectOption,
} from "../utils/gradeSubjectOptions";

type CreateGradeSubjectFieldsOptions = {
  academicYearOptions:
    SelectOption[];

  academicTermOptions:
    SelectOption[];

  gradeOptions:
    SelectOption[];

  subjectOptions:
    SelectOption[];

  preferredPeriodOptions:
    SelectOption[];
};

export function createGradeSubjectFields({
  academicYearOptions,
  academicTermOptions,
  gradeOptions,
  subjectOptions,
  preferredPeriodOptions,
}: CreateGradeSubjectFieldsOptions) {
  return [
    {
      name: "academicYearId",
      label: "Academic Year",
      type: "select" as const,
      defaultValue: "",
      options:
        academicYearOptions,
      required: true,
    },

    {
      name: "academicTermId",
      label: "Academic Term",
      type: "select" as const,
      defaultValue: "",
      options:
        academicTermOptions,
      required: true,
    },

    {
      name: "gradeId",
      label: "Grade",
      type: "select" as const,
      defaultValue: "",
      options:
        gradeOptions,
      required: true,
    },

    {
      name: "subjectId",
      label: "Subject",
      type: "select" as const,
      defaultValue: "",
      options:
        subjectOptions,
      required: true,
    },

    {
      name: "weeklyPeriods",
      label: "Weekly Periods",
      type: "number" as const,
      defaultValue: 1,
      required: true,
      min: 1,
    },

    {
      name: "difficulty",
      label: "Difficulty",
      type: "select" as const,
      defaultValue: "medium",
      required: true,

      options: [
        {
          label: "Light",
          value: "light",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Heavy",
          value: "heavy",
        },
      ],
    },

    {
      name: "maxMark",
      label: "Maximum Mark",
      type: "number" as const,
      defaultValue: 100,
      required: true,
      min: 0,
    },

    {
      name: "passingMark",
      label: "Passing Mark",
      type: "number" as const,
      defaultValue: 50,
      required: true,
      min: 0,
    },

    {
      name: "isFailingSubject",
      label: "Failing Subject",
      type: "checkbox" as const,
      defaultValue: false,
    },

    {
      name: "weightInTotal",
      label: "Weight In Total",
      type: "number" as const,
      defaultValue: 1,
      required: true,
      min: 0,
    },

    {
      name: "maxPeriodsPerDay",
      label:
        "Maximum Periods Per Day",
      type: "number" as const,
      defaultValue: 1,
      required: true,
      min: 1,
    },

    {
      name: "avoidFirstPeriod",
      label: "Avoid First Period",
      type: "checkbox" as const,
      defaultValue: false,
    },

    {
      name: "avoidLastPeriod",
      label: "Avoid Last Period",
      type: "checkbox" as const,
      defaultValue: false,
    },

    {
      name:
        "preferredPeriodIndexes",
      label: "Preferred Periods",
      type: "array" as const,
      defaultValue: [],
      options:
        preferredPeriodOptions,
      full: true,
    },
  ];
}