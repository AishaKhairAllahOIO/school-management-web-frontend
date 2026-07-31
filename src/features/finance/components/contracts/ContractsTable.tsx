import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Edit2, Eye, UserRound } from "lucide-react";

import type { FinancialAccount } from "../../types/finance.types";

type StudentDisplay = {
  fullName: string;
  academicYearName?: string | null;
};

type Props = {
  accounts: FinancialAccount[];
  studentsById?: Map<string, StudentDisplay>;
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "border-success/20 bg-success/10 text-success"
      : status === "partially_paid"
        ? "border-warning/20 bg-warning/10 text-warning"
        : "border-destructive/20 bg-destructive/10 text-destructive";

  const label =
    status === "partially_paid"
      ? "Partially paid"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}
    >
      {label}
    </span>
  );
}

export function ContractsTable({
  accounts,
  studentsById = new Map(),
  onViewDetails,
  onEdit,
}: Props) {
  if (!accounts.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-border/45 bg-card px-6 py-12 text-center shadow-[var(--shadow-card)]">
        <h3 className="text-[15px] font-medium text-foreground/85">
          No student contracts yet
        </h3>
        <p className="mt-1.5 text-[12.5px] font-normal text-muted-foreground/80">
          Create a contract to generate the student financial schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/40 bg-card shadow-[var(--shadow-card)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/35 bg-muted/20 hover:bg-muted/20">
            {[
              "Student",
              "Fee plan",
              "Total required",
              "Remaining",
              "Status",
            ].map((label) => (
              <TableHead
                key={label}
                className="h-12 px-5 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/75"
              >
                {label}
              </TableHead>
            ))}
            <TableHead className="h-12 w-28 px-5 text-right text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/75">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.map((account) => {
            const student = studentsById.get(String(account.studentId));

            return (
              <TableRow
                key={account.id}
                className="border-border/25 transition-colors hover:bg-primary/[0.02]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/12 bg-primary/[0.055] text-primary">
                      <UserRound className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground/85">
                        {student?.fullName ?? "Student unavailable"}
                      </p>
                      {student?.academicYearName ? (
                        <p className="mt-0.5 truncate text-[11.5px] font-normal text-muted-foreground/75">
                          {student.academicYearName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4 text-[13px] font-normal text-foreground/75">
                  {account.feePlan?.name || "—"}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-medium text-foreground/82">
                  {account.totalRequiredAmount?.toLocaleString()} $
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-medium text-primary">
                  {account.remainingBalance?.toLocaleString()} $
                </TableCell>
                <TableCell className="px-5 py-4">
                  <StatusBadge status={account.paymentStatus} />
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(account)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white text-primary transition-colors hover:border-primary/25 hover:bg-primary/[0.045]"
                      aria-label="View contract"
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(account)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-white text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary"
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
