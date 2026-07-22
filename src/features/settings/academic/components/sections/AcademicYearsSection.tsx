import {
  CalendarDays,
  CircleCheck,
  History,
  Sparkles,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useCreateAcademicYear,
  useDeleteAcademicYear,
  useUpdateAcademicYear,
} from "../../hooks/useAcademicSettings";
import type { AcademicYear } from "../../types/academic-settings.types";
import { formatDateTime } from "../../utils/academic-settings.utils";

import { AcademicYearDialog } from "../dialogs/AcademicYearDialog";
import { ActionMenu } from "../shared/ActionMenu";
import {
  EntityTable,
  EntityTd,
  EntityTh,
} from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicYears: AcademicYear[];
};

export function AcademicYearsSection({
  academicYears,
}: Props) {
  const [dialogValue, setDialogValue] =
    useState<AcademicYear | "new" | null>(
      null,
    );

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const createYear =
    useCreateAcademicYear();

  const updateYear =
    useUpdateAcademicYear();

  const deleteYear =
    useDeleteAcademicYear();

  const currentYearsCount = useMemo(
    () =>
      academicYears.filter(
        (year) => year.isCurrent,
      ).length,
    [academicYears],
  );

  const latestYear =
    academicYears[0]?.name ?? "—";

  function handleDelete(
    year: AcademicYear,
  ) {
    const confirmed = window.confirm(
      `Delete academic year "${year.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteYear.mutate(year.id);
    setOpenMenuId(null);
  }

  return (
    <>
      <SectionHeader
        title="Academic Years"
        description="Create yearly periods and choose which one is currently active across the school."
        actionLabel="Add Year"
        onAction={() =>
          setDialogValue("new")
        }
      />

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Academic Year</EntityTh>
            <EntityTh>Start Date</EntityTh>
            <EntityTh>End Date</EntityTh>
            <EntityTh>Status</EntityTh>
            <EntityTh>Created</EntityTh>
            <EntityTh>Updated</EntityTh>

            <EntityTh align="right">
              Actions
            </EntityTh>
          </tr>
        </thead>

        <tbody>
          {academicYears.map((year) => (
            <tr key={year.id}>
              <EntityTd strong>
                {year.name}
              </EntityTd>

              <EntityTd>
                {year.startDate}
              </EntityTd>

              <EntityTd>
                {year.endDate}
              </EntityTd>

              <EntityTd>
                {year.isCurrent ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/[0.09] px-3 py-1.5 text-[11px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Current Year
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />

                    Previous
                  </span>
                )}
              </EntityTd>

              <EntityTd>
                {formatDateTime(
                  year.createdAt,
                )}
              </EntityTd>

              <EntityTd>
                {formatDateTime(
                  year.updatedAt,
                )}
              </EntityTd>

              <EntityTd align="right">
                <ActionMenu
                  isOpen={
                    openMenuId === year.id
                  }
                  onOpenChange={(open) =>
                    setOpenMenuId(
                      open
                        ? year.id
                        : null,
                    )
                  }
                  onEdit={() => {
                    setDialogValue(year);
                    setOpenMenuId(null);
                  }}
                  onDelete={() =>
                    handleDelete(year)
                  }
                />
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>

      {academicYears.length === 0 ? (
        <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No academic years yet
          </p>

          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Add the first academic year to begin
            configuring the school calendar.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <YearStat
          icon={<CalendarDays size={18} />}
          value={academicYears.length}
          label="Total Years"
          description="All saved periods"
        />

        <YearStat
          icon={<CircleCheck size={18} />}
          value={currentYearsCount}
          label="Current Year"
          description="Used across the system"
        />

        <YearStat
          icon={<History size={18} />}
          value={
            academicYears.length -
            currentYearsCount
          }
          label="Previous Years"
          description="Historical periods"
        />

        <YearStat
          icon={<Sparkles size={18} />}
          value={latestYear}
          label="Latest Entry"
          description="Most recently listed"
        />
      </div>

      {dialogValue ? (
        <AcademicYearDialog
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
              createYear.mutate(payload);
            } else {
              updateYear.mutate({
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

function YearStat({
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
        "relative overflow-hidden",
        "rounded-[20px]",
        "border border-border/60",
        "bg-card p-4",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:border-primary/15",
        "hover:shadow-[0_12px_30px_rgba(30,20,70,0.06)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/[0.075] text-primary">
          {icon}
        </span>

        <span className="h-14 w-14 rounded-full bg-primary/[0.025]" />
      </div>

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