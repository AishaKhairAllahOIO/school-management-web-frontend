import {
  CalendarDays,
  Edit2,
  FileText,
  MoreHorizontal,
  Plus,
  WalletCards,
} from "lucide-react";

import {
  getSalaryTypeLabel,
  formatSalary,
} from "../utils/payroll.utils";

import type {
  StaffFinancialContract,
} from "../types/payroll.types";

type Props = {
  contracts: StaffFinancialContract[];
  loading: boolean;
  error: boolean;

  onAdd: () => void;

  onEdit: (
    contract: StaffFinancialContract,
  ) => void;

  onDelete: (
    contract: StaffFinancialContract,
  ) => void;

  academicYearsById?: Map<string, string>;
};

function formatArabicNumber(
  value: number | string | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("ar-SA").format(
    numericValue,
  );
}

function resolveAcademicYearName(
  contract: StaffFinancialContract,
  academicYearsById?: Map<string, string>,
): string {
  if (contract.academicYear?.name) {
    return contract.academicYear.name;
  }

  const academicYearId = String(
    contract.academic_year,
  );

  return (
    academicYearsById?.get(academicYearId) ??
    "Academic year unavailable"
  );
}

export function ContractsTable({
  contracts,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  academicYearsById,
}: Props) {
  if (loading) {
    return (
      <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
        <div className="flex items-center gap-3 border-b border-border/45 px-5 py-4">
          <div className="flex size-10 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
            <FileText
              className="size-[18px]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h2 className="text-sm font-bold">
              Financial contracts
            </h2>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Salary agreements
            </p>
          </div>
        </div>

        <div className="p-12 text-center">
          <p className="text-xs text-muted-foreground">
            Loading contracts...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden rounded-[24px] border border-destructive/15 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
        <div className="p-12 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-[14px] bg-destructive/[0.08] text-destructive">
            <FileText
              className="size-5"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-destructive">
            Failed to load contracts.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const activeContract =
    contracts[0] ?? null;

  return (
    <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border/45 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
            <WalletCards
              className="size-[18px]"
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">
              Financial contract
            </h2>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Salary agreement and academic year
            </p>
          </div>
        </div>

        {activeContract ? (
          <button
            type="button"
            onClick={() =>
              onEdit(activeContract)
            }
            className="
              inline-flex h-9 shrink-0
              items-center gap-1.5
              rounded-xl
              border border-primary/15
              bg-primary/[0.06]
              px-3
              text-xs font-semibold
              text-primary
              transition-all
              hover:-translate-y-0.5
              hover:bg-primary/[0.1]
            "
          >
            <Edit2
              className="size-3.5"
              strokeWidth={1.8}
            />

            <span className="hidden sm:inline">
              Edit contract
            </span>

            <span className="sm:hidden">
              Edit
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="
              inline-flex h-9 shrink-0
              items-center gap-1.5
              rounded-xl
              bg-primary
              px-3
              text-xs font-semibold
              text-primary-foreground
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:opacity-90
            "
          >
            <Plus className="size-3.5" />

            <span className="hidden sm:inline">
              Add contract
            </span>

            <span className="sm:hidden">
              Add
            </span>
          </button>
        )}
      </div>

      {activeContract ? (
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Salary type */}
            <div className="rounded-[18px] border border-border/40 bg-muted/[0.18] p-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary/[0.08] text-primary">
                  <WalletCards
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                  Salary type
                </span>
              </div>

              <div className="mt-3">
                <span className="inline-flex rounded-full border border-primary/15 bg-primary/[0.07] px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {getSalaryTypeLabel(
                    activeContract.salary_type,
                  )}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-[18px] border border-border/40 bg-muted/[0.18] p-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-[10px] bg-success/[0.08] text-success">
                  <WalletCards
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                  Salary amount
                </span>
              </div>

              <p className="mt-3 text-lg font-bold text-foreground">
                {formatSalary(
                  activeContract.salary_amount,
                )}
              </p>
            </div>

            {/* Academic year */}
            <div className="rounded-[18px] border border-border/40 bg-muted/[0.18] p-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-[10px] bg-info/[0.09] text-info">
                  <CalendarDays
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                  Academic year
                </span>
              </div>

              <p className="mt-3 text-sm font-bold text-foreground">
                {resolveAcademicYearName(
                  activeContract,
                  academicYearsById,
                )}
              </p>
            </div>
          </div>

          {/* Additional contracts, if API returns more than one */}
          {contracts.length > 1 ? (
            <div className="mt-4 overflow-hidden rounded-[18px] border border-border/40">
              <div className="flex items-center justify-between border-b border-border/40 bg-muted/[0.18] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold">
                    Other contracts
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Previous financial agreements
                  </p>
                </div>

                <span className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[10px] font-semibold text-primary">
                  {formatArabicNumber(
                    contracts.length,
                  )}
                </span>
              </div>

              <div className="divide-y divide-border/30">
                {contracts
                  .slice(1)
                  .map((contract) => (
                    <div
                      key={String(
                        contract.id,
                      )}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-primary/[0.018]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.06] text-primary">
                          <FileText
                            className="size-4"
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {getSalaryTypeLabel(
                              contract.salary_type,
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {resolveAcademicYearName(
                              contract,
                              academicYearsById,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden text-xs font-semibold sm:block">
                          {formatSalary(
                            contract.salary_amount,
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              contract,
                            )
                          }
                          className="
                            flex size-8
                            items-center
                            justify-center
                            rounded-lg
                            text-muted-foreground
                            transition
                            hover:bg-primary/[0.07]
                            hover:text-primary
                          "
                          aria-label="Edit contract"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {/* Delete */}
          {onDelete && activeContract ? (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onDelete(activeContract)
                }
                className="text-[11px] font-medium text-destructive/75 transition hover:text-destructive hover:underline"
              >
                Delete contract
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-[16px] bg-primary/[0.07] text-primary">
            <Plus
              className="size-5"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-foreground">
            No financial contract
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-5 text-muted-foreground">
            Create the employee's first financial
            contract to define their salary agreement.
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-3.5" />
            Add contract
          </button>
        </div>
      )}
    </section>
  );
}