import { useMemo } from "react";

import { useAcademicStages } from "@/features/settings/academic/hooks/useAcademicSettings";

import { CrudPage } from "../../shared/components/CrudPage";
import { gradeApi } from "../api/grade.api";
import {
  useCreateGrade,
  useDeleteGrade,
  useGrades,
  useUpdateGrade,
} from "../hooks/useGrades";
import type {
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "../types/grade.types";

const stageLabels = {
  primary: "Primary",
  middle: "Middle",
  secondary: "Secondary",
} as const;

export function GradesPage() {
  const gradesQuery = useGrades();
  const stagesQuery = useAcademicStages();

  const createMutation = useCreateGrade();
  const updateMutation = useUpdateGrade();
  const deleteMutation = useDeleteGrade();

  const stageOptions = useMemo(
    () =>
      (stagesQuery.data ?? []).map((stage) => ({
        value: String(stage.id),
        label: stageLabels[stage.type],
      })),
    [stagesQuery.data],
  );

  const stageNameById = useMemo(
    () =>
      new Map(
        stageOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [stageOptions],
  );

  return (
    <CrudPage<Grade, CreateGradePayload, UpdateGradePayload>
      title="Grades"
      description="Manage school grades and connect each grade to an academic stage."
      addLabel="Add Grade"
      rows={gradesQuery.data ?? []}
      isLoading={gradesQuery.isLoading || stagesQuery.isLoading}
      isError={gradesQuery.isError || stagesQuery.isError}
      onRetry={() => {
        void Promise.all([
          gradesQuery.refetch(),
          stagesQuery.refetch(),
        ]);
      }}
      loadEntity={gradeApi.getById}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      fields={[
        {
          name: "academicStageId",
          label: "Academic Stage",
          type: "select",
          options: stageOptions,
          defaultValue: stageOptions[0]?.value ?? "",
          required: true,
        },
        {
          name: "name",
          label: "Grade Name",
          type: "text",
          defaultValue: "",
          required: true,
          helperText:
            "Do not enter the level separately; the backend calculates it from the grade name.",
        },
        {
          name: "isGraduationGrade",
          label: "Graduation Grade",
          type: "checkbox",
          defaultValue: false,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Grade",
          render: (row) => (
            <span className="font-bold">{row.name}</span>
          ),
        },
        {
          key: "stage",
          header: "Academic Stage",
          render: (row) =>
            stageNameById.get(String(row.academicStageId)) ??
            `Stage ${row.academicStageId}`,
        },
        {
          key: "level",
          header: "Level",
          render: (row) => row.level,
        },
        {
          key: "graduation",
          header: "Graduation",
          render: (row) =>
            row.isGraduationGrade ? "Yes" : "No",
        },
      ]}
      toFormValues={(row) => ({
        academicStageId: String(row.academicStageId),
        name: row.name,
        isGraduationGrade: row.isGraduationGrade,
      })}
      buildPayload={(values) => ({
        academicStageId: Number(values.academicStageId),
        name: String(values.name ?? "").trim(),
        isGraduationGrade: Boolean(values.isGraduationGrade),
      })}
      buildUpdatePayload={(values, row) => {
        const payload: UpdateGradePayload = {};

        const academicStageId = Number(values.academicStageId);
        const name = String(values.name ?? "").trim();
        const isGraduationGrade = Boolean(
          values.isGraduationGrade,
        );

        if (academicStageId !== Number(row.academicStageId)) {
          payload.academicStageId = academicStageId;
        }

        if (name !== row.name) {
          payload.name = name;
        }

        if (isGraduationGrade !== row.isGraduationGrade) {
          payload.isGraduationGrade = isGraduationGrade;
        }

        return payload;
      }}
      emptyTitle="No grades found"
      emptyDescription="Create the first grade and connect it to an existing academic stage."
      deleteTitle="Delete grade?"
      deleteDescription={(row) =>
        `The grade "${row.name}" will be permanently deleted.`
      }
    />
  );
}
