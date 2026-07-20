import { useState } from "react";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 

import { Button } from "@/shared/ui/button";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; // 👈 استيراد المسارات الصحيحة
import { financeOperationsService } from "../../services/finance-operations.service"; 

import { PaymentsTable } from "./PaymentsTable";
import { ProcessPaymentDialog } from "./ProcessPaymentDialog";
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";
import { PaymentReceiptDialog } from "./PaymentReceiptDialog"; // 👈 استيراد نافذة الإيصال
import { usePayments } from "../../hooks/usePayments";

import type { PaymentReceipt } from "../../types/finance.types";
import type { PaymentFormValues } from "../../schemas/payment.schema";

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
    if (confirm("Are you sure you want to delete this payment? This will reverse the amount in the student's balance.")) {
      deletePayment.mutate(id);  
    }
  }

  if (isLoadingPayments || isLoadingStudents) {
    return <div className="py-10 text-center text-muted-foreground">Loading cashier data...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Retrying..." : "Retry Loading Cashier"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cashier & Ledger</h2>
          <p className="text-muted-foreground">
            Process incoming payments and manage transaction receipts.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Process Payment
        </Button>
      </div>

      <PaymentsTable 
        payments={payments} 
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
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedPayment(null);
        }}
        payment={selectedPayment}
        isLoading={updatePayment.isPending}
        onSubmit={(id, payload) => updatePayment.mutate({ id, payload })}
      />


      <PaymentReceiptDialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) setSelectedPaymentIdToView(null);
        }}
        paymentId={selectedPaymentIdToView}
      />
    </div>
  );
}