import {
  CheckCircle2,
  Clock3,
  CreditCard,
} from "lucide-react";

import { formatSalary, getStaffName } from "../utils/payroll.utils";

import type { Payroll } from "../types/payroll.types";

type Props = {
  payrolls: Payroll[];
  loading: boolean;

  onSelect: (payroll: Payroll) => void;

  /**
   * Called when the user clicks Generate.
   * The actual preview logic remains in the profile page.
   */
  onGenerate?: () => void;

  /**
   * Used while generating payroll preview.
   */
  generateLoading?: boolean;

  /**
   * Disable Generate when there is no active contract.
   */
  generateDisabled?: boolean;
};

export function PayrollTable({
  payrolls,
  loading,
  onSelect,
  onGenerate,
  generateLoading = false,
  generateDisabled = false,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/45 bg-card shadow-[0_10px_30px_rgba(31,22,73,0.035)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead>
            {/* ============================================================
                PAYROLL TITLE ROW
                This is INSIDE the table.
                Generate is on the far right of the same row.
               ============================================================ */}
            <tr className="border-b border-border/45">
              <th
                colSpan={4}
                className="px-4 py-3.5 text-start sm:px-5"
              >
                <div className="flex w-full items-center justify-between gap-4">
                  {/* Left side */}
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-foreground">
                      Payroll history
                    </h2>

                    <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                      Employee payment records
                    </p>
                  </div>

                  {/* Right side */}
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
                        h-8
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-primary
                        px-3
                        text-xs
                        font-semibold
                        text-primary-foreground
                        shadow-sm
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:opacity-90
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/30
                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >
                      <CreditCard
                        className="size-3.5"
                        strokeWidth={1.9}
                      />

                      {generateLoading
                        ? "Generating..."
                        : "Generate"}
                    </button>
                  ) : null}
                </div>
              </th>
            </tr>

            {/* ============================================================
                COLUMN HEADERS
               ============================================================ */}
            <tr className="border-b border-border/40 bg-muted/15">
              <th
                className="
                  px-4
                  py-2.5
                  text-start
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Period
              </th>

              <th
                className="
                  px-4
                  py-2.5
                  text-start
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Salary
              </th>

              <th
                className="
                  px-4
                  py-2.5
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
                  py-2.5
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
            </tr>
          </thead>

          {/* ==============================================================
              LOADING
             ============================================================== */}
          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center"
                >
                  <p className="text-xs text-muted-foreground">
                    Loading payroll...
                  </p>
                </td>
              </tr>
            </tbody>
          ) : payrolls.length > 0 ? (
            /* ============================================================
               PAYROLL DATA
               ============================================================ */
            <tbody>
              {payrolls.map((payroll) => {
                const paid = Boolean(
                  payroll.payment_date,
                );

                return (
                  <tr
                    key={String(payroll.id)}
                    onClick={() =>
                      onSelect(payroll)
                    }
                    className="
                      cursor-pointer
                      border-b
                      border-border/40
                      last:border-0
                      transition-colors
                      hover:bg-primary/[0.025]
                    "
                  >
                    {/* Period */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground">
                        {payroll.month}/
                        {payroll.year}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {getStaffName(
                          payroll.staff,
                        )}
                      </p>
                    </td>

                    {/* Salary */}
                    <td className="px-4 py-3.5 font-bold text-foreground">
                      {formatSalary(
                        payroll.net_salary,
                      )}
                    </td>

                    {/* Payment date */}
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      {payroll.payment_date ??
                        "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={[
                          "inline-flex",
                          "items-center",
                          "gap-1.5",
                          "rounded-full",
                          "px-2.5",
                          "py-1",
                          "text-[10px]",
                          "font-semibold",
                          paid
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning",
                        ].join(" ")}
                      >
                        {paid ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <Clock3 className="size-3" />
                        )}

                        {paid
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            /* ============================================================
               EMPTY STATE
               ============================================================ */
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center"
                >
                  <div className="mx-auto flex size-11 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
                    <CreditCard
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-foreground">
                    No payroll records
                  </p>

                  <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-muted-foreground">
                    No payments have been committed yet.
                  </p>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}