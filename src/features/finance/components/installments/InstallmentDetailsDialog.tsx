import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { financeOperationsService } from "../../services/finance-operations.service";

const money = (amount:number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(amount || 0);
const date = (value:string) => value ? new Intl.DateTimeFormat("en-US", { year:"numeric", month:"short", day:"2-digit" }).format(new Date(value)) : "—";

export function InstallmentDetailsDialog({ open, onOpenChange, installmentId }: { open:boolean; onOpenChange:(open:boolean)=>void; installmentId:string|number|null }) {
  const query = useQuery({ queryKey:["installment-details", installmentId], queryFn:()=>financeOperationsService.getInstallmentDetails(installmentId!), enabled:Boolean(installmentId && open), retry:1 });
  const installment=query.data;
  const remaining=Math.max(0,(installment?.amountDue ?? 0)-(installment?.amountPaid ?? 0));
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="overflow-hidden rounded-[24px] border-border/70 p-0 sm:max-w-[520px]">
    <DialogHeader className="border-b border-border/60 px-6 py-5 text-left"><div className="flex items-center gap-3"><div className="rounded-2xl bg-primary/[0.08] p-2.5 text-primary"><CalendarDays className="h-5 w-5"/></div><div><DialogTitle>Student Installment Details</DialogTitle><DialogDescription>Review the due date, payment status, and remaining student balance.</DialogDescription></div></div></DialogHeader>
    <div className="p-6">{query.isLoading ? <div className="space-y-4">{[1,2,3,4].map(i=><div key={i} className="h-14 animate-pulse rounded-2xl bg-muted/70"/>)}</div> : query.isError || !installment ? <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.06] p-5 text-sm text-destructive">The installment details could not be loaded. The response format or requested installment may be unavailable.</div> : <div className="space-y-5">
      <div className="rounded-[20px] border border-primary/15 bg-primary/[0.045] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">Student installment</p><h3 className="mt-2 text-xl font-bold text-foreground">{installment.title}</h3><p className="mt-1 text-sm text-muted-foreground">Installment #{installment.installmentNumber || "—"}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${installment.status==="paid"?"bg-success/12 text-success":installment.status==="overdue"?"bg-destructive/10 text-destructive":"bg-info/10 text-info"}`}>{installment.status.replaceAll("_"," ")}</span></div></div>
      <div className="grid gap-3 sm:grid-cols-2"><Info label="Due date" value={date(installment.dueDate)}/><Info label="Amount due" value={money(installment.amountDue)}/><Info label="Amount paid" value={money(installment.amountPaid)} positive/><Info label="Remaining balance" value={money(remaining)} emphasis/></div>
    </div>}</div>
  </DialogContent></Dialog>;
}
function Info({label,value,positive,emphasis}:{label:string;value:string;positive?:boolean;emphasis?:boolean}){return <div className={`rounded-2xl border p-4 ${emphasis?"border-primary/20 bg-primary/[0.055]":"border-border/65 bg-muted/25"}`}><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`mt-2 text-base font-bold ${positive?"text-success":emphasis?"text-primary":"text-foreground"}`}>{value}</p></div>}
