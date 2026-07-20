 import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Trash2, Edit2, Eye } from "lucide-react";
import type { PaymentReceipt } from "../../types/finance.types";

type Props = {
  payments: PaymentReceipt[];
  onView?: (paymentId: string | number) => void;    
  onEdit?: (payment: PaymentReceipt) => void;
  onDelete?: (paymentId: string | number) => void;  
};


export function PaymentsTable({ payments, onView, onEdit, onDelete }: Props) {
  
  const formatMethod = (method: string) => {
    switch (method) {
      case "cash": return "Cash";
      case "bank_transfer": return "Bank Transfer";
      case "cheque": return "Cheque";
      case "electronic_wallet": return "E-Wallet";
      default: return method;
    }
  };

  if (!payments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <h3 className="text-lg font-semibold">No Payments Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Click "Process Payment" to record a new receipt.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/30">
            <TableHead>Receipt ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference / Paper No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium text-gray-600">
                #{payment.id}
              </TableCell>
              <TableCell className="font-bold text-green-600">
                + {payment.paidAmount?.toLocaleString()} $
              </TableCell>
              <TableCell>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {formatMethod(payment.paymentMethod)}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {payment.paperReceiptNo || payment.digitalReference || "—"}
              </TableCell>
              <TableCell className="text-sm">
                {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 mr-1"
                  onClick={() => onView && onView(payment.id)} // 2. 🔴 تم تصحيح حرف الـ v ليصبح V
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 mr-1"
                  onClick={() => onEdit && onEdit(payment)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onDelete && onDelete(payment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>          
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}