import { useMemo } from "react";
import { GraduationCap } from "lucide-react";
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
    searchableText: (row) =>
      row.name,
    render: (row) => (
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center",
            "justify-center rounded-2xl",
            "border border-primary/15",
            "bg-primary/10 text-primary",
          ].join(" ")}
        >
          <GraduationCap size={17} />
        </span>

        <div>
          <p className="font-extrabold text-foreground">
            {row.name}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
            Grade record
          </p>
        </div>
      </div>
    ),
  },

  {
    key: "stage",
    header: "Academic Stage",
    searchableText: (row) =>
      stageNameById.get(
        String(row.academicStageId),
      ) ?? "",
    render: (row) => {
      const stageName =
        stageNameById.get(
          String(row.academicStageId),
        ) ??
        `Stage ${row.academicStageId}`;

      return (
        <span
          className={[
            "inline-flex items-center gap-2",
            "rounded-full border",
            "border-emerald-200",
            "bg-emerald-50 px-3 py-1.5",
            "text-xs font-bold text-emerald-700",
          ].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {stageName}
        </span>
      );
    },
  },

  {
    key: "level",
    header: "Level",
    align: "center",
    searchableText: (row) =>
      String(row.level),
    render: (row) => (
      <span
        className={[
          "inline-flex h-8 min-w-8 items-center",
          "justify-center rounded-xl",
          "border border-violet-200",
          "bg-violet-50 px-2.5",
          "text-xs font-extrabold text-violet-700",
        ].join(" ")}
      >
        {row.level}
      </span>
    ),
  },

  {
    key: "graduation",
    header: "Graduation",
    align: "center",
    searchableText: (row) =>
      row.isGraduationGrade
        ? "yes graduation"
        : "no",
    render: (row) =>
      row.isGraduationGrade ? (
        <span
          className={[
            "inline-flex items-center gap-1.5",
            "rounded-full border border-emerald-200",
            "bg-emerald-50 px-3 py-1.5",
            "text-xs font-bold text-emerald-700",
          ].join(" ")}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white">
            ✓
          </span>
          Yes
        </span>
      ) : (
        <span
          className={[
            "inline-flex items-center gap-1.5",
            "rounded-full border border-slate-200",
            "bg-slate-50 px-3 py-1.5",
            "text-xs font-bold text-slate-500",
          ].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          No
        </span>
      ),
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
