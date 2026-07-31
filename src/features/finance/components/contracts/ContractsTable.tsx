import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table";
import { Eye, Edit2 } from "lucide-react";
import type { FinancialAccount } from "../../types/finance.types";

type Props = {
  accounts: FinancialAccount[];
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

function StatusBadge({ status }: { status: string }) {
  const tone = status === "paid"
    ? "border-success/20 bg-success/10 text-success"
    : status === "partially_paid"
      ? "border-warning/20 bg-warning/10 text-warning"
      : "border-destructive/20 bg-destructive/10 text-destructive";
  const label = status === "partially_paid" ? "Partially paid" : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>{label}</span>;
}

export function ContractsTable({ accounts, onViewDetails, onEdit }: Props) {
  if (!accounts.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-border/55 bg-muted/15 px-6 py-12 text-center">
        <h3 className="text-[15px] font-medium text-foreground/88">No student contracts yet</h3>
        <p className="mt-1.5 text-[12.5px] font-normal text-muted-foreground/80">Create a contract to generate the student financial schedule.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-border/45 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/25 hover:bg-muted/25">
            {['Student','Fee plan','Total required','Remaining','Status'].map((label) => (
              <TableHead key={label} className="h-11 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">{label}</TableHead>
            ))}
            <TableHead className="h-11 w-24 text-right text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} className="border-border/30 transition-colors hover:bg-primary/[0.025]">
              <TableCell className="py-4 text-[13px] font-medium text-foreground/88">#{account.studentId}</TableCell>
              <TableCell className="py-4 text-[13px] font-normal text-foreground/78">{account.feePlan?.name || '—'}</TableCell>
              <TableCell className="py-4 text-[13px] font-medium text-foreground/85">{account.totalRequiredAmount?.toLocaleString()} $</TableCell>
              <TableCell className="py-4 text-[13px] font-medium text-primary">{account.remainingBalance?.toLocaleString()} $</TableCell>
              <TableCell className="py-4"><StatusBadge status={account.paymentStatus} /></TableCell>
              <TableCell className="py-4 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <button type="button" onClick={() => onViewDetails?.(account)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary transition-colors hover:bg-primary/[0.09]" aria-label="View contract"><Eye className="h-4 w-4" strokeWidth={1.8} /></button>
                  <button type="button" onClick={() => onEdit?.(account)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary" aria-label="Edit contract"><Edit2 className="h-4 w-4" strokeWidth={1.8} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
