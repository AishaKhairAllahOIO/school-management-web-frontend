import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Edit2, Eye, GraduationCap, WalletCards } from "lucide-react";

import type { FinancialAccount } from "../../types/finance.types";

type StudentDisplay = {
  fullName: string;
  academicYearName?: string | null;
};

type Props = {
  accounts: FinancialAccount[];
  headerAction?: ReactNode;
  studentsById?: Map<string, StudentDisplay>;
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "border-success/18 bg-success/[0.085] text-success"
      : status === "partially_paid"
        ? "border-warning/20 bg-warning/[0.09] text-warning"
        : "border-destructive/18 bg-destructive/[0.075] text-destructive";

  const label =
    status === "partially_paid"
      ? "Partially paid"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function ContractsTable({
  accounts,
  headerAction,
  studentsById = new Map(),
  onViewDetails,
  onEdit,
}: Props) {
  if (!accounts.length) {
    return (
      <div className="relative rounded-[20px] border border-dashed border-border/55 bg-card px-6 py-14 text-center shadow-[0_10px_30px_rgba(31,22,73,0.035)]">
        {headerAction ? (
          <div className="absolute end-3 top-3">{headerAction}</div>
        ) : null}
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.07] text-primary">
          <WalletCards className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No student contracts yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-5 text-muted-foreground/78">
          Create the first contract to establish a student payment schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/22 hover:bg-muted/22">
            {["Student", "Fee plan", "Total", "Balance", "Status"].map((label) => (
              <TableHead
                key={label}
                className="h-12 px-5 text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75"
              >
                {label}
              </TableHead>
            ))}
            <TableHead className="h-12 w-32 px-4 text-right text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">
              <div className="flex items-center justify-end gap-2.5">
                <span>Actions</span>
                {headerAction}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.map((account) => {
            const student = studentsById.get(String(account.studentId));
            const paid = Math.max(
              0,
              Number(account.totalRequiredAmount ?? 0) - Number(account.remainingBalance ?? 0),
            );
            const progress = account.totalRequiredAmount
              ? Math.min(100, Math.round((paid / account.totalRequiredAmount) * 100))
              : 0;

            return (
              <TableRow
                key={account.id}
                className="border-border/30 transition-colors hover:bg-primary/[0.018]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.06] text-primary">
                      <GraduationCap className="h-[17px] w-[17px]" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-foreground/88">
                        {student?.fullName ?? "Student unavailable"}
                      </p>
                      <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground/72">
                        {student?.academicYearName || "Academic year unavailable"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <p className="text-[13px] font-medium text-foreground/78">
                    {account.feePlan?.name || "—"}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground/65">
                    {account.installmentPolicy?.name || "Payment schedule"}
                  </p>
                </TableCell>

                <TableCell className="px-5 py-4 text-[13px] font-semibold text-foreground/84">
                  {account.totalRequiredAmount?.toLocaleString()} $
                </TableCell>

                <TableCell className="px-5 py-4">
                  <p className="text-[13px] font-semibold text-primary">
                    {account.remainingBalance?.toLocaleString()} $
                  </p>
                  <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-muted/55">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <StatusBadge status={account.paymentStatus} />
                </TableCell>

                <TableCell className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(account)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/[0.09]"
                      aria-label="View contract"
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(account)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary"
                      aria-label="Edit contract"
                    >
                      <Edit2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
