import { useMemo } from "react";
import { Check, GraduationCap, Minus } from "lucide-react";

import { CrudPage } from "../../shared/components/CrudPage";
import { gradeApi } from "../api/grade.api";
import {
  useAcademicStagesWithGrades,
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

const gradeLabels: Record<string, string> = {
  first: "First Grade",
  second: "Second Grade",
  third: "Third Grade",
  fourth: "Fourth Grade",
  fifth: "Fifth Grade",
  sixth: "Sixth Grade",
  seventh: "Seventh Grade",
  eighth: "Eighth Grade",
  ninth: "Ninth Grade",
  tenth: "Tenth Grade",
  eleventh: "Eleventh Grade",
  twelfth: "Twelfth Grade",
};

function formatGradeLabel(key: string) {
  return gradeLabels[key] ?? key;
}

export function GradesPage() {
  const gradesQuery = useGrades();
  const stagesQuery = useAcademicStagesWithGrades();

  const createMutation = useCreateGrade();
  const updateMutation = useUpdateGrade();
  const deleteMutation = useDeleteGrade();

  const grades = gradesQuery.data ?? [];
  const stages = stagesQuery.data ?? [];

  const stageOptions = useMemo(
    () =>
      stages.map((stage) => ({
        value: stage.id,
        label: stage.displayLabel,
      })),
    [stages],
  );

  const stageNameById = useMemo(
    () =>
      new Map(
        stages.map((stage) => [stage.id, stage.displayLabel]),
      ),
    [stages],
  );

  const stageById = useMemo(
    () => new Map(stages.map((stage) => [stage.id, stage])),
    [stages],
  );

  const usedGradeNamesByStage = useMemo(() => {
    const map = new Map<string, Set<string>>();

    for (const grade of grades) {
      const stageId = String(grade.academicStageId);
      const usedNames = map.get(stageId) ?? new Set<string>();
      usedNames.add(grade.name);
      map.set(stageId, usedNames);
    }

    return map;
  }, [grades]);

  return (
    <CrudPage<Grade, CreateGradePayload, UpdateGradePayload>
      title="Grades"
      description="Add only the grades supported by each academic stage configured for this school."
      addLabel="Add Grade"
      rows={grades}
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
          defaultValue: "",
          required: true,
          resetFieldsOnChange: ["name"],
        },
        {
          name: "name",
          label: "Grade",
          type: "select",
          defaultValue: "",
          required: true,
          disabled: (values) => !String(values.academicStageId ?? ""),
          options: (values) => {
            const stageId = String(values.academicStageId ?? "");
            const selectedStage = stageById.get(stageId);
            const currentName = String(values.name ?? "");
            const usedNames = usedGradeNamesByStage.get(stageId) ?? new Set();

            return (selectedStage?.grades ?? [])
              .filter(
                (grade) =>
                  grade.key === currentName ||
                  !usedNames.has(grade.key),
              )
              .map((grade) => ({
                value: grade.key,
                label: formatGradeLabel(grade.key),
              }));
          },
        },
        {
          name: "isGraduationGrade",
          label: "Graduation Grade",
          type: "checkbox",
          defaultValue: false,
          full: true,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Grade",
          searchableText: (row) =>
            `${row.name} ${gradeLabels[row.name] ?? ""}`,
          render: (row) => (
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)] shadow-[var(--shadow-soft)]">
                <GraduationCap size={18} strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.01em] text-foreground">
                  {gradeLabels[row.name] ?? row.name}
                </p>
                <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                  {row.name}
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
              "Unknown stage";

            return (
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--academic-accent)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground/85">
                    {stageName}
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
        if (name !== row.name) payload.name = name;
        if (isGraduationGrade !== row.isGraduationGrade) {
          payload.isGraduationGrade = isGraduationGrade;
        }

        return payload;
      }}
      emptyTitle="No grades found"
      emptyDescription="Add a grade from one of the academic stages enabled for this school."
      deleteTitle="Delete grade?"
      deleteDescription={(row) =>
        `The grade "${gradeLabels[row.name] ?? row.name}" will be permanently deleted.`
      }
    />
  );
}
