import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

export function FinanceSectionHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div><h1 className="text-[26px] font-bold tracking-[-0.03em] text-foreground">{title}</h1><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>{action}
  </div>;
}

export function FinanceTableSkeleton({ columns = 6, rows = 5 }: { columns?: number; rows?: number }) {
  return <div className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_30px_rgba(31,25,78,0.055)]">
    <div className="grid h-12 items-center gap-4 border-b border-border/65 bg-muted/35 px-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>{Array.from({length: columns}).map((_,i)=><div key={i} className="h-3 w-20 max-w-full animate-pulse rounded-full bg-muted" />)}</div>
    {Array.from({length: rows}).map((_,r)=><div key={r} className="grid min-h-16 items-center gap-4 border-b border-border/55 px-4 last:border-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>{Array.from({length: columns}).map((_,c)=><div key={c} className={`h-4 animate-pulse rounded-full bg-muted/80 ${c===columns-1?'ml-auto w-9':'w-24 max-w-full'}`} />)}</div>)}
  </div>;
}

export function FinancePageSkeleton({ columns = 6 }: { columns?: number }) {
  return <div className="space-y-6"><div className="flex justify-between"><div className="space-y-3"><div className="h-8 w-56 animate-pulse rounded-lg bg-muted"/><div className="h-4 w-[28rem] max-w-full animate-pulse rounded-full bg-muted/80"/></div><div className="h-11 w-44 animate-pulse rounded-[14px] bg-muted"/></div><FinanceTableSkeleton columns={columns}/></div>;
}

export function FinanceConfirmDialog({ open, onOpenChange, title, description, confirmLabel="Delete", pending=false, onConfirm }: { open:boolean; onOpenChange:(v:boolean)=>void; title:string; description:string; confirmLabel?:string; pending?:boolean; onConfirm:()=>void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="overflow-hidden rounded-[24px] border-border/70 p-0 sm:max-w-[440px]">
    <DialogHeader className="border-b border-border/60 px-6 py-5 text-left"><div className="flex items-start gap-3"><div className="rounded-2xl bg-destructive/10 p-2.5 text-destructive"><AlertTriangle className="h-5 w-5"/></div><div><DialogTitle className="text-lg">{title}</DialogTitle><DialogDescription className="mt-1 leading-6">{description}</DialogDescription></div></div></DialogHeader>
    <div className="flex justify-end gap-3 bg-muted/30 px-6 py-4"><Button variant="outline" className="h-10 rounded-xl" onClick={()=>onOpenChange(false)} disabled={pending}>Cancel</Button><Button className="h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm} disabled={pending}>{pending&&<Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{confirmLabel}</Button></div>
  </DialogContent></Dialog>;
}

export const financeActionButton = "h-10 rounded-[13px] border border-primary/25 bg-card px-4 text-primary shadow-none hover:bg-primary/[0.07] hover:text-primary";
export const financeIconButton = "h-9 w-9 rounded-full border border-primary/20 bg-card p-0 text-primary shadow-none hover:bg-primary/[0.08] hover:text-primary";
export const financeDeleteIconButton = "h-9 w-9 rounded-full border border-destructive/25 bg-card p-0 text-destructive shadow-none hover:bg-destructive/[0.08] hover:text-destructive";
