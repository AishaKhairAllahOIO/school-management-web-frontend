import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import {
  formatSalary,
  getStaffName,
} from "../utils/payroll.utils";

import type { Payroll } from "../types/payroll.types";

export function PayrollTable({
  payrolls,
  loading,
  onSelect,
}: {
  payrolls: Payroll[];
  loading: boolean;
  onSelect: (payroll: Payroll) => void;
}) {
  if (loading) {
    return (
      <div className="soft-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
        Loading payroll...
      </div>
    );
  }

  return (
    <section className="soft-card overflow-hidden rounded-2xl">
      <div className="border-b border-border/70 p-4">
        <h2 className="text-sm font-bold text-foreground">
          Monthly Payroll
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Staff payments for the selected month.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-5 py-3 text-start text-xs text-muted-foreground">
                Staff
              </th>

              <th className="px-5 py-3 text-start text-xs text-muted-foreground">
                Salary
              </th>

              <th className="px-5 py-3 text-start text-xs text-muted-foreground">
                Payment date
              </th>

              <th className="px-5 py-3 text-start text-xs text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {payrolls.map((payroll) => {
              const paid =
                Boolean(
                  payroll.payment_date,
                );

              return (
                <tr
                  key={payroll.id}
                  onClick={() =>
                    onSelect(payroll)
                  }
                  className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-4 font-semibold text-foreground">
                    {getStaffName(
                      payroll.staff,
                    )}
                  </td>

                  <td className="px-5 py-4 font-bold">
                    {formatSalary(
                      payroll.net_salary,
                    )}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {payroll.payment_date ??
                      "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        rounded-full px-2.5 py-1
                        text-xs font-semibold
                        ${
                          paid
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }
                      `}
                    >
                      {paid ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Clock3 className="size-3.5" />
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
        </table>
      </div>

      {!payrolls.length && (
        <div className="p-12 text-center">
          <p className="text-sm font-semibold text-foreground">
            No payroll records
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            No payments have been committed for this month.
          </p>
        </div>
      )}
    </section>
  );
}