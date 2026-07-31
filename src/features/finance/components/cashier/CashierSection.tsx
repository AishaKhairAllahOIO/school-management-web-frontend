import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { financeOperationsService } from "../../services/finance-operations.service";
import { PaymentsTable } from "./PaymentsTable";
import { ProcessPaymentDialog } from "./ProcessPaymentDialog";
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";
import { PaymentReceiptDialog } from "./PaymentReceiptDialog";
import { usePayments } from "../../hooks/usePayments";
import type { PaymentReceipt } from "../../types/finance.types";
import type { PaymentFormValues } from "../../schemas/payment.schema";
import { FinanceConfirmDialog, FinancePageSkeleton, FinanceSectionHeader, financeActionButton } from "../shared/FinancePrimitives";

export function CashierSection() {
  const { data: payments = [], isLoading: paymentsLoading, isError, isFetching, refetch, processPayment, deletePayment } = usePayments();
  const queryClient=useQueryClient();
  const [createOpen,setCreateOpen]=useState(false); const [editOpen,setEditOpen]=useState(false); const [selectedPayment,setSelectedPayment]=useState<PaymentReceipt|null>(null);
  const [viewOpen,setViewOpen]=useState(false); const [viewId,setViewId]=useState<string|number|null>(null);
  const [deleteOpen,setDeleteOpen]=useState(false); const [deleteId,setDeleteId]=useState<string|number|null>(null);
  const {data:students=[],isLoading:studentsLoading}=useQuery({queryKey:["students-list"],queryFn:async()=>{const response=await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER,{params:{status:"enrolled",per_page:100}});const raw=response.data?.data?.data??response.data?.data??response.data?.items??[];return raw.map((student:any)=>({id:student.studentId||student.id,name:student.fullName||student.name||`Student #${student.studentId||student.id}`}));}});
  const updatePayment=useMutation({mutationFn:({id,payload}:{id:string;payload:any})=>financeOperationsService.updatePayment(id,payload),onSuccess:async()=>{await queryClient.invalidateQueries({queryKey:["payments-ledger"]});setEditOpen(false);setSelectedPayment(null);}});
  if(paymentsLoading||studentsLoading)return <FinancePageSkeleton columns={6}/>;
  if(isError)return <div className="rounded-[22px] border border-destructive/20 bg-destructive/[0.055] p-10 text-center"><h2 className="font-semibold text-destructive">Student payments could not be loaded</h2><Button className={`mt-4 ${financeActionButton}`} onClick={()=>refetch()} disabled={isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${isFetching?"animate-spin":""}`}/>Try again</Button></div>;
  const process=(values:PaymentFormValues)=>processPayment.mutate({...values,paperReceiptNo:values.paperReceiptNo||null,digitalReference:values.digitalReference||null},{onSuccess:()=>setCreateOpen(false)});
  return <div className="space-y-6"><FinanceSectionHeader title="Student Payments" description="Record student payments, maintain transaction references, and issue professional receipts." action={<Button className={financeActionButton} onClick={()=>setCreateOpen(true)}><Plus className="mr-2 h-4 w-4"/>Process Payment</Button>}/><PaymentsTable payments={payments} onView={(id)=>{setViewId(id);setViewOpen(true)}} onEdit={(payment)=>{setSelectedPayment(payment);setEditOpen(true)}} onDelete={(id)=>{setDeleteId(id);setDeleteOpen(true)}}/><ProcessPaymentDialog open={createOpen} onOpenChange={setCreateOpen} students={students} isLoading={processPayment.isPending} onSubmit={process}/><UpdatePaymentDialog open={editOpen} onOpenChange={(v)=>{setEditOpen(v);if(!v)setSelectedPayment(null)}} payment={selectedPayment} isLoading={updatePayment.isPending} onSubmit={(id,payload)=>updatePayment.mutate({id,payload})}/><PaymentReceiptDialog open={viewOpen} onOpenChange={(v)=>{setViewOpen(v);if(!v)setViewId(null)}} paymentId={viewId}/><FinanceConfirmDialog open={deleteOpen} onOpenChange={(v)=>{setDeleteOpen(v);if(!v)setDeleteId(null)}} title="Delete student payment?" description="This permanently deletes the selected receipt and may reverse the amount in the student account. This action cannot be undone." confirmLabel="Delete Payment" pending={deletePayment.isPending} onConfirm={()=>{if(deleteId==null)return;deletePayment.mutate(deleteId,{onSuccess:()=>{setDeleteOpen(false);setDeleteId(null)}})}}/></div>;
}
