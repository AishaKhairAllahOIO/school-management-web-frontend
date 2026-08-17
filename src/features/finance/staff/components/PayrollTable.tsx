import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import { ConfirmDialog } from "./ConfirmDialog";
import { PayrollDetailDialog } from "./PayrollDetailDialog";

import {
  useDeletePayroll,
} from "../hooks/usePayroll";

import { getStaffName } from "../utils/payroll.utils";

import type { Payroll } from "../types/payroll.types";

type Props = {
  payrolls: Payroll[];
  loading: boolean;

  /**
   * Generate payroll.
   */
  onGenerate?: () => void;
onSelect: (payroll: Payroll) => void;
  generateLoading?: boolean;

  generateDisabled?: boolean;

  /**
   * Called after a payroll is successfully deleted.
   */
  onDeleted?: () => void;
};

/* =========================================================
   ENGLISH DIGITS
   ========================================================= */

function toEnglishDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(digit),
      ),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit),
      ),
    );
}

/* =========================================================
   ENGLISH NUMBER FORMAT
   ========================================================= */

function formatEnglishNumber(
  value:
    | number
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const normalized =
    toEnglishDigits(String(value));

  const numericValue =
    Number(normalized);

  if (Number.isNaN(numericValue)) {
    return normalized;
  }

  return new Intl.NumberFormat(
    "en-US",
  ).format(numericValue);
}

/* =========================================================
   ENGLISH SALARY FORMAT
   ========================================================= */

function formatEnglishSalary(
  value:
    | number
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const normalized =
    toEnglishDigits(String(value));

  const numericValue =
    Number(normalized);

  if (Number.isNaN(numericValue)) {
    return normalized;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  ).format(numericValue);
}

/* =========================================================
   ENGLISH DATE
   ========================================================= */

function formatEnglishDate(
  value:
    | string
    | null
    | undefined,
): string {
  if (!value) {
    return "—";
  }

  return toEnglishDigits(value);
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function PayrollTable({
  payrolls,
  loading,
  onGenerate,
  generateLoading = false,
  generateDisabled = false,
  onDeleted,
}: Props) {
  const deleteMutation =
    useDeletePayroll();

  const [
    payrollToDelete,
    setPayrollToDelete,
  ] = useState<Payroll | null>(null);

  const [
    payrollToView,
    setPayrollToView,
  ] = useState<Payroll | null>(null);

  /* =======================================================
     DELETE
     ======================================================= */

  async function confirmDelete() {
    if (!payrollToDelete) {
      return;
    }

    await deleteMutation.mutateAsync(
      payrollToDelete.id,
    );

    setPayrollToDelete(null);

    onDeleted?.();
  }

  return (
    <>
      <section
        className="
          overflow-hidden
          rounded-[22px]
          border border-border/45
          bg-card
          shadow-[0_8px_24px_rgba(31,22,73,0.035)]
        "
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-[17px]
                font-semibold
                leading-tight
                text-foreground
              "
            >
              Payroll history
            </h2>

            <p
              className="
                mt-1
                text-[10.5px]
                leading-tight
                text-muted-foreground
              "
            >
              Employee payment records
            </p>
          </div>

          {/* Generate */}

          {onGenerate ? (
            <button
              type="button"
              disabled={
                generateDisabled ||
                generateLoading
              }
              onClick={onGenerate}
              className="
                inline-flex
                shrink-0
                items-center
                gap-1.5
                px-1.5
                py-1
                text-[12.5px]
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
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {generateLoading ? (
                <Loader2
                  className="
                    size-3.5
                    animate-spin
                  "
                  strokeWidth={2}
                />
              ) : (
                <Plus
                  className="size-3.5"
                  strokeWidth={2}
                />
              )}

              <span>
                {generateLoading
                  ? "Generating..."
                  : "Generate payroll"}
              </span>
            </button>
          ) : null}
        </div>

        {/* =================================================
            CONTENT
           ================================================= */}

        {loading ? (
          <div
            className="
              border-t
              border-border/40
              p-10
              text-center
            "
          >
            <Loader2
              className="
                mx-auto
                size-5
                animate-spin
                text-primary
              "
            />

            <p
              className="
                mt-3
                text-xs
                text-muted-foreground
              "
            >
              Loading payroll...
            </p>
          </div>
        ) : payrolls.length > 0 ? (
          <div
            className="
              border-t
              border-border/40
            "
          >
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  min-w-[820px]
                  text-sm
                "
              >
                {/* =================================================
                    HEAD
                   ================================================= */}

                <thead>
                  <tr
                    className="
                      border-b
                      border-border/40
                      bg-muted/[0.16]
                    "
                  >
                    <th
                      className="
                        px-4
                        py-3
                        text-start
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-muted-foreground
                        sm:px-5
                      "
                    >
                      Period
                    </th>

                    <th
                      className="
                        px-4
                        py-3
                        text-start
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-muted-foreground
                      "
                    >
                      Net salary
                    </th>

                    <th
                      className="
                        px-4
                        py-3
                        text-start
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-muted-foreground
                      "
                    >
                      Payment date
                    </th>

                    <th
                      className="
                        px-4
                        py-3
                        text-start
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-muted-foreground
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-4
                        py-3
                        text-end
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-muted-foreground
                        sm:px-5
                      "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* =================================================
                    BODY
                   ================================================= */}

                <tbody>
                  {payrolls.map(
                    (payroll) => {
                      const paid =
                        Boolean(
                          payroll.payment_date,
                        );

                      return (
                        <tr
                          key={String(
                            payroll.id,
                          )}
                          className="
                            border-b
                            border-border/40
                            last:border-0
                            transition-colors
                            hover:bg-primary/[0.018]
                          "
                        >
                          {/* PERIOD */}

                          <td
                            className="
                              px-4
                              py-4
                              sm:px-5
                            "
                          >
                            <p
                              dir="ltr"
                              className="
                                w-fit
                                text-[13px]
                                font-semibold
                                leading-tight
                                text-foreground
                              "
                            >
                              {formatEnglishNumber(
                                payroll.month,
                              )}
                              /
                              {formatEnglishNumber(
                                payroll.year,
                              )}
                            </p>

                            <p
                              className="
                                mt-1
                                max-w-[190px]
                                truncate
                                text-[10.5px]
                                leading-tight
                                text-muted-foreground
                              "
                            >
                              {getStaffName(
                                payroll.staff,
                              )}
                            </p>
                          </td>

                          {/* NET SALARY */}

                          <td
                            className="
                              px-4
                              py-4
                            "
                          >
                            <p
                              dir="ltr"
                              className="
                                w-fit
                                text-[14px]
                                font-bold
                                leading-tight
                                text-foreground
                              "
                            >
                              {formatEnglishSalary(
                                payroll.net_salary,
                              )}
                            </p>
                          </td>

                          {/* PAYMENT DATE */}

                          <td
                            className="
                              px-4
                              py-4
                            "
                          >
                            <span
                              dir="ltr"
                              className="
                                text-[12px]
                                font-medium
                                leading-tight
                                text-muted-foreground
                              "
                            >
                              {formatEnglishDate(
                                payroll.payment_date,
                              )}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td
                            className="
                              px-4
                              py-4
                            "
                          >
                            <span
                              className={[
                                "inline-flex",
                                "items-center",
                                "gap-1.5",
                                "rounded-full",
                                "px-2.5",
                                "py-1.5",
                                "text-[10px]",
                                "font-semibold",
                                "leading-none",
                                paid
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning",
                              ].join(" ")}
                            >
                              {paid ? (
                                <CheckCircle2
                                  className="size-3.5"
                                  strokeWidth={1.9}
                                />
                              ) : (
                                <Clock3
                                  className="size-3.5"
                                  strokeWidth={1.9}
                                />
                              )}

                              <span>
                                {paid
                                  ? "Paid"
                                  : "Pending"}
                              </span>
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td
                            className="
                              px-4
                              py-4
                              text-end
                              sm:px-5
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                justify-end
                                gap-4
                              "
                            >
                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  setPayrollToView(
                                    payroll,
                                  )
                                }
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
                                  decoration-primary/35
                                  transition-all
                                  duration-200
                                  hover:text-primary/70
                                  hover:decoration-primary
                                  focus-visible:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-primary/30
                                  focus-visible:ring-offset-2
                                "
                              >
                                <Eye
                                  className="size-3.5"
                                  strokeWidth={1.9}
                                />

                                <span>
                                  View
                                </span>
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  setPayrollToDelete(
                                    payroll,
                                  )
                                }
                                disabled={
                                  deleteMutation.isPending
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  px-1
                                  py-1
                                  text-[12px]
                                  font-semibold
                                  text-destructive
                                  underline
                                  underline-offset-4
                                  decoration-destructive/35
                                  transition-all
                                  duration-200
                                  hover:text-destructive/70
                                  hover:decoration-destructive
                                  focus-visible:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-destructive/30
                                  focus-visible:ring-offset-2
                                  disabled:pointer-events-none
                                  disabled:opacity-50
                                "
                              >
                                {deleteMutation.isPending &&
                                payrollToDelete?.id ===
                                  payroll.id ? (
                                  <Loader2
                                    className="
                                      size-3.5
                                      animate-spin
                                    "
                                    strokeWidth={2}
                                  />
                                ) : (
                                  <Trash2
                                    className="size-3.5"
                                    strokeWidth={1.9}
                                  />
                                )}

                                <span>
                                  Delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* =====================================================
             EMPTY
             ===================================================== */

          <div
            className="
              border-t
              border-border/40
              px-5
              py-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-10
                items-center
                justify-center
                rounded-[13px]
                bg-primary/[0.07]
                text-primary
              "
            >
              <CreditCard
                className="size-4"
                strokeWidth={1.8}
              />
            </div>

            <p
              className="
                mt-3
                text-[14px]
                font-semibold
                text-foreground
              "
            >
              No payroll records
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
              No payment records have
              been generated yet.
            </p>
          </div>
        )}
      </section>

      {/* =======================================================
          VIEW DIALOG
         ======================================================= */}

      <PayrollDetailDialog
        payrollId={
          payrollToView?.id ?? null
        }
        onClose={() =>
          setPayrollToView(null)
        }
      />

      {/* =======================================================
          DELETE CONFIRMATION
         ======================================================= */}

      <ConfirmDialog
        open={
          Boolean(
            payrollToDelete,
          )
        }
        title="Delete payroll?"
        description="This payment record will be permanently removed."
        loading={
          deleteMutation.isPending
        }
        onClose={() =>
          setPayrollToDelete(null)
        }
        onConfirm={
          confirmDelete
        }
      />
    </>
  );
}