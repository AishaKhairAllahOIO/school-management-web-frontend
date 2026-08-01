import {
  Check,
  Flag,
  Layers3,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

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

  const [pendingDelete, setPendingDelete] =
    useState<AcademicTerm | null>(null);

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
    setPendingDelete(term);
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
            <span className="mb-2 block text-[13px] font-medium text-foreground">
              Academic Year
            </span>
            <Select
              value={selectedYearId || "none"}
              disabled={academicYears.length === 0}
              onValueChange={(value) =>
                setSelectedYearId(
                  value === "none" ? "" : value,
                )
              }
            >
              <SelectTrigger className="h-11 rounded-[14px] px-4">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No academic years available
                  </SelectItem>
                ) : null}

                {academicYears.map((year) => (
                  <SelectItem
                    key={year.id}
                    value={year.id}
                  >
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/[0.07] px-2 text-[13px] font-medium text-primary">
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

          <p className="mt-4 text-[15px] font-medium text-foreground">
            No terms found
          </p>

          <p className="mt-1 text-[13px] font-normal text-muted-foreground">
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

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete academic term?"
        description="This action cannot be undone."
        itemName={pendingDelete ? pendingDelete.semesterName.replaceAll("_", " ") : undefined}
        isPending={deleteTerm.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteTerm.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
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
        "text-[12px] font-medium",
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

      <p className="mt-1 text-[13px] font-medium text-foreground">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-normal text-muted-foreground">
        {description}
      </p>
    </div>
  );
}