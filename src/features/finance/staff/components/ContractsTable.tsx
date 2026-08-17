import {
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

  academicYearsById?: Map<string, string>;
};

/**
 * Convert Arabic/Persian digits to English digits.
 */
function toEnglishDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

/**
 * Always format numbers using English digits.
 */
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

/**
 * Format salary using English digits.
 */
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

/**
 * Salary type label.
 */
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

/**
 * Resolve academic year name.
 *
 * Prefer nested API relation.
 * Otherwise use academicYearsById.
 */
function resolveAcademicYearName(
  contract: StaffFinancialContract,
  academicYearsById?: Map<string, string>,
): string {
  if (contract.academicYear?.name) {
    return contract.academicYear.name;
  }

  const academicYearId = String(contract.academic_year);

  return academicYearsById?.get(academicYearId) ?? "Academic year unavailable";
}

export function ContractsTable({
  contracts,
  loading,
  error,
  staff,
  onAdd,
  onEdit,
  onDelete,
  academicYearsById,
}: Props) {
  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <section
        className="
          overflow-hidden
          rounded-[22px]
          border border-border/45
          bg-card
          shadow-[0_8px_24px_rgba(31,22,73,0.035)]
        "
      >
        {/* Employee header */}

        <div
          className="
            flex items-center
            gap-3
            px-4 py-4
            sm:px-5
          "
        >
          <div
            className="
              size-11
              shrink-0
              animate-pulse
              rounded-[14px]
              bg-muted
            "
          />

          <div className="min-w-0">
            <div
              className="
                h-4 w-32
                animate-pulse
                rounded-md
                bg-muted
              "
            />

            <div
              className="
                mt-1.5
                h-3 w-20
                animate-pulse
                rounded-md
                bg-muted
              "
            />
          </div>
        </div>

        <div
          className="
            border-t border-border/40
            p-10
            text-center
          "
        >
          <p className="text-xs text-muted-foreground">Loading contract...</p>
        </div>
      </section>
    );
  }

  /*
   * =========================
   * Error
   * =========================
   */

  if (error) {
    return (
      <section
        className="
          overflow-hidden
          rounded-[22px]
          border border-destructive/15
          bg-card
          shadow-[0_8px_24px_rgba(31,22,73,0.035)]
        "
      >
        {/* Employee header */}

        <div
          className="
            flex items-center
            gap-3
            px-4 py-4
            sm:px-5
          "
        >
          <div
            className="
              flex size-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-[14px]
              bg-primary/[0.07]
              text-primary
            "
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt=""
                className="
                  size-full
                  object-cover
                "
              />
            ) : (
              <UserRound className="size-5" strokeWidth={1.8} />
            )}
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[17px]
                font-semibold
                text-foreground
              "
            >
              {staff.fullName ?? "Staff member"}
            </h1>

            <p
              className="
                mt-0.5
                text-[11px]
                capitalize
                text-muted-foreground
              "
            >
              {staff.role?.replace("_", " ") ?? "Staff"}
            </p>
          </div>
        </div>

        <div
          className="
            border-t
            border-destructive/10
            p-10
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex size-10
              items-center
              justify-center
              rounded-[12px]
              bg-destructive/[0.08]
              text-destructive
            "
          >
            <FileText className="size-4" strokeWidth={1.8} />
          </div>

          <p
            className="
              mt-3
              text-sm
              font-semibold
              text-destructive
            "
          >
            Failed to load contracts.
          </p>

          <p
            className="
              mt-1
              text-[11px]
              text-muted-foreground
            "
          >
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const activeContract = contracts[0] ?? null;

  /*
   * =========================
   * Main
   * =========================
   */

  return (
    <section
      className="
        overflow-hidden
        rounded-[22px]
        border border-border/45
        bg-card
        shadow-[0_8px_24px_rgba(31,22,73,0.035)]
      "
    >
      {/* =====================================================
          EMPLOYEE PROFILE HEADER
         ===================================================== */}

      <div
        className="
          flex items-center
          justify-between
          gap-3
          px-4 py-4
          sm:px-5
        "
      >
        {/* Employee information */}

        <div
          className="
            flex min-w-0
            items-center
            gap-3
          "
        >
          {/* Photo */}

          <div
            className="
              flex size-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-[14px]
              bg-primary/[0.07]
              text-primary
            "
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt=""
                className="
                  size-full
                  object-cover
                "
              />
            ) : (
              <UserRound className="size-[19px]" strokeWidth={1.8} />
            )}
          </div>

          {/* Name + role */}

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[17.5px]
                font-semibold
                text-foreground
              "
            >
              {staff.fullName ?? "Staff member"}
            </h1>

            <p
              className="
                mt-0.5
                truncate
                text-[11.5px]
                capitalize
                text-muted-foreground
              "
            >
              {staff.role?.replace("_", " ") ?? "Staff"}
            </p>
          </div>
        </div>

        {/* =================================================
            Header action
           ================================================= */}

        {activeContract ? (
          <button
            type="button"
            onClick={() => onEdit(activeContract)}
            className="
    inline-flex
    items-center
    gap-1.5
    px-1
    py-1
    text-[12px]
    font-semibold
    text-primary
    underline
    underline-offset-4
    decoration-primary/40
    transition-all
    duration-200
    hover:text-primary/75
    hover:decoration-primary
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/30
    focus-visible:ring-offset-2
  "
          >
            <Edit2 className="size-4" strokeWidth={1.9} />

            <span className="hidden sm:inline">Edit contract</span>

            <span className="sm:hidden">Edit</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="
    inline-flex
    items-center
    gap-1.5
    px-1
    py-1
    text-[12px]
    font-semibold
    text-primary
    underline
    underline-offset-4
    decoration-primary/40
    transition-all
    duration-200
    hover:text-primary/75
    hover:decoration-primary
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/30
    focus-visible:ring-offset-2
  "
          >
            <Plus className="size-4" strokeWidth={1.9} />

            <span className="hidden sm:inline">Add contract</span>

            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* =====================================================
          CONTRACT CONTENT
         ===================================================== */}

      {activeContract ? (
        <div
          className="
            border-t
            border-border/40
            p-4
            sm:p-4.5
          "
        >
          {/* =================================================
              Active contract cards
             ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-2.5
              sm:grid-cols-3
              sm:gap-3
            "
          >
            {/* =================================================
                Salary Type
               ================================================= */}

            <div
              className="
                flex min-w-0
                items-center
                gap-3
                rounded-[16px]
                border
                border-primary/10
                bg-primary/[0.035]
                px-3.5
                py-3
                sm:px-4
                sm:py-3.5
              "
            >
              <div
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-primary/10
                  text-primary
                "
              >
                <WalletCards className="size-4" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9.5px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Salary type
                </p>

                <span
                  className="
                    mt-1
                    inline-flex
                    max-w-full
                    truncate
                    rounded-full
                    border
                    border-primary/15
                    bg-primary/10
                    px-2.5
                    py-0.5
                    text-[11.5px]
                    font-semibold
                    text-primary
                  "
                >
                  {getSalaryTypeLabel(activeContract.salary_type)}
                </span>
              </div>
            </div>

            {/* =================================================
                Salary Amount
               ================================================= */}

            <div
              className="
                flex min-w-0
                items-center
                gap-3
                rounded-[16px]
                border
                border-success/10
                bg-success/[0.035]
                px-3.5
                py-3
                sm:px-4
                sm:py-3.5
              "
            >
              <div
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-success/10
                  text-success
                "
              >
                <WalletCards className="size-4" strokeWidth={1.8} />
              </div>

              <div
                dir="ltr"
                className="
                  min-w-0
                  text-left
                "
              >
                <p
                  className="
                    text-[9.5px]
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
                    text-[18px]
                    font-bold
                    leading-6
                    text-foreground
                  "
                >
                  {formatEnglishSalary(activeContract.salary_amount)}
                </p>
              </div>
            </div>

            {/* =================================================
                Academic Year
               ================================================= */}

            <div
              className="
                flex min-w-0
                items-center
                gap-3
                rounded-[16px]
                border
                border-info/10
                bg-info/[0.035]
                px-3.5
                py-3
                sm:px-4
                sm:py-3.5
              "
            >
              <div
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-info/10
                  text-info
                "
              >
                <CalendarDays className="size-4" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9.5px]
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
                    text-[14px]
                    font-bold
                    leading-5
                    text-foreground
                  "
                >
                  {resolveAcademicYearName(activeContract, academicYearsById)}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              Other contracts
             ================================================= */}

          {contracts.length > 1 ? (
            <div
              className="
                mt-3.5
                overflow-hidden
                rounded-[16px]
                border
                border-border/40
              "
            >
              {/* Other contracts header */}

              <div
                className="
                  flex items-center
                  justify-between
                  border-b
                  border-border/40
                  bg-muted/[0.16]
                  px-3.5
                  py-3
                "
              >
                <div>
                  <p
                    className="
                      text-[11.5px]
                      font-semibold
                    "
                  >
                    Other contracts
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9.5px]
                      text-muted-foreground
                    "
                  >
                    Previous financial agreements
                  </p>
                </div>

                <span
                  dir="ltr"
                  className="
                    rounded-full
                    bg-primary/[0.07]
                    px-2.5
                    py-0.5
                    text-[9.5px]
                    font-semibold
                    text-primary
                  "
                >
                  {formatEnglishNumber(contracts.length - 1)}
                </span>
              </div>

              {/* Contracts */}

              <div
                className="
                  divide-y
                  divide-border/30
                "
              >
                {contracts.slice(1).map((contract) => (
                  <div
                    key={String(contract.id)}
                    className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          px-3.5
                          py-3
                          transition-colors
                          hover:bg-primary/[0.018]
                        "
                  >
                    {/* Contract information */}

                    <div
                      className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                    >
                      <div
                        className="
                              flex size-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-[11px]
                              bg-primary/[0.06]
                              text-primary
                            "
                      >
                        <FileText className="size-4" strokeWidth={1.8} />
                      </div>

                      <div
                        className="
                              min-w-0
                            "
                      >
                        <p
                          className="
                                truncate
                                text-[11.5px]
                                font-semibold
                              "
                        >
                          {getSalaryTypeLabel(contract.salary_type)}
                        </p>

                        <p
                          className="
                                mt-0.5
                                truncate
                                text-[9.5px]
                                text-muted-foreground
                              "
                        >
                          {resolveAcademicYearName(contract, academicYearsById)}
                        </p>
                      </div>
                    </div>

                    {/* Amount + Edit */}

                    <div
                      className="
                            flex
                            shrink-0
                            items-center
                            gap-2.5
                          "
                    >
                      <span
                        dir="ltr"
                        className="
                              hidden
                              text-[12px]
                              font-semibold
                              text-foreground
                              sm:block
                            "
                      >
                        {formatEnglishSalary(contract.salary_amount)}
                      </span>

                      {/* Edit previous contract */}

                      <button
                        type="button"
                        onClick={() => onEdit(contract)}
                        className="
    inline-flex
    items-center
    gap-1.5
    px-1
    py-1
    text-[11.5px]
    font-semibold
    text-primary
    underline
    underline-offset-4
    decoration-primary/40
    transition-all
    duration-200
    hover:text-primary/75
    hover:decoration-primary
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/30
    focus-visible:ring-offset-2
  "
                        aria-label="Edit contract"
                      >
                        <Edit2 className="size-4" strokeWidth={1.9} />

                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* =================================================
              Delete
             ================================================= */}

          { activeContract ? (
            <div
              className="
                mt-3.5
                flex
                justify-end
              "
            >
            <button
  type="button"
  onClick={() => onDelete(activeContract)}
  className="
    inline-flex
    items-center
    gap-1.5
    px-1
    py-1
    text-[11.5px]
    font-semibold
    text-destructive
    underline
    underline-offset-4
    decoration-destructive/40
    transition-all
    duration-200
    hover:text-destructive/75
    hover:decoration-destructive
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-destructive/30
    focus-visible:ring-offset-2
  "
>
  <Trash2
    className="size-4"
    strokeWidth={1.9}
  />

  <span>
    Delete contract
  </span>
</button>
            </div>
          ) : null}
        </div>
      ) : (
        /* =====================================================
           Empty state
           ===================================================== */

        <div
          className="
            border-t
            border-border/40
            px-5
            py-11
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex size-11
              items-center
              justify-center
              rounded-[14px]
              bg-primary/[0.07]
              text-primary
            "
          >
            <Plus className="size-4.5" strokeWidth={1.8} />
          </div>

          <p
            className="
              mt-3
              text-[14px]
              font-semibold
              text-foreground
            "
          >
            No financial contract
          </p>

          <p
            className="
              mx-auto
              mt-1
              max-w-sm
              text-[10.5px]
              leading-5
              text-muted-foreground
            "
          >
            Create the employee's first financial contract to define their
            salary agreement.
          </p>

        <button
  type="button"
  onClick={onAdd}
  className="
    mt-3.5
    inline-flex
    items-center
    gap-1.5
    px-1
    py-1
    text-[12px]
    font-semibold
    text-primary
    underline
    underline-offset-4
    decoration-primary/40
    transition-all
    duration-200
    hover:text-primary/75
    hover:decoration-primary
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/30
    focus-visible:ring-offset-2
  "
>
  <Plus
    className="size-4"
    strokeWidth={1.9}
  />

  Add contract
</button>
        </div>
      )}
    </section>
  );
}
