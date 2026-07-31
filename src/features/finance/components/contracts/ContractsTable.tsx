import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Edit3, Eye } from "lucide-react";
import type { FinancialAccount } from "../../types/finance.types";

type Props = { accounts: FinancialAccount[]; onViewDetails?: (account: FinancialAccount) => void; onEdit?: (account: FinancialAccount) => void };

function StatusBadge({ status }: { status: string }) {
  const styles = status === "paid"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
    : status === "partially_paid"
      ? "bg-amber-50 text-amber-700 ring-amber-200/70"
      : "bg-rose-50 text-rose-700 ring-rose-200/70";
  const label = status === "partially_paid" ? "Partially Paid" : status === "paid" ? "Paid" : "Unpaid";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>{label}</span>;
}

export function ContractsTable({ accounts, onViewDetails, onEdit }: Props) {
  if (!accounts.length) return <div className="rounded-[18px] border border-dashed border-border/80 bg-muted/[0.16] px-6 py-14 text-center"><h3 className="font-semibold text-foreground">No student contracts yet</h3><p className="mt-1.5 text-sm text-muted-foreground">Finalize a contract to create the student's financial account and installment schedule.</p></div>;
  return <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background">
    <Table>
      <TableHeader><TableRow className="border-border/60 bg-muted/[0.18] hover:bg-muted/[0.18]">
        {['STUDENT','FEE PLAN','TOTAL REQUIRED','REMAINING','STATUS'].map(label => <TableHead key={label} className="h-12 px-4 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">{label}</TableHead>)}
        <TableHead className="h-12 px-4 text-right text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">ACTIONS</TableHead>
      </TableRow></TableHeader>
      <TableBody>{accounts.map(account => <TableRow key={account.id} className="border-border/50 hover:bg-muted/[0.12]">
        <TableCell className="px-4 py-4 font-medium text-foreground">Student #{account.studentId}</TableCell>
        <TableCell className="px-4 py-4 text-muted-foreground">{account.feePlan?.name || '—'}</TableCell>
        <TableCell className="px-4 py-4 font-medium">{account.totalRequiredAmount?.toLocaleString()} $</TableCell>
        <TableCell className="px-4 py-4 font-medium text-primary">{account.remainingBalance?.toLocaleString()} $</TableCell>
        <TableCell className="px-4 py-4"><StatusBadge status={account.paymentStatus} /></TableCell>
        <TableCell className="px-4 py-4"><div className="flex justify-end gap-2">
          <Button type="button" size="icon" variant="outline" aria-label="View student contract" className="h-10 w-10 rounded-full border-border/70 bg-background text-muted-foreground shadow-none hover:border-primary/25 hover:bg-primary/[0.05] hover:text-primary" onClick={() => onViewDetails?.(account)}><Eye className="h-4 w-4" /></Button>
          <Button type="button" size="icon" variant="outline" aria-label="Edit student contract" className="h-10 w-10 rounded-full border-primary/20 bg-primary/[0.03] text-primary shadow-none hover:border-primary/35 hover:bg-primary/[0.08]" onClick={() => onEdit?.(account)}><Edit3 className="h-4 w-4" /></Button>
        </div></TableCell>
      </TableRow>)}</TableBody>
    </Table>
  </div>;
}
