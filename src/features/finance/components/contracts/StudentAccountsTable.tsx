import { Edit2, Eye, FilePlus2, GraduationCap } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import type { FinancialAccount } from "../../types/finance.types";

export type StudentFinanceRow = {
  studentId: string | number;
  enrollmentId: string | number;
  fullName: string;
  academicYearName?: string | null;
  account?: FinancialAccount;
};

type Props = {
  rows: StudentFinanceRow[];
  onView: (row: StudentFinanceRow) => void;
  onCreate: (row: StudentFinanceRow) => void;
  onEdit: (row: StudentFinanceRow) => void;
};

function StatusBadge({ account }: { account?: FinancialAccount }) {
  if (!account) {
    return (
      <span className="inline-flex rounded-full border border-border/55 bg-muted/25 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        Not configured
      </span>
    );
  }

  const resolvedStatus =
    Number(account.remainingBalance) <= 0 ? "paid" : account.paymentStatus;

  const tone =
    resolvedStatus === "paid"
      ? "border-success/18 bg-success/[0.085] text-success"
      : resolvedStatus === "partially_paid"
        ? "border-warning/20 bg-warning/[0.09] text-warning"
        : "border-destructive/18 bg-destructive/[0.075] text-destructive";

  const label =
    resolvedStatus === "paid"
      ? "Fully paid"
      : resolvedStatus === "partially_paid"
        ? "Partially paid"
        : resolvedStatus.charAt(0).toUpperCase() + resolvedStatus.slice(1);

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function StudentAccountsTable({
  rows,
  onView,
  onCreate,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/22 hover:bg-muted/22">
            {["Student", "Financial setup", "Total", "Balance", "Status"].map(
              (label) => (
                <TableHead
                  key={label}
                  className="h-12 px-5 text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75"
                >
                  {label}
                </TableHead>
              ),
            )}
            <TableHead className="h-12 w-36 px-4 text-right text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">
              <span>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const account = row.account;
            return (
              <TableRow
                key={String(row.studentId)}
                className="border-border/30 transition-colors hover:bg-primary/[0.018]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.06] text-primary">
                      <GraduationCap className="h-[17px] w-[17px]" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-foreground/88">
                        {row.fullName}
                      </p>
                      <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground/72">
                        {row.academicYearName || "Active enrollment"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <p className="text-[13px] font-medium text-foreground/78">
                    {account?.feePlan?.name || "No financial contract"}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground/65">
                    {account?.installmentPolicy?.name || "Setup required"}
                  </p>
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-semibold text-foreground/84">
                  {account ? `${account.totalRequiredAmount.toLocaleString()} $` : "—"}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-semibold text-primary">
                  {account ? `${account.remainingBalance.toLocaleString()} $` : "—"}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <StatusBadge account={account} />
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/[0.09]"
                      aria-label={`Open ${row.fullName} financial profile`}
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    {account ? (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary"
                        aria-label={`Edit ${row.fullName} contract`}
                      >
                        <Edit2 className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCreate(row)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-success/20 bg-success/[0.06] text-success transition-all hover:-translate-y-0.5 hover:bg-success/[0.1]"
                        aria-label={`Create ${row.fullName} contract`}
                      >
                        <FilePlus2 className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    )}
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
