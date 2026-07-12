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
        description="Manage terms connected to each academic year."
        actionLabel="Add Term"
        onAction={() =>
          setDialogValue("new")
        }
      >
        <div className="mt-5 flex max-w-sm items-center gap-3">
          <span className="shrink-0 text-xs font-black text-slate-500">
            Academic Year
          </span>

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
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {academicYears.length === 0 ? (
              <option value="">
                No academic years
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
        </div>
      </SectionHeader>

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>
              Semester
            </EntityTh>

            <EntityTh>Order</EntityTh>

            <EntityTh>
              Start Date
            </EntityTh>

            <EntityTh>
              End Date
            </EntityTh>

            <EntityTh>Current</EntityTh>

            <EntityTh>Final</EntityTh>

            <EntityTh>
              Created At
            </EntityTh>

            <EntityTh>
              Updated At
            </EntityTh>

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

              <EntityTd strong>
                {term.order}
              </EntityTd>

              <EntityTd>
                {term.startDate}
              </EntityTd>

              <EntityTd>
                {term.endDate}
              </EntityTd>

              <EntityTd>
                {term.isCurrent ? (
                  <StatusDot />
                ) : (
                  "—"
                )}
              </EntityTd>

              <EntityTd>
                {term.isFinalTerm ? (
                  <StatusDot />
                ) : (
                  "—"
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
                      open ? term.id : null,
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
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
          No terms found for the selected
          academic year.
        </div>
      ) : null}

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

function StatusDot() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
      ✓
    </span>
  );
}