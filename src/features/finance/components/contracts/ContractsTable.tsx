import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Eye , Edit2} from "lucide-react";

import type { FinancialAccount } from "../../types/finance.types";

type Props = {
  accounts: FinancialAccount[];
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

export function ContractsTable({ accounts, onViewDetails }: Props) {
  
  // دالة صغيرة لإعطاء لون وشكل لحالة الدفع
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Paid</span>;
      case "partially_paid":
        return <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">Partially Paid</span>;
      case "unpaid":
        return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Unpaid</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{status}</span>;
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
    <div className="overflow-hidden rounded-2xl border shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/30">
            <TableHead>Student ID</TableHead>
            <TableHead>Fee Plan</TableHead>
            <TableHead>Total Required</TableHead>
            <TableHead>Remaining Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
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
              <TableCell className="font-semibold text-gray-700">
                {account.totalRequiredAmount?.toLocaleString()} $
              </TableCell>
              <TableCell className="font-semibold text-violet-700">
                {account.remainingBalance?.toLocaleString()} $
              </TableCell>
              <TableCell>
                {getStatusBadge(account.paymentStatus)}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onViewDetails && onViewDetails(account)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}