import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Banknote, Edit2, Eye, ReceiptText, Trash2 } from "lucide-react";
import type { PaymentReceipt } from "../../types/finance.types";

type Props = {
  payments: PaymentReceipt[];
  headerAction?: ReactNode;
  onView?: (paymentId: string | number) => void;
  onEdit?: (payment: PaymentReceipt) => void;
  onDelete?: (paymentId: string | number) => void;
};

const methodLabel = (method: string) =>
  ({
    cash: "Cash",
    bank_transfer: "Bank transfer",
    cheque: "Cheque",
    electronic_wallet: "E-wallet",
  })[method] ?? method;

export function PaymentsTable({
  payments,
  headerAction,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (!payments.length) {
    return (
      <div className="relative rounded-[20px] border border-dashed border-border/55 bg-card px-6 py-14 text-center shadow-[0_10px_30px_rgba(31,22,73,0.035)]">
        {headerAction ? (
          <div className="absolute end-3 top-3">{headerAction}</div>
        ) : null}
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-success/[0.08] text-success">
          <ReceiptText className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No payments recorded
        </h3>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground/78">
          Process a payment to generate the first official receipt.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/22 hover:bg-muted/22">
            {["Payment", "Amount", "Method", "Reference", "Date"].map((label) => (
              <TableHead
                key={label}
                className="h-12 px-5 text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75"
              >
                {label}
              </TableHead>
            ))}
            <TableHead className="h-12 w-36 px-4 text-right text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">
              <div className="flex items-center justify-end gap-2.5">
                <span>Actions</span>
                {headerAction}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => (
            <TableRow
              key={payment.id}
              className="border-border/30 transition-colors hover:bg-success/[0.018]"
            >
              <TableCell className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary/[0.065] text-primary">
                    <ReceiptText className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground/86">Student payment</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground/65">Official receipt</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-5 py-4">
                <div className="flex items-center gap-2 text-success">
                  <Banknote className="h-4 w-4" strokeWidth={1.8} />
                  <span className="text-[13.5px] font-semibold">
                    {payment.paidAmount?.toLocaleString()} $
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-5 py-4">
                <span className="rounded-full border border-border/45 bg-muted/35 px-2.5 py-1 text-[11px] font-medium text-foreground/72">
                  {methodLabel(payment.paymentMethod)}
                </span>
              </TableCell>

              <TableCell className="max-w-[190px] px-5 py-4 text-[12.5px] text-muted-foreground">
                <span className="block truncate">
                  {payment.paperReceiptNo || payment.digitalReference || "—"}
                </span>
              </TableCell>

              <TableCell className="px-5 py-4 text-[12.5px] text-foreground/74">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString()
                  : "—"}
              </TableCell>

              <TableCell className="px-5 py-4 text-right">
                <div className="inline-flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView?.(payment.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/[0.09]"
                    aria-label="View receipt"
                  >
                    <Eye className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(payment)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary"
                    aria-label="Edit payment"
                  >
                    <Edit2 className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(payment.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-destructive/15 bg-destructive/[0.045] text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/[0.09]"
                    aria-label="Delete payment"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
