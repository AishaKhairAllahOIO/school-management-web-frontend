import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Edit3, Eye, Trash2 } from "lucide-react";
import type { PaymentReceipt } from "../../types/finance.types";

type Props = { payments: PaymentReceipt[]; onView?: (paymentId: string | number) => void; onEdit?: (payment: PaymentReceipt) => void; onDelete?: (paymentId: string | number) => void };
const formatMethod = (value: string) => ({ cash: 'Cash', bank_transfer: 'Bank Transfer', cheque: 'Cheque', electronic_wallet: 'E-Wallet' }[value] ?? value);

export function PaymentsTable({ payments, onView, onEdit, onDelete }: Props) {
  if (!payments.length) return <div className="rounded-[18px] border border-dashed border-border/80 bg-muted/[0.16] px-6 py-14 text-center"><h3 className="font-semibold">No student payments found</h3><p className="mt-1.5 text-sm text-muted-foreground">Process a payment to create the first student receipt.</p></div>;
  return <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background"><Table>
    <TableHeader><TableRow className="border-border/60 bg-muted/[0.18] hover:bg-muted/[0.18]">
      {['RECEIPT','AMOUNT','METHOD','REFERENCE','DATE'].map(label => <TableHead key={label} className="h-12 px-4 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">{label}</TableHead>)}
      <TableHead className="h-12 px-4 text-right text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">ACTIONS</TableHead>
    </TableRow></TableHeader>
    <TableBody>{payments.map(payment => <TableRow key={payment.id} className="border-border/50 hover:bg-muted/[0.12]">
      <TableCell className="px-4 py-4 font-medium">#{payment.id}</TableCell>
      <TableCell className="px-4 py-4 font-semibold text-emerald-700">+ {payment.paidAmount?.toLocaleString()} $</TableCell>
      <TableCell className="px-4 py-4"><span className="rounded-full bg-muted/55 px-2.5 py-1 text-xs font-medium text-foreground">{formatMethod(payment.paymentMethod)}</span></TableCell>
      <TableCell className="px-4 py-4 text-muted-foreground">{payment.paperReceiptNo || payment.digitalReference || '—'}</TableCell>
      <TableCell className="px-4 py-4 text-muted-foreground">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '—'}</TableCell>
      <TableCell className="px-4 py-4"><div className="flex justify-end gap-2">
        <Button type="button" size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/70 bg-background text-muted-foreground shadow-none hover:border-primary/25 hover:bg-primary/[0.05] hover:text-primary" onClick={() => onView?.(payment.id)}><Eye className="h-4 w-4" /></Button>
        <Button type="button" size="icon" variant="outline" className="h-10 w-10 rounded-full border-primary/20 bg-primary/[0.03] text-primary shadow-none hover:border-primary/35 hover:bg-primary/[0.08]" onClick={() => onEdit?.(payment)}><Edit3 className="h-4 w-4" /></Button>
        <Button type="button" size="icon" variant="outline" className="h-10 w-10 rounded-full border-rose-200/80 bg-background text-rose-500 shadow-none hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600" onClick={() => onDelete?.(payment.id)}><Trash2 className="h-4 w-4" /></Button>
      </div></TableCell>
    </TableRow>)}</TableBody>
  </Table></div>;
}
