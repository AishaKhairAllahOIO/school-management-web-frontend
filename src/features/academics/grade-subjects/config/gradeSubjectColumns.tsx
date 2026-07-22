import type {
  GradeSubject,
} from "../types/grade-subject.types";

import {
  getOptionLabel,
  type SelectOption,
} from "../utils/gradeSubjectOptions";

type CreateGradeSubjectColumnsOptions = {
  academicYearOptions:
    SelectOption[];

  academicTermOptions:
    SelectOption[];

  gradeOptions:
    SelectOption[];

  subjectOptions:
    SelectOption[];
};

export function createGradeSubjectColumns({
  academicYearOptions,
  academicTermOptions,
  gradeOptions,
  subjectOptions,
}: CreateGradeSubjectColumnsOptions) {
  return [
    {
      key: "academicYear",
      header: "Academic Year",

      render: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          academicYearOptions,
          row.academicYearId,
        ),

      searchableText: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          academicYearOptions,
          row.academicYearId,
        ),
    },

    {
      key: "academicTerm",
      header: "Term",

      render: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          academicTermOptions,
          row.academicTermId,
        ),

      searchableText: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          academicTermOptions,
          row.academicTermId,
        ),
    },

    {
      key: "grade",
      header: "Grade",

      render: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          gradeOptions,
          row.gradeId,
        ),

      searchableText: (
        row: GradeSubject,
      ) =>
        getOptionLabel(
          gradeOptions,
          row.gradeId,
        ),
    },

    {
      key: "subject",
      header: "Subject",

      render: (
        row: GradeSubject,
      ) =>
        row.subjectName ||
        getOptionLabel(
          subjectOptions,
          row.subjectId,
        ),

      searchableText: (
        row: GradeSubject,
      ) =>
        row.subjectName ||
        getOptionLabel(
          subjectOptions,
          row.subjectId,
        ),
    },

    {
      key: "weeklyPeriods",
      header: "Weekly",

      render: (
        row: GradeSubject,
      ) =>
        row.weeklyPeriods,
    },

    {
      key: "difficulty",
      header: "Difficulty",

      render: (
        row: GradeSubject,
      ) =>
        row.difficulty,
    },

    {
      key: "maxMark",
      header: "Maximum",

      render: (
        row: GradeSubject,
      ) =>
        row.maxMark,
    },

    {
      key: "passingMark",
      header: "Passing",

      render: (
        row: GradeSubject,
      ) =>
        row.passingMark,
    },
  ];
}