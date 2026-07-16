import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Eye } from "lucide-react";
import type { Installment } from "../../types/finance.types";
import { Button } from "@/shared/ui/button";

type Props = {
  installments: Installment[];
  onView?: (id: string | number) => void;
};


export function InstallmentsTable({ installments, onView }: Props) {
  
  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date() > new Date(dueDate) && status !== "paid";

    if (status === "paid") {
      return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Paid</span>;
    }
    if (isOverdue || status === "overdue") {
      return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 animate-pulse">Overdue</span>;
    }
    return <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">Pending</span>;
  };

  if (!installments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <h3 className="text-lg font-semibold">No Installments Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Installments will be generated once a financial contract is finalized.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/30">
            <TableHead>Installment</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>

            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((installment) => (
            <TableRow key={installment.id}>
              <TableCell className="font-medium text-gray-800">
                {installment.title} <span className="text-muted-foreground text-xs ml-1">(#{installment.installmentNumber})</span>
              </TableCell>
              <TableCell className="font-bold text-gray-700">
                {installment.amountDue?.toLocaleString()} $
              </TableCell>
              <TableCell className="font-semibold text-green-600">
                {installment.amountPaid?.toLocaleString()} $
              </TableCell>
              <TableCell className="text-sm">
                {new Date(installment.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {getStatusBadge(installment.status, installment.dueDate)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => onView && onView(installment.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}