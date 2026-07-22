import {
  CrudPage,
} from "../../shared/components/CrudPage";

import {
  useGradeSubjects,
} from "../../grade-subjects/hooks/useGradeSubjects";

import {
  assessmentComponentApi,
} from "../api/assessment-component.api";

import {
  createAssessmentComponentColumns,
} from "../config/assessment-component.columns";

import {
  createAssessmentComponentFields,
} from "../config/assessment-component.fields";

import {
  useAssessmentComponents,
  useCreateAssessmentComponent,
  useDeleteAssessmentComponent,
  useUpdateAssessmentComponent,
} from "../hooks/useAssessmentComponents";

import type {
  AssessmentComponent,
  CreateAssessmentComponentPayload,
  UpdateAssessmentComponentPayload,
} from "../types/assessment-component.types";

import {
  createGradeSubjectOptions,
  getAssessmentTypeLabel,
  getOptionLabel,
} from "../utils/assessment-component.options";

import {
  buildCreateAssessmentComponentPayload,
  buildUpdateAssessmentComponentPayload,
  toAssessmentComponentFormValues,
} from "../utils/assessment-component.payload";

export function AssessmentComponentsPage() {
  const assessmentsQuery =
    useAssessmentComponents();

  const gradeSubjectsQuery =
    useGradeSubjects();

  const createAssessmentMutation =
    useCreateAssessmentComponent();

  const updateAssessmentMutation =
    useUpdateAssessmentComponent();

  const deleteAssessmentMutation =
    useDeleteAssessmentComponent();

  const rows =
    assessmentsQuery.data ?? [];

  const gradeSubjectOptions =
    createGradeSubjectOptions(
      gradeSubjectsQuery.data ?? [],
    );

  const fields =
    createAssessmentComponentFields({
      gradeSubjectOptions,
    });

  const columns =
    createAssessmentComponentColumns({
      gradeSubjectOptions,
    });

  const isLoading =
    assessmentsQuery.isLoading ||
    gradeSubjectsQuery.isLoading;

  const isError =
    assessmentsQuery.isError ||
    gradeSubjectsQuery.isError;

  function retryAll() {
    void Promise.all([
      assessmentsQuery.refetch(),
      gradeSubjectsQuery.refetch(),
    ]);
  }

  return (
    <CrudPage<
      AssessmentComponent,
      CreateAssessmentComponentPayload,
      UpdateAssessmentComponentPayload
    >
      title="Assessment Components"
      description="Configure exams, quizzes, homework, oral assessments, and participation for each subject."
      addLabel="Add Component"

      rows={rows}

      loadEntity={(id: string) =>
        assessmentComponentApi.getDetails(
          id,
        )
      }

      isLoading={isLoading}
      isError={isError}
      onRetry={retryAll}

      createMutation={
        createAssessmentMutation
      }

      updateMutation={
        updateAssessmentMutation
      }

      deleteMutation={
        deleteAssessmentMutation
      }

      fields={fields}
      columns={columns}

      toFormValues={
        toAssessmentComponentFormValues
      }

      buildPayload={
        buildCreateAssessmentComponentPayload
      }

      buildUpdatePayload={
        buildUpdateAssessmentComponentPayload
      }

      emptyTitle={
        "No assessment components found"
      }

      emptyDescription={
        "Add the first assessment component to a subject."
      }

      deleteTitle={
        "Delete assessment component?"
      }

      deleteDescription={(
        row: AssessmentComponent,
      ) => {
        const subjectLabel =
          getOptionLabel(
            gradeSubjectOptions,
            row.gradeSubjectId,
          );

        const typeLabel =
          getAssessmentTypeLabel(
            row.type,
          );

        return `The "${row.name}" ${typeLabel} assessment for "${subjectLabel}" will be permanently deleted.`;
      }}

      searchPlaceholder={
        "Search assessments..."
      }
    />
  );
}