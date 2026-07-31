import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Eye } from "lucide-react";
import type { Installment } from "../../types/finance.types";

type Props = { installments: Installment[]; onView?: (id: string | number) => void };

function StatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const overdue = new Date() > new Date(dueDate) && status !== "paid";
  const tone = status === "paid" ? "border-success/20 bg-success/10 text-success" : overdue || status === "overdue" ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-info/20 bg-info/10 text-info";
  const label = status === "paid" ? "Paid" : overdue || status === "overdue" ? "Overdue" : "Pending";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>{label}</span>;
}

export function InstallmentsTable({ installments, onView }: Props) {
  if (!installments.length) return <div className="rounded-[18px] border border-dashed border-border/55 bg-muted/15 px-6 py-12 text-center"><h3 className="text-[15px] font-medium text-foreground/88">No installments found</h3><p className="mt-1.5 text-[12.5px] text-muted-foreground/80">Installments appear after a student contract is finalized.</p></div>;
  return (
    <div className="overflow-hidden rounded-[18px] border border-border/45 bg-card">
      <Table>
        <TableHeader><TableRow className="border-border/40 bg-muted/25 hover:bg-muted/25">{['Installment','Amount due','Amount paid','Due date','Status'].map((label)=><TableHead key={label} className="h-11 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">{label}</TableHead>)}<TableHead className="h-11 w-20 text-right text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/80">Action</TableHead></TableRow></TableHeader>
        <TableBody>{installments.map((item)=><TableRow key={item.id} className="border-border/30 hover:bg-primary/[0.025]"><TableCell className="py-4 text-[13px] font-medium text-foreground/88">{item.title}<span className="ml-1.5 text-[11px] font-normal text-muted-foreground">#{item.installmentNumber}</span></TableCell><TableCell className="py-4 text-[13px] font-medium text-foreground/84">{item.amountDue?.toLocaleString()} $</TableCell><TableCell className="py-4 text-[13px] font-medium text-success">{item.amountPaid?.toLocaleString()} $</TableCell><TableCell className="py-4 text-[13px] font-normal text-foreground/76">{new Date(item.dueDate).toLocaleDateString()}</TableCell><TableCell className="py-4"><StatusBadge status={item.status} dueDate={item.dueDate}/></TableCell><TableCell className="py-4 text-right"><button type="button" onClick={()=>onView?.(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary hover:bg-primary/[0.09]" aria-label="View installment"><Eye className="h-4 w-4" strokeWidth={1.8}/></button></TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  );
}
