import {
  ArrowLeft,
  CalendarDays,
  Edit2,
  FileText,
  Plus,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import type { StaffFinancialContract } from "../types/payroll.types";

type StaffInfo = {
  id?: string | number;
  fullName?: string | null;
  role?: string | null;
  photoUrl?: string | null;
};

type Props = {
  contracts: StaffFinancialContract[];
  loading: boolean;
  error: boolean;

  staff: StaffInfo;

  onAdd: () => void;
  onEdit: (contract: StaffFinancialContract) => void;
  onDelete: (contract: StaffFinancialContract) => void;
  onBack: () => void;

  academicYearsById?: Map<string, string>;
};

function toEnglishDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    );
}

function formatEnglishNumber(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const normalized = toEnglishDigits(String(value));
  const numericValue = Number(normalized);

  if (Number.isNaN(numericValue)) {
    return normalized;
  }

  return new Intl.NumberFormat("en-US").format(numericValue);
}

function formatEnglishSalary(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const normalized = toEnglishDigits(String(value));
  const numericValue = Number(normalized);

  if (Number.isNaN(numericValue)) {
    return normalized;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function getSalaryTypeLabel(value: string): string {
  switch (value) {
    case "monthly":
      return "Monthly";

    case "daily":
      return "Daily";

    case "hourly":
      return "Hourly";

    case "weekly":
      return "Weekly";

    case "yearly":
      return "Yearly";

    default:
      return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function resolveAcademicYearName(
  contract: StaffFinancialContract,
  academicYearsById?: Map<string, string>,
): string {
  if (contract.academicYear?.name) {
    return contract.academicYear.name;
  }

  const academicYearId = String(contract.academic_year);

  return (
    academicYearsById?.get(academicYearId) ??
    "Academic year unavailable"
  );
}

export function ContractsTable({
  contracts,
  loading,
  error,
  staff,
  onAdd,
  onEdit,
  onDelete,
  onBack,
  academicYearsById,
}: Props) {
  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section
        className="
          overflow-hidden
          rounded-[20px]
          border border-border/45
          bg-card
          shadow-[0_8px_24px_rgba(31,22,73,0.035)]
        "
      >
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <div className="size-10 shrink-0 animate-pulse rounded-[13px] bg-muted" />

          <div className="min-w-0 space-y-1.5">
            <div className="h-3.5 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="ml-auto h-7 w-16 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="border-t border-border/40 px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Loading contract...
          </p>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <section
        className="
          overflow-hidden
          rounded-[20px]
          border border-destructive/15
          bg-card
          shadow-[0_8px_24px_rgba(31,22,73,0.035)]
        "
      >
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <div
            className="
              flex size-10 shrink-0
              items-center justify-center
              overflow-hidden
              rounded-[13px]
              bg-primary/[0.07]
              text-primary
            "
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <UserRound
                className="size-[18px]"
                strokeWidth={1.8}
              />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold text-foreground">
              {staff.fullName ?? "Staff member"}
            </h1>

            <p className="mt-0.5 truncate text-[10px] capitalize text-muted-foreground">
              {staff.role?.replace("_", " ") ?? "Staff"}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="
              ml-auto
              inline-flex
              shrink-0
              items-center
              gap-1.5
              px-1
              py-1
              text-[11.5px]
              font-semibold
              text-muted-foreground
              underline
              underline-offset-4
              decoration-muted-foreground/30
              transition
              hover:text-foreground
              hover:decoration-foreground/60
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft
              className="size-3.5 rtl:rotate-180"
              strokeWidth={1.9}
            />

            Back
          </button>
        </div>

        <div className="border-t border-destructive/10 px-5 py-9 text-center">
          <div
            className="
              mx-auto flex size-10
              items-center justify-center
              rounded-xl
              bg-destructive/[0.08]
              text-destructive
            "
          >
            <FileText
              className="size-4"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-destructive">
            Failed to load contracts.
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const activeContract = contracts[0] ?? null;

  return (
    <section
      className="
        overflow-hidden
        rounded-[20px]
        border border-border/45
        bg-card
        shadow-[0_8px_24px_rgba(31,22,73,0.035)]
      "
    >
      {/* =====================================================
          EMPLOYEE HEADER
      ===================================================== */}

      <div
        className="
          flex min-w-0
          items-center
          justify-between
          gap-3
          px-4 py-3.5
          sm:px-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex size-10 shrink-0
              items-center justify-center
              overflow-hidden
              rounded-[13px]
              bg-primary/[0.07]
              text-primary
              ring-1 ring-primary/[0.06]
            "
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <UserRound
                className="size-[18px]"
                strokeWidth={1.8}
              />
            )}
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[15px]
                font-semibold
                leading-5
                text-foreground
              "
            >
              {staff.fullName ?? "Staff member"}
            </h1>

            <p
              className="
                mt-0.5
                truncate
                text-[10px]
                capitalize
                leading-4
                text-muted-foreground
              "
            >
              {staff.role?.replace("_", " ") ?? "Staff"}
            </p>
          </div>
        </div>

        {/* =====================================================
            BACK / ADD
        ===================================================== */}

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex
              items-center
              gap-1.5
              bg-transparent
              px-1
              py-1
              text-[11.5px]
              font-semibold
              text-muted-foreground
              underline
              underline-offset-4
              decoration-muted-foreground/30
              transition
              hover:bg-transparent
              hover:text-foreground
              hover:decoration-foreground/60
              focus-visible:bg-transparent
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft
              className="size-3.5 rtl:rotate-180"
              strokeWidth={1.9}
            />

            Back
          </button>

          {!activeContract ? (
            <button
              type="button"
              onClick={onAdd}
              className="
                inline-flex
                items-center
                gap-1.5
                bg-transparent
                px-1
                py-1
                text-[11.5px]
                font-semibold
                text-primary
                underline
                underline-offset-4
                decoration-primary/40
                transition
                hover:bg-transparent
                hover:text-primary/75
                hover:decoration-primary
                focus-visible:bg-transparent
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/30
                focus-visible:ring-offset-2
              "
            >
              <Plus
                className="size-3.5"
                strokeWidth={1.9}
              />

              <span className="hidden sm:inline">
                Add contract
              </span>

              <span className="sm:hidden">
                Add
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {/* =====================================================
          ACTIVE CONTRACT
      ===================================================== */}

      {activeContract ? (
        <div className="border-t border-border/40 px-3.5 py-3.5 sm:px-4">
          <div
            className="
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-3
              sm:gap-2.5
            "
          >
            {/* =================================================
                SALARY TYPE
            ================================================= */}

            <div
              className="
                flex min-w-0
                items-center gap-2.5
                rounded-[14px]
                border border-primary/10
                bg-primary/[0.035]
                px-3 py-2.5
              "
            >
              <div
                className="
                  flex size-8 shrink-0
                  items-center justify-center
                  rounded-[10px]
                  bg-primary/10
                  text-primary
                "
              >
                <WalletCards
                  className="size-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Salary type
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[12px]
                    font-semibold
                    text-primary
                  "
                >
                  {getSalaryTypeLabel(
                    activeContract.salary_type,
                  )}
                </p>
              </div>
            </div>

            {/* =================================================
                SALARY
            ================================================= */}

            <div
              className="
                flex min-w-0
                items-center gap-2.5
                rounded-[14px]
                border border-success/10
                bg-success/[0.035]
                px-3 py-2.5
              "
            >
              <div
                className="
                  flex size-8 shrink-0
                  items-center justify-center
                  rounded-[10px]
                  bg-success/10
                  text-success
                "
              >
                <WalletCards
                  className="size-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <div
                dir="ltr"
                className="min-w-0 text-left"
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Salary amount
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[15px]
                    font-bold
                    leading-5
                    text-foreground
                  "
                >
                  {formatEnglishSalary(
                    activeContract.salary_amount,
                  )}
                </p>
              </div>
            </div>

            {/* =================================================
                ACADEMIC YEAR
            ================================================= */}

            <div
              className="
                flex min-w-0
                items-center gap-2.5
                rounded-[14px]
                border border-info/10
                bg-info/[0.035]
                px-3 py-2.5
              "
            >
              <div
                className="
                  flex size-8 shrink-0
                  items-center justify-center
                  rounded-[10px]
                  bg-info/10
                  text-info
                "
              >
                <CalendarDays
                  className="size-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Academic year
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[12px]
                    font-semibold
                    text-foreground
                  "
                >
                  {resolveAcademicYearName(
                    activeContract,
                    academicYearsById,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              OTHER CONTRACTS
          ================================================= */}

          {contracts.length > 1 ? (
            <div
              className="
                mt-2.5
                overflow-hidden
                rounded-[14px]
                border border-border/40
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-b border-border/40
                  bg-muted/[0.14]
                  px-3 py-2.5
                "
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold">
                    Previous contracts
                  </p>

                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    Previous financial agreements
                  </p>
                </div>

                <span
                  dir="ltr"
                  className="
                    shrink-0
                    rounded-full
                    bg-primary/[0.07]
                    px-2 py-0.5
                    text-[9px]
                    font-semibold
                    text-primary
                  "
                >
                  {formatEnglishNumber(
                    contracts.length - 1,
                  )}
                </span>
              </div>

              <div className="divide-y divide-border/30">
                {contracts.slice(1).map((contract) => (
                  <div
                    key={String(contract.id)}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-3 py-2.5
                      transition-colors
                      hover:bg-primary/[0.018]
                    "
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="
                          flex size-8 shrink-0
                          items-center justify-center
                          rounded-[10px]
                          bg-primary/[0.06]
                          text-primary
                        "
                      >
                        <FileText
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-[11px]
                            font-semibold
                          "
                        >
                          {getSalaryTypeLabel(
                            contract.salary_type,
                          )}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-muted-foreground
                          "
                        >
                          {resolveAcademicYearName(
                            contract,
                            academicYearsById,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <span
                        dir="ltr"
                        className="
                          hidden
                          text-[11px]
                          font-semibold
                          text-foreground
                          sm:block
                        "
                      >
                        {formatEnglishSalary(
                          contract.salary_amount,
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() => onEdit(contract)}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          bg-transparent
                          px-1
                          py-1
                          text-[11px]
                          font-semibold
                          text-primary
                          underline
                          underline-offset-4
                          decoration-primary/40
                          transition
                          hover:bg-transparent
                          hover:text-primary/75
                          hover:decoration-primary
                          focus-visible:bg-transparent
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary/30
                        "
                        aria-label="Edit contract"
                      >
                        <Edit2
                          className="size-3.5"
                          strokeWidth={1.9}
                        />

                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-2.5 flex justify-end">
            <div className="flex items-center gap-3">
              {/* EDIT */}

              <button
                type="button"
                onClick={() => onEdit(activeContract)}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  bg-transparent
                  px-1
                  py-1
                  text-[10.5px]
                  font-semibold
                  text-primary
                  underline
                  underline-offset-4
                  decoration-primary/35
                  transition
                  hover:bg-transparent
                  hover:text-primary/75
                  hover:decoration-primary
                  focus-visible:bg-transparent
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary/30
                "
              >
                <Edit2
                  className="size-3.5"
                  strokeWidth={1.9}
                />

                Edit contract
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={() => onDelete(activeContract)}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  bg-transparent
                  px-1
                  py-1
                  text-[10.5px]
                  font-semibold
                  text-destructive
                  underline
                  underline-offset-4
                  decoration-destructive/35
                  transition
                  hover:bg-transparent
                  hover:text-destructive/75
                  hover:decoration-destructive
                  focus-visible:bg-transparent
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-destructive/30
                "
              >
                <Trash2
                  className="size-3.5"
                  strokeWidth={1.9}
                />

                Delete contract
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================
           EMPTY STATE
        ===================================================== */

        <div
          className="
            border-t border-border/40
            px-5 py-8
            text-center
          "
        >
          <div
            className="
              mx-auto flex size-10
              items-center justify-center
              rounded-xl
              bg-primary/[0.07]
              text-primary
            "
          >
            <Plus
              className="size-4"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-3 text-[13px] font-semibold">
            No financial contract
          </p>

          <p
            className="
              mx-auto mt-1
              max-w-sm
              text-[10px]
              leading-4.5
              text-muted-foreground
            "
          >
            Create the employee's first financial
            contract to define their salary agreement.
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="
              mt-3
              inline-flex
              items-center
              gap-1.5
              bg-transparent
              px-1
              py-1
              text-[11.5px]
              font-semibold
              text-primary
              underline
              underline-offset-4
              decoration-primary/40
              transition
              hover:bg-transparent
              hover:text-primary/75
              hover:decoration-primary
              focus-visible:bg-transparent
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            "
          >
            <Plus
              className="size-3.5"
              strokeWidth={1.9}
            />

            Add contract
          </button>
        </div>
      )}
    </section>
  );
}