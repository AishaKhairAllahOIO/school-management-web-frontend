import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Installment } from "../../types/finance.types";

type Props = { installments: Installment[]; onView?: (id: string | number) => void };

function StatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const overdue = (new Date() > new Date(dueDate) && status !== "paid") || status === "overdue";
  const classes = status === "paid" ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70" : overdue ? "bg-rose-50 text-rose-700 ring-rose-200/70" : "bg-sky-50 text-sky-700 ring-sky-200/70";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${classes}`}>{status === "paid" ? "Paid" : overdue ? "Overdue" : "Pending"}</span>;
}

export function InstallmentsTable({ installments, onView }: Props) {
  if (!installments.length) return <div className="rounded-[18px] border border-dashed border-border/80 bg-muted/[0.16] px-6 py-14 text-center"><h3 className="font-semibold">No student installments found</h3><p className="mt-1.5 text-sm text-muted-foreground">Installments appear after a student financial contract is finalized.</p></div>;
  return <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background"><Table>
    <TableHeader><TableRow className="border-border/60 bg-muted/[0.18] hover:bg-muted/[0.18]">
      {['STUDENT INSTALLMENT','AMOUNT DUE','AMOUNT PAID','DUE DATE','STATUS'].map(label => <TableHead key={label} className="h-12 px-4 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">{label}</TableHead>)}
      <TableHead className="h-12 px-4 text-right text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">ACTIONS</TableHead>
    </TableRow></TableHeader>
    <TableBody>{installments.map(item => <TableRow key={item.id} className="border-border/50 hover:bg-muted/[0.12]">
      <TableCell className="px-4 py-4 font-medium">{item.title} <span className="ml-1 text-xs font-normal text-muted-foreground">#{item.installmentNumber}</span></TableCell>
      <TableCell className="px-4 py-4 font-medium">{item.amountDue?.toLocaleString()} $</TableCell>
      <TableCell className="px-4 py-4 font-medium text-emerald-700">{item.amountPaid?.toLocaleString()} $</TableCell>
      <TableCell className="px-4 py-4 text-muted-foreground">{new Date(item.dueDate).toLocaleDateString()}</TableCell>
      <TableCell className="px-4 py-4"><StatusBadge status={item.status} dueDate={item.dueDate} /></TableCell>
      <TableCell className="px-4 py-4 text-right"><Button type="button" size="icon" variant="outline" aria-label="View installment" className="h-10 w-10 rounded-full border-border/70 bg-background text-muted-foreground shadow-none hover:border-primary/25 hover:bg-primary/[0.05] hover:text-primary" onClick={() => onView?.(item.id)}><Eye className="h-4 w-4" /></Button></TableCell>
    </TableRow>)}</TableBody>
  </Table></div>;
}
