import { useMemo } from "react";
import { Check, GraduationCap, Minus } from "lucide-react";
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
        stageOptions.map((option) => [option.value, option.label]),
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
        void Promise.all([gradesQuery.refetch(), stagesQuery.refetch()]);
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
          searchableText: (row) => row.name,
          render: (row) => (
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)] shadow-[var(--shadow-soft)]">
                <GraduationCap size={18} strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.01em] text-foreground">
                  {row.name}
                </p>
                <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
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
            stageNameById.get(String(row.academicStageId)) ?? "",
          render: (row) => {
            const stageName =
              stageNameById.get(String(row.academicStageId)) ??
              `Stage ${row.academicStageId}`;

            return (
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--academic-accent)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground/85">
                    {stageName}
                  </p>
                  <p className="mt-0.5 text-[10px] font-normal text-muted-foreground/80">
                    Academic stage
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          key: "level",
          header: "Level",
          searchableText: (row) => String(row.level),
          render: (row) => (
            <div>
              <p className="text-[15px] font-semibold text-[var(--academic-accent)]">
                {row.level}
              </p>
              <p className="mt-0.5 text-[10px] font-normal text-muted-foreground/80">
                Grade level
              </p>
            </div>
          ),
        },
        {
          key: "graduation",
          header: "Graduation",
          searchableText: (row) =>
            row.isGraduationGrade ? "yes graduation" : "no",
          render: (row) => (
            <div className="flex items-center gap-2.5">
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]",
                  row.isGraduationGrade
                    ? "bg-emerald-500/[0.09] text-emerald-600"
                    : "bg-muted/60 text-muted-foreground",
                ].join(" ")}
              >
                {row.isGraduationGrade ? (
                  <Check size={14} strokeWidth={2.4} />
                ) : (
                  <Minus size={14} strokeWidth={2.2} />
                )}
              </span>

              <div>
                <p
                  className={[
                    "text-sm font-medium",
                    row.isGraduationGrade
                      ? "text-emerald-700"
                      : "text-foreground/70",
                  ].join(" ")}
                >
                  {row.isGraduationGrade ? "Graduating" : "Not graduating"}
                </p>
                <p className="mt-0.5 text-[10px] font-normal text-muted-foreground/80">
                  Graduation status
                </p>
              </div>
            </div>
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
        const isGraduationGrade = Boolean(values.isGraduationGrade);

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
