// features/finance/components/cashier/CashierSection.tsx

import { useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { PaymentsTable } from "./PaymentsTable";
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";
import { PaymentReceiptDialog } from "./PaymentReceiptDialog";
import { DeletePaymentDialog } from "./DeletePaymentDialog";
import { usePayments } from "../../hooks/usePayments";

import type { PaymentReceipt } from "../../types/finance.types";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";

type CashierSectionProps = {
  studentId?: string | number;
  studentName?: string;
  accountId?: string | number;
  title?: string;
  description?: string;
};

export function CashierSection({
  studentId,

  accountId,
  title = "Payment History",
  description = "Review and manage recorded payments.",
}: CashierSectionProps = {}) {
  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    isError,
    isFetching,
    refetch,
    updatePayment,
    deletePayment,
  } = usePayments();

  const visiblePayments = useMemo(
    () =>
      studentId === undefined
        ? payments
        : payments.filter(
            (payment) =>
              String(payment.studentId) === String(studentId) ||
              (accountId !== undefined &&
                String(payment.accountId) === String(accountId)),
          ),
    [accountId, payments, studentId],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentReceipt | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPaymentIdToDelete, setSelectedPaymentIdToDelete] = useState<string | number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPaymentIdToView, setSelectedPaymentIdToView] = useState<string | number | null>(null);

  if (isLoadingPayments) {
    return (
      <FinanceSectionShell
        title={title}
        description={description}
        icon={ReceiptText}
      >
        <FinanceTableSkeleton />
      </FinanceSectionShell>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.045] py-12 text-center">
        <p className="text-sm text-muted-foreground">Failed to load payment history.</p>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="mt-4"
        >
          {isFetching ? "Retrying..." : "Retry"}
        </Button>
      </div>
    );
  }

  function handleDelete(id: string | number) {
    setSelectedPaymentIdToDelete(id);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (selectedPaymentIdToDelete == null) return;
    deletePayment.mutate(
      { id: selectedPaymentIdToDelete, studentId },
      {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedPaymentIdToDelete(null);
        },
      }
    );
  }

  return (
    <FinanceSectionShell
      title={title}
      description={description}
      icon={ReceiptText}
    >
      <PaymentsTable
        payments={visiblePayments}
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

      <UpdatePaymentDialog
        open={editOpen}
        onOpenChange={(open: boolean) => {
          setEditOpen(open);
          if (!open) setSelectedPayment(null);
        }}
        payment={selectedPayment}
        isLoading={updatePayment.isPending}
        onSubmit={(id, payload) =>
          updatePayment.mutate(
            { id, studentId: selectedPayment?.studentId ?? studentId, payload },
            {
              onSuccess: () => {
                setEditOpen(false);
                setSelectedPayment(null);
              },
            }
          )
        }
      />

      <DeletePaymentDialog
        open={deleteOpen}
        onOpenChange={(open: boolean) => {
          setDeleteOpen(open);
          if (!open) setSelectedPaymentIdToDelete(null);
        }}
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