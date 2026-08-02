import { useState } from "react";
import { Banknote, CircleDollarSign, CreditCard, Plus, ReceiptText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 

import { Button } from "@/shared/ui/button";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { financeOperationsService } from "../../services/finance-operations.service"; 

import { PaymentsTable } from "./PaymentsTable";
import { ProcessPaymentDialog } from "./ProcessPaymentDialog";
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";
import { PaymentReceiptDialog } from "./PaymentReceiptDialog";
import { DeletePaymentDialog } from "./DeletePaymentDialog";
import { usePayments } from "../../hooks/usePayments";

import type { PaymentReceipt } from "../../types/finance.types";
import type { PaymentFormValues } from "../../schemas/payment.schema";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceSummarySkeleton, FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";
import { FinanceSummaryGrid } from "../shared/FinanceSummaryGrid";

export function CashierSection() {
  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    isError,
    isFetching,
    refetch,
    processPayment,
    deletePayment,
  } = usePayments();

  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentReceipt | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPaymentIdToDelete, setSelectedPaymentIdToDelete] = useState<string | number | null>(null);


  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPaymentIdToView, setSelectedPaymentIdToView] = useState<string | number | null>(null);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER, {
          params: { status: 'enrolled', per_page: 100 }
        }); 
        const rawData = response.data?.data?.data ?? response.data?.data ?? response.data?.items ?? [];
        return rawData.map((student: any) => ({
          id: student.studentId || student.id,
          name: student.fullName, 
        }));
      } catch (error) {
        return [];
      }
    },
  });

  function handleProcessPayment(values: PaymentFormValues) {
    const payload = {
      ...values,
      paperReceiptNo: values.paperReceiptNo || null,
      digitalReference: values.digitalReference || null,
    };

    processPayment.mutate(payload, {
      onSuccess: () => {
        setCreateOpen(false);
      },
    });
  }

  const updatePayment = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      financeOperationsService.updatePayment(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payments-ledger"] });
      setEditOpen(false);
      setSelectedPayment(null);
    },
    onError: (error: any) => {
      alert("Update failed: " + (error.response?.data?.message || "Unknown error"));
    }
  });

  function handleDelete(id: string | number) {
    setSelectedPaymentIdToDelete(id);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (selectedPaymentIdToDelete == null) return;
    deletePayment.mutate(selectedPaymentIdToDelete, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedPaymentIdToDelete(null);
      },
    });
  }


  if (isLoadingPayments || isLoadingStudents) {
    return (
      <FinanceSectionShell
        title="Student Payments"
        description="Record collections and manage student receipts."
        icon={ReceiptText}
      >
        <FinanceSummarySkeleton />
        <FinanceTableSkeleton />
      </FinanceSectionShell>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.045] py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Retrying..." : "Retry Loading Cashier"}
        </Button>
      </div>
    );
  }

  return (
    <FinanceSectionShell
      title="Student Payments"
      description="Record collections and manage student receipts."
      icon={ReceiptText}
    >
      <FinanceSummaryGrid
        items={[
          {
            label: "Recorded payments",
            value: new Intl.NumberFormat().format(payments.length),
            hint: "Official receipts",
            icon: ReceiptText,
            tone: "primary",
          },
          {
            label: "Total collected",
            value: `${payments.reduce((sum, item) => sum + Number(item.paidAmount ?? 0), 0).toLocaleString()} $`,
            hint: "Across all methods",
            icon: CircleDollarSign,
            tone: "success",
          },
          {
            label: "Cash receipts",
            value: new Intl.NumberFormat().format(payments.filter((item) => item.paymentMethod === "cash").length),
            hint: "Processed in cash",
            icon: Banknote,
            tone: "warning",
          },
          {
            label: "Digital payments",
            value: new Intl.NumberFormat().format(payments.filter((item) => item.paymentMethod !== "cash").length),
            hint: "Transfer, cheque or wallet",
            icon: CreditCard,
            tone: "info",
          },
        ]}
      />

      <PaymentsTable
        payments={payments}
        headerAction={
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setCreateOpen(true)}
            aria-label="Process payment"
            title="Process payment"
            className="h-8 w-8 rounded-[11px] border-primary/25 bg-transparent text-primary shadow-none hover:border-primary/45 hover:bg-primary/[0.045] hover:text-primary"
          >
            <Plus className="h-4 w-4" strokeWidth={1.9} />
          </Button>
        } 
        onView={(id) => {
          setSelectedPaymentIdToView(id);
          setViewOpen(true);
        }}
        onDelete={handleDelete} 
        onEdit={(payment) => {
          setSelectedPayment(payment);
          setEditOpen(true);
        }}
      />
    
      <ProcessPaymentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        students={students}
        isLoading={processPayment.isPending}
        onSubmit={handleProcessPayment}
      />

      <UpdatePaymentDialog
        open={editOpen}
        onOpenChange={(open: boolean) => {
          setEditOpen(open);
          if (!open) setSelectedPayment(null);
        }}
        payment={selectedPayment}
        isLoading={updatePayment.isPending}
        onSubmit={(id, payload) => updatePayment.mutate({ id, payload })}
      />


      <DeletePaymentDialog
        open={deleteOpen}
        onOpenChange={(open: boolean) => { setDeleteOpen(open); if (!open) setSelectedPaymentIdToDelete(null); }}
        isLoading={deletePayment.isPending}
        onConfirm={confirmDelete}
      />

      <PaymentReceiptDialog
        open={viewOpen}
        onOpenChange={(open: boolean) => {
          setViewOpen(open);
          if (!open) setSelectedPaymentIdToView(null);
        }}
        paymentId={selectedPaymentIdToView}
      />
    </FinanceSectionShell>
  );
}