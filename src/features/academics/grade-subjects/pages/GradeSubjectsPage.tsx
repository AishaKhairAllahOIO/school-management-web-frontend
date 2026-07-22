import {
  CrudPage,
} from "../../shared/components/CrudPage";

import {
  useAcademicTerms,
  useAcademicYears,
} from "../../../settings/academic/hooks/useAcademicSettings";

import {
  useGrades,
} from "../../grades/hooks/useGrades";

import {
  useSubjects,
} from "../../subjects/hooks/useSubjects";

import {
  gradeSubjectApi,
} from "../api/gradeSubject.api";

import {
  createGradeSubjectColumns,
} from "../config/gradeSubjectColumns";

import {
  createGradeSubjectFields,
} from "../config/gradeSubjectFields";

import {
  useCreateGradeSubject,
  useDeleteGradeSubject,
  useGradeSubjects,
  useUpdateGradeSubject,
} from "../hooks/useGradeSubjects";

import type {
  CreateGradeSubjectPayload,
  GradeSubject,
  UpdateGradeSubjectPayload,
} from "../types/grade-subject.types";

import {
  createOptions,
  createPreferredPeriodOptions,
  getOptionLabel,
  type NamedRecord,
} from "../utils/gradeSubjectOptions";

import {
  buildCreateGradeSubjectPayload,
  buildUpdateGradeSubjectPayload,
  toGradeSubjectFormValues,
} from "../utils/gradeSubjectPayload";

export function GradeSubjectsPage() {
  const gradeSubjectsQuery =
    useGradeSubjects();

  const academicYearsQuery =
    useAcademicYears();

  const academicTermsQuery =
    useAcademicTerms();

  const gradesQuery =
    useGrades();

  const subjectsQuery =
    useSubjects();

  const createGradeSubject =
    useCreateGradeSubject();

  const updateGradeSubject =
    useUpdateGradeSubject();

  const deleteGradeSubject =
    useDeleteGradeSubject();

  const rows =
    gradeSubjectsQuery.data ?? [];

  const academicYearOptions =
    createOptions(
      (
        academicYearsQuery.data ??
        []
      ) as NamedRecord[],
    );

  const academicTermOptions =
    createOptions(
      (
        academicTermsQuery.data ??
        []
      ) as NamedRecord[],
    );

  const gradeOptions =
    createOptions(
      (
        gradesQuery.data ??
        []
      ) as NamedRecord[],
    );

  const subjectOptions =
    createOptions(
      (
        subjectsQuery.data ??
        []
      ) as NamedRecord[],
    );

  const preferredPeriodOptions =
    createPreferredPeriodOptions(10);

  const fields =
    createGradeSubjectFields({
      academicYearOptions,
      academicTermOptions,
      gradeOptions,
      subjectOptions,
      preferredPeriodOptions,
    });

  const columns =
    createGradeSubjectColumns({
      academicYearOptions,
      academicTermOptions,
      gradeOptions,
      subjectOptions,
    });

  const isLoading =
    gradeSubjectsQuery.isLoading ||
    academicYearsQuery.isLoading ||
    academicTermsQuery.isLoading ||
    gradesQuery.isLoading ||
    subjectsQuery.isLoading;

  const isError =
    gradeSubjectsQuery.isError ||
    academicYearsQuery.isError ||
    academicTermsQuery.isError ||
    gradesQuery.isError ||
    subjectsQuery.isError;

  function retryAll() {
    void Promise.all([
      gradeSubjectsQuery.refetch(),
      academicYearsQuery.refetch(),
      academicTermsQuery.refetch(),
      gradesQuery.refetch(),
      subjectsQuery.refetch(),
    ]);
  }

  return (
    <CrudPage<
      GradeSubject,
      CreateGradeSubjectPayload,
      UpdateGradeSubjectPayload
    >
      title="Grade Subjects"
      description="Configure subjects for each grade, academic year, term, marks, and scheduling constraints."
      addLabel="Add Grade Subject"

      rows={rows}

      loadEntity={(
        id: string,
      ) =>
        gradeSubjectApi.getDetails(id)
      }

      isLoading={isLoading}
      isError={isError}
      onRetry={retryAll}

      createMutation={
        createGradeSubject
      }

      updateMutation={
        updateGradeSubject
      }

      deleteMutation={
        deleteGradeSubject
      }

      fields={fields}

      columns={columns}

      toFormValues={
        toGradeSubjectFormValues
      }

      buildPayload={
        buildCreateGradeSubjectPayload
      }

      buildUpdatePayload={
        buildUpdateGradeSubjectPayload
      }

      emptyTitle={
        "No grade subjects found"
      }

      emptyDescription={
        "Assign the first subject to a grade and academic term."
      }

      deleteTitle={
        "Delete grade subject?"
      }

      deleteDescription={(
        row: GradeSubject,
      ) => {
        const subjectName =
          row.subjectName ||
          getOptionLabel(
            subjectOptions,
            row.subjectId,
          );

        const gradeName =
          getOptionLabel(
            gradeOptions,
            row.gradeId,
          );

        return `The assignment of "${subjectName}" to "${gradeName}" will be permanently deleted.`;
      }}

      searchPlaceholder={
        "Search grade subjects..."
      }
    />
  );
}