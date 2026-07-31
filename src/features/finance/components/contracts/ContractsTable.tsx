import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Eye, Edit2 } from "lucide-react";
import { financeIconButton } from "../shared/FinancePrimitives";

import type { FinancialAccount } from "../../types/finance.types";

type Props = {
  accounts: FinancialAccount[];
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

export function ContractsTable({ accounts, onViewDetails, onEdit }: Props) {
  
  // دالة صغيرة لإعطاء لون وشكل لحالة الدفع
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">Paid</span>;
      case "partially_paid":
        return <span className="rounded-full bg-warning/12 px-2.5 py-1 text-xs font-medium text-warning">Partially Paid</span>;
      case "unpaid":
        return <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Unpaid</span>;
      default:
        return <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">{status}</span>;
    }
  };

  if (!accounts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <h3 className="text-lg font-semibold">No Financial Contracts Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Click "Finalize Contract" to generate a financial account for a student.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_30px_rgba(31,25,78,0.055)]">
      <Table>
        <TableHeader>
          <TableRow className="h-12 border-border/65 bg-muted/35 hover:bg-muted/35">
            <TableHead>STUDENT</TableHead>
            <TableHead>FEE PLAN</TableHead>
            <TableHead>TOTAL REQUIRED</TableHead>
            <TableHead>REMAINING</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">
                {account.studentId}
              </TableCell>
              <TableCell>
                {account.feePlan?.name || "N/A"}
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                {account.totalRequiredAmount?.toLocaleString()} $
              </TableCell>
              <TableCell className="font-semibold text-primary">
                {account.remainingBalance?.toLocaleString()} $
              </TableCell>
              <TableCell>
                {getStatusBadge(account.paymentStatus)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2"><Button size="icon" variant="outline" className={financeIconButton} onClick={() => onViewDetails?.(account)} aria-label="View contract"><Eye className="h-4 w-4" /></Button><Button size="icon" variant="outline" className={financeIconButton} onClick={() => onEdit?.(account)} aria-label="Edit contract"><Edit2 className="h-4 w-4" /></Button></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}