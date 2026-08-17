import { useState } from "react";

import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";

import {
  useCreateAcademicYear,
  useDeleteAcademicYear,
  useUpdateAcademicYear,
} from "../../hooks/useAcademicSettings";
import type { AcademicYear } from "../../types/academic-settings.types";
import { formatDateTime } from "../../utils/academic-settings.utils";

import { AcademicYearDialog } from "../dialogs/AcademicYearDialog";
import { ActionMenu } from "../shared/ActionMenu";
import { EntityTable, EntityTd, EntityTh } from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicYears: AcademicYear[];
};

export function AcademicYearsSection({ academicYears }: Props) {
  const [dialogValue, setDialogValue] = useState<AcademicYear | "new" | null>(
    null,
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<AcademicYear | null>(null);

  const createYear = useCreateAcademicYear();

  const updateYear = useUpdateAcademicYear();

  const deleteYear = useDeleteAcademicYear();

  function handleDelete(year: AcademicYear) {
    setPendingDelete(year);
    setOpenMenuId(null);
  }

  return (
    <>
      <SectionHeader
        title="Academic Years"
        description="Create yearly periods and choose which one is currently active across the school."
        actionLabel="Add Year"
        onAction={() => setDialogValue("new")}
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

            <EntityTh align="right">Actions</EntityTh>
          </tr>
        </thead>

        <tbody>
          {academicYears.map((year) => (
            <tr key={year.id}>
              <EntityTd strong>{year.name}</EntityTd>

              <EntityTd>{year.startDate}</EntityTd>

              <EntityTd>{year.endDate}</EntityTd>

              <EntityTd>
                {year.isCurrent ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/[0.09] px-3 py-1.5 text-[12px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Current Year
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    Previous
                  </span>
                )}
              </EntityTd>

              <EntityTd>{formatDateTime(year.createdAt)}</EntityTd>

              <EntityTd>{formatDateTime(year.updatedAt)}</EntityTd>

              <EntityTd align="right">
                <ActionMenu
                  isOpen={openMenuId === year.id}
                  onOpenChange={(open) => setOpenMenuId(open ? year.id : null)}
                  onEdit={() => {
                    setDialogValue(year);
                    setOpenMenuId(null);
                  }}
                  onDelete={() => handleDelete(year)}
                />
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>

      {academicYears.length === 0 ? (
        <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
          <p className="text-[15px] font-medium text-foreground">
            No academic years yet
          </p>

          <p className="mt-1 text-[13px] font-normal text-muted-foreground">
            Add the first academic year to begin configuring the school
            calendar.
          </p>
        </div>
      ) : null}

      {dialogValue ? (
        <AcademicYearDialog
          value={dialogValue === "new" ? null : dialogValue}
          onClose={() => setDialogValue(null)}
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

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete academic year?"
        description="This action cannot be undone."
        itemName={pendingDelete ? pendingDelete.name : undefined}
        isPending={deleteYear.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteYear.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </>
  );
}
