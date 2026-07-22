import {
  CalendarRange,
  Check,
  Flag,
  Layers3,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useCreateAcademicTerm,
  useDeleteAcademicTerm,
  useUpdateAcademicTerm,
} from "../../hooks/useAcademicSettings";
import type {
  AcademicTerm,
  AcademicYear,
} from "../../types/academic-settings.types";
import { formatDateTime } from "../../utils/academic-settings.utils";

import { AcademicTermDialog } from "../dialogs/AcademicTermDialog";
import { ActionMenu } from "../shared/ActionMenu";
import {
  EntityTable,
  EntityTd,
  EntityTh,
} from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicYears: AcademicYear[];
  academicTerms: AcademicTerm[];
  currentAcademicYearId: string;
};

export function AcademicTermsSection({
  academicYears,
  academicTerms,
  currentAcademicYearId,
}: Props) {
  const [selectedYearId, setSelectedYearId] =
    useState(
      currentAcademicYearId ||
        academicYears[0]?.id ||
        "",
    );

  const [dialogValue, setDialogValue] =
    useState<AcademicTerm | "new" | null>(
      null,
    );

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const createTerm =
    useCreateAcademicTerm();

  const updateTerm =
    useUpdateAcademicTerm();

  const deleteTerm =
    useDeleteAcademicTerm();

  const filteredTerms = useMemo(
    () =>
      academicTerms
        .filter(
          (item) =>
            item.academicYearId ===
            selectedYearId,
        )
        .sort(
          (firstTerm, secondTerm) =>
            firstTerm.order -
            secondTerm.order,
        ),
    [academicTerms, selectedYearId],
  );

  const selectedYear = useMemo(
    () =>
      academicYears.find(
        (year) =>
          year.id === selectedYearId,
      ),
    [academicYears, selectedYearId],
  );

  const currentTermsCount = useMemo(
    () =>
      filteredTerms.filter(
        (term) => term.isCurrent,
      ).length,
    [filteredTerms],
  );

  const finalTermsCount = useMemo(
    () =>
      filteredTerms.filter(
        (term) => term.isFinalTerm,
      ).length,
    [filteredTerms],
  );

  function handleDelete(
    term: AcademicTerm,
  ) {
    const semesterLabel =
      term.semesterName.replaceAll(
        "_",
        " ",
      );

    const confirmed = window.confirm(
      `Delete "${semesterLabel}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteTerm.mutate(term.id);
    setOpenMenuId(null);
  }

  return (
    <>
      <SectionHeader
        title="Academic Terms"
        description="Arrange semesters within each academic year and mark the current or final term."
        actionLabel="Add Term"
        onAction={() =>
          setDialogValue("new")
        }
      >
        <div className="mt-5 max-w-md">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-foreground">
              Academic Year
            </span>

            <div className="relative">
              <select
                value={selectedYearId}
                onChange={(event) =>
                  setSelectedYearId(
                    event.target.value,
                  )
                }
                disabled={
                  academicYears.length === 0
                }
                className={[
                  "h-11 w-full appearance-none",
                  "rounded-[14px]",
                  "border border-border/75",
                  "bg-background px-4 pr-10",
                  "text-sm font-normal",
                  "text-foreground outline-none",
                  "transition-all",
                  "focus:border-primary/40",
                  "focus:ring-4",
                  "focus:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",
                ].join(" ")}
              >
                {academicYears.length === 0 ? (
                  <option value="">
                    No academic years available
                  </option>
                ) : null}

                {academicYears.map((year) => (
                  <option
                    key={year.id}
                    value={year.id}
                  >
                    {year.name}
                  </option>
                ))}
              </select>

              <CalendarRange
                size={16}
                strokeWidth={1.75}
                className={[
                  "pointer-events-none absolute",
                  "right-3 top-1/2",
                  "-translate-y-1/2",
                  "text-muted-foreground",
                ].join(" ")}
              />
            </div>
          </label>
        </div>
      </SectionHeader>

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Semester</EntityTh>
            <EntityTh>Order</EntityTh>
            <EntityTh>Start Date</EntityTh>
            <EntityTh>End Date</EntityTh>
            <EntityTh>Current</EntityTh>
            <EntityTh>Final</EntityTh>
            <EntityTh>Created</EntityTh>
            <EntityTh>Updated</EntityTh>

            <EntityTh align="right">
              Actions
            </EntityTh>
          </tr>
        </thead>

        <tbody>
          {filteredTerms.map((term) => (
            <tr key={term.id}>
              <EntityTd strong>
                {term.semesterName.replaceAll(
                  "_",
                  " ",
                )}
              </EntityTd>

              <EntityTd>
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/[0.07] px-2 text-xs font-medium text-primary">
                  {term.order}
                </span>
              </EntityTd>

              <EntityTd>
                {term.startDate}
              </EntityTd>

              <EntityTd>
                {term.endDate}
              </EntityTd>

              <EntityTd>
                {term.isCurrent ? (
                  <StatusBadge
                    label="Current"
                    tone="success"
                  />
                ) : (
                  <MutedValue />
                )}
              </EntityTd>

              <EntityTd>
                {term.isFinalTerm ? (
                  <StatusBadge
                    label="Final"
                    tone="primary"
                  />
                ) : (
                  <MutedValue />
                )}
              </EntityTd>

              <EntityTd>
                {formatDateTime(
                  term.createdAt,
                )}
              </EntityTd>

              <EntityTd>
                {formatDateTime(
                  term.updatedAt,
                )}
              </EntityTd>

              <EntityTd align="right">
                <ActionMenu
                  isOpen={
                    openMenuId === term.id
                  }
                  onOpenChange={(open) =>
                    setOpenMenuId(
                      open
                        ? term.id
                        : null,
                    )
                  }
                  onEdit={() => {
                    setDialogValue(term);
                    setOpenMenuId(null);
                  }}
                  onDelete={() =>
                    handleDelete(term)
                  }
                />
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>

      {filteredTerms.length === 0 ? (
        <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
            <Layers3 size={19} />
          </span>

          <p className="mt-4 text-sm font-medium text-foreground">
            No terms found
          </p>

          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Add the first term for{" "}
            {selectedYear?.name ??
              "the selected academic year"}.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TermStat
          icon={<Layers3 size={18} />}
          value={filteredTerms.length}
          label="Terms"
          description="Saved for this year"
        />

        <TermStat
          icon={<Check size={18} />}
          value={currentTermsCount}
          label="Current"
          description="Active semester"
        />

        <TermStat
          icon={<Flag size={18} />}
          value={finalTermsCount}
          label="Final Terms"
          description="Marked as year ending"
        />
      </div>

      {dialogValue ? (
        <AcademicTermDialog
          value={
            dialogValue === "new"
              ? null
              : dialogValue
          }
          academicYearId={
            dialogValue === "new"
              ? selectedYearId
              : dialogValue.academicYearId
          }
          onClose={() =>
            setDialogValue(null)
          }
          onSave={(payload) => {
            if (dialogValue === "new") {
              createTerm.mutate(payload);
            } else {
              updateTerm.mutate({
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

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "primary";
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-3 py-1.5",
        "text-[11px] font-medium",
        tone === "success"
          ? "bg-emerald-500/[0.09] text-emerald-600"
          : "bg-primary/[0.08] text-primary",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          tone === "success"
            ? "bg-emerald-500"
            : "bg-primary",
        ].join(" ")}
      />

      {label}
    </span>
  );
}

function MutedValue() {
  return (
    <span className="text-muted-foreground/60">
      —
    </span>
  );
}

function TermStat({
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

      <p className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
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