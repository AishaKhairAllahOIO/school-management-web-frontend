import {
  MoreHorizontal,
  Plus,
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
};

export function ContractsTable({
  contracts,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="soft-card rounded-2xl p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Loading contracts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soft-card rounded-2xl p-10 text-center">
        <p className="text-sm text-destructive">
          Failed to load contracts.
        </p>
      </div>
    );
  }

  return (
    <section className="soft-card overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/70 p-4">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Financial Contracts
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Staff salary agreements
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex h-9 items-center gap-2
            rounded-xl bg-primary px-3.5
            text-xs font-semibold
            text-primary-foreground
            shadow-sm
            transition
            hover:opacity-90
          "
        >
          <Plus className="size-4" />
          Add Contract
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">
                Staff
              </th>

              <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">
                Salary Type
              </th>

              <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">
                Amount
              </th>

              <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">
                Academic Year
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody>
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                className="
                  border-b border-border/50
                  last:border-0
                  transition
                  hover:bg-muted/30
                "
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex size-9 items-center justify-center
                        rounded-xl
                        bg-primary/10
                        text-xs font-bold
                        text-primary
                      "
                    >
                      {getInitials(contract)}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {getStaffName(contract)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Staff #{contract.staff_id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className="
                      inline-flex rounded-full
                      bg-primary/10 px-2.5 py-1
                      text-xs font-semibold text-primary
                    "
                  >
                    {getSalaryTypeLabel(
                      contract.salary_type,
                    )}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="font-bold text-foreground">
                    {formatSalary(
                      contract.salary_amount,
                    )}
                  </span>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {contract.academicYear?.name ??
                    `#${contract.academic_year}`}
                </td>

                <td className="px-3 py-4">
                  <button
                    type="button"
                    className="
                      flex size-8 items-center justify-center
                      rounded-lg text-muted-foreground
                      hover:bg-muted hover:text-foreground
                    "
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!contracts.length && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Plus className="size-5" />
          </div>

          <h3 className="text-sm font-bold text-foreground">
            No contracts yet
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Create a financial contract for a staff member.
          </p>
        </div>
      )}
    </section>
  );
}

function getStaffName(
  contract: StaffFinancialContract,
) {
  const staff = contract.staff;

  return (
    staff?.full_name ??
    staff?.name ??
    ([staff?.first_name, staff?.last_name]
      .filter(Boolean)
      .join(" ") || `Staff #${contract.staff_id}`)
  );
}

function getInitials(
  contract: StaffFinancialContract,
) {
  const name = getStaffName(contract);

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}