import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Trash2, Edit2, Eye } from "lucide-react";
import type { PaymentReceipt } from "../../types/finance.types";

type Props = { payments: PaymentReceipt[]; onView?: (paymentId: string | number) => void; onEdit?: (payment: PaymentReceipt) => void; onDelete?: (paymentId: string | number) => void };

const methodLabel = (method: string) => ({ cash: "Cash", bank_transfer: "Bank transfer", cheque: "Cheque", electronic_wallet: "E-wallet" }[method] ?? method);

export function PaymentsTable({ payments, onView, onEdit, onDelete }: Props) {
  if (!payments.length) return <div className="rounded-[18px] border border-dashed border-border/55 bg-muted/15 px-6 py-12 text-center"><h3 className="text-[15px] font-medium text-foreground/88">No payments recorded</h3><p className="mt-1.5 text-[12.5px] text-muted-foreground/80">Process a payment to create the first receipt.</p></div>;
  return (
    <div className="overflow-hidden rounded-[18px] border border-border/45 bg-card">
      <Table>
        <TableHeader><TableRow className="border-border/40 bg-muted/25 hover:bg-muted/25">{['Receipt','Amount','Method','Reference','Date'].map(label=><TableHead key={label} className="h-11 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">{label}</TableHead>)}<TableHead className="h-11 w-32 text-right text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{payments.map(payment=><TableRow key={payment.id} className="border-border/30 hover:bg-primary/[0.025]"><TableCell className="py-4 text-[13px] font-medium text-foreground/85">#{payment.id}</TableCell><TableCell className="py-4 text-[13px] font-medium text-success">+ {payment.paidAmount?.toLocaleString()} $</TableCell><TableCell className="py-4"><span className="rounded-full border border-border/45 bg-muted/35 px-2.5 py-1 text-[11px] font-medium text-foreground/70">{methodLabel(payment.paymentMethod)}</span></TableCell><TableCell className="py-4 text-[12.5px] font-normal text-muted-foreground">{payment.paperReceiptNo || payment.digitalReference || '—'}</TableCell><TableCell className="py-4 text-[12.5px] font-normal text-foreground/74">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '—'}</TableCell><TableCell className="py-4 text-right"><div className="inline-flex gap-1.5"><button type="button" onClick={()=>onView?.(payment.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary hover:bg-primary/[0.09]" aria-label="View receipt"><Eye className="h-4 w-4" strokeWidth={1.8}/></button><button type="button" onClick={()=>onEdit?.(payment)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary" aria-label="Edit payment"><Edit2 className="h-4 w-4" strokeWidth={1.8}/></button><button type="button" onClick={()=>onDelete?.(payment.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-destructive/15 bg-destructive/[0.045] text-destructive hover:bg-destructive/[0.09]" aria-label="Delete payment"><Trash2 className="h-4 w-4" strokeWidth={1.8}/></button></div></TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  );
}
