import {
  CrudPage,
  type FormValues,
} from "../../shared/components/CrudPage";

import {
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from "../hooks/useSubjects";

import type {
  CreateSubjectPayload,
  Subject,
  UpdateSubjectPayload,
} from "../types/subject.types";

export function SubjectsPage() {
  const subjectsQuery =
    useSubjects();

  const createSubject =
    useCreateSubject();

  const updateSubject =
    useUpdateSubject();

  const deleteSubject =
    useDeleteSubject();

  const rows =
    subjectsQuery.data ?? [];

  return (
    <CrudPage<
      Subject,
      CreateSubjectPayload,
      UpdateSubjectPayload
    >
      title="Subjects"
      description="Manage the subject catalog used by grade subjects."
      addLabel="Add Subject"

      rows={rows}

      isLoading={
        subjectsQuery.isLoading
      }

      isError={
        subjectsQuery.isError
      }

      onRetry={() => {
        void subjectsQuery.refetch();
      }}

      createMutation={
        createSubject
      }

      updateMutation={
        updateSubject
      }

      deleteMutation={
        deleteSubject
      }

      fields={[
        {
          name: "name",
          label: "Subject Name",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ]}

      columns={[
        {
          key: "name",
          header: "Name",

          render: (
            row: Subject,
          ) => row.name,

          searchableText: (
            row: Subject,
          ) => row.name,
        },
      ]}

      toFormValues={(
        row: Subject,
      ) => ({
        name: row.name,
      })}

      buildPayload={(
        values: FormValues,
      ): CreateSubjectPayload => ({
        name: String(
          values.name ?? "",
        ).trim(),
      })}

      buildUpdatePayload={(
        values: FormValues,
      ): UpdateSubjectPayload => ({
        name: String(
          values.name ?? "",
        ).trim(),
      })}

      emptyTitle="No subjects found"
      emptyDescription="Create the first subject to start configuring grade subjects."

      deleteTitle="Delete subject?"

      deleteDescription={(
        row: Subject,
      ) =>
        `The subject "${row.name}" will be permanently deleted.`
      }

      searchPlaceholder="Search subjects..."
    />
  );
}