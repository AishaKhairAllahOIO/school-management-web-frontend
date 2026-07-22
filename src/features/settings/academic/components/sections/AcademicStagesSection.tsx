import {
  GraduationCap,
  Layers3,
  Sparkles,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useCreateAcademicStage,
  useDeleteAcademicStage,
  useUpdateAcademicStage,
} from "../../hooks/useAcademicSettings";
import type { AcademicStage } from "../../types/academic-settings.types";
import {
  academicStageLabels,
  formatDateTime,
} from "../../utils/academic-settings.utils";

import { AcademicStageDialog } from "../dialogs/AcademicStageDialog";
import { ActionMenu } from "../shared/ActionMenu";
import {
  EntityTable,
  EntityTd,
  EntityTh,
} from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicStages: AcademicStage[];
};

export function AcademicStagesSection({
  academicStages,
}: Props) {
  const [dialogValue, setDialogValue] =
    useState<AcademicStage | "new" | null>(
      null,
    );

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const createStage =
    useCreateAcademicStage();

  const updateStage =
    useUpdateAcademicStage();

  const deleteStage =
    useDeleteAcademicStage();

  const latestStage = useMemo(
    () =>
      academicStages.length > 0
        ? academicStageLabels[
            academicStages[0].type
          ] ?? academicStages[0].type
        : "—",
    [academicStages],
  );

  function handleDelete(
    stage: AcademicStage,
  ) {
    const stageLabel =
      academicStageLabels[stage.type] ??
      stage.type;

    const confirmed = window.confirm(
      `Delete academic stage "${stageLabel}"?\n\nGrades connected to this stage may prevent deletion.`,
    );

    if (!confirmed) {
      return;
    }

    deleteStage.mutate(stage.id);
    setOpenMenuId(null);
  }

  return (
    <>
      <SectionHeader
        title="Academic Stages"
        description="Organize grade levels into clear school stages used across the academic structure."
        actionLabel="Add Stage"
        onAction={() =>
          setDialogValue("new")
        }
      />

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Stage</EntityTh>
            <EntityTh>Created</EntityTh>
            <EntityTh>Updated</EntityTh>

            <EntityTh align="right">
              Actions
            </EntityTh>
          </tr>
        </thead>

        <tbody>
          {academicStages.map((stage) => {
            const stageLabel =
              academicStageLabels[
                stage.type
              ] ?? stage.type;

            return (
              <tr key={stage.id}>
                <EntityTd strong>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.07] text-primary">
                      <GraduationCap
                        size={17}
                        strokeWidth={1.75}
                      />
                    </span>

                    <span>{stageLabel}</span>
                  </div>
                </EntityTd>

                <EntityTd>
                  {formatDateTime(
                    stage.createdAt,
                  )}
                </EntityTd>

                <EntityTd>
                  {formatDateTime(
                    stage.updatedAt,
                  )}
                </EntityTd>

                <EntityTd align="right">
                  <ActionMenu
                    isOpen={
                      openMenuId === stage.id
                    }
                    onOpenChange={(open) =>
                      setOpenMenuId(
                        open
                          ? stage.id
                          : null,
                      )
                    }
                    onEdit={() => {
                      setDialogValue(stage);
                      setOpenMenuId(null);
                    }}
                    onDelete={() =>
                      handleDelete(stage)
                    }
                  />
                </EntityTd>
              </tr>
            );
          })}
        </tbody>
      </EntityTable>

      {academicStages.length === 0 ? (
        <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
            <GraduationCap size={20} />
          </span>

          <p className="mt-4 text-sm font-medium text-foreground">
            No academic stages yet
          </p>

          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Add the first stage to begin organizing
            grade levels.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <StageStat
          icon={<Layers3 size={18} />}
          value={academicStages.length}
          label="Total Stages"
          description="Available school levels"
        />

        <StageStat
          icon={<Sparkles size={18} />}
          value={latestStage}
          label="Latest Entry"
          description="Most recently listed stage"
        />
      </div>

      {dialogValue ? (
        <AcademicStageDialog
          value={
            dialogValue === "new"
              ? null
              : dialogValue
          }
          onClose={() =>
            setDialogValue(null)
          }
          onSave={(payload) => {
            if (dialogValue === "new") {
              createStage.mutate(payload);
            } else {
              updateStage.mutate({
                id: dialogValue.id,
                payload,
              });
            }

            setDialogValue(null);
          }}
        />
      ) : null}
    </>
  );
}

function StageStat({
  value,
  label,
  description,
  icon,
}: {
  value: number | string;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-[20px]",
        "border border-border/60",
        "bg-card p-4",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:border-primary/15",
        "hover:shadow-[0_12px_30px_rgba(30,20,70,0.06)]",
      ].join(" ")}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/[0.075] text-primary">
        {icon}
      </span>

      <p className="mt-5 truncate text-xl font-semibold tracking-[-0.025em] text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-foreground">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-normal text-muted-foreground">
        {description}
      </p>
    </div>
  );
}