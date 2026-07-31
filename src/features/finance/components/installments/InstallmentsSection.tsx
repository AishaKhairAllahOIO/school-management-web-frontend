import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { InstallmentsTable } from "./InstallmentsTable";
import { InstallmentDetailsDialog } from "./InstallmentDetailsDialog";
import { useInstallments } from "../../hooks/useInstallments";
import { FinancePageSkeleton, FinanceSectionHeader, financeActionButton } from "../shared/FinancePrimitives";

export function InstallmentsSection() {
  const { data: installments = [], isLoading, isError, isFetching, refetch } = useInstallments();
  const [open,setOpen]=useState(false); const [id,setId]=useState<string|number|null>(null);
  if(isLoading) return <FinancePageSkeleton columns={6}/>;
  if(isError) return <div className="rounded-[22px] border border-destructive/20 bg-destructive/[0.055] p-10 text-center"><h2 className="font-semibold text-destructive">Student installments could not be loaded</h2><Button className={`mt-4 ${financeActionButton}`} onClick={()=>refetch()} disabled={isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${isFetching?"animate-spin":""}`}/>Try again</Button></div>;
  return <div className="space-y-6"><FinanceSectionHeader title="Student Installments" description="Track scheduled, paid, pending, and overdue installments for student financial accounts."/><InstallmentsTable installments={installments} onView={(value)=>{setId(value);setOpen(true)}}/><InstallmentDetailsDialog open={open} onOpenChange={(value)=>{setOpen(value);if(!value)setId(null)}} installmentId={id}/></div>;
}
