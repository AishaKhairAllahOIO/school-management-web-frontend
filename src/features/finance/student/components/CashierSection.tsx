import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Edit2,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import {
  useFinancePayment,
  useFinancePayments,
} from "../hooks/usePayments";
import type { PaymentReceipt } from "../types/finance.types";
import type { UpdatePaymentPayload } from "../types/finance.payloads";
import {
  paymentSchema,
  type PaymentFormValues,
} from "../schemas/payment.schema";
import { FinanceSectionShell } from "./FinanceSectionShell";
import { FinanceTableSkeleton } from "./FinanceTableSkeleton";

type PaymentFormOption = { id: number | string; name: string };
type PaymentFormProps = {
  students: PaymentFormOption[];
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

type ProcessPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: PaymentFormOption[];
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

type PaymentsTableProps = {
  payments: PaymentReceipt[];
  headerAction?: React.ReactNode;
  onEdit?: (payment: PaymentReceipt) => void;
  onDelete?: (paymentId: string | number) => void;
};

const methodLabel = (method: string) =>
  ({
    cash: "Cash",
    bank_transfer: "Bank transfer",
    cheque: "Cheque",
    electronic_wallet: "E-wallet",
  })[method] ?? method;

const statusLabel = (status?: string) =>
  !status ? "Completed" : status.charAt(0).toUpperCase() + status.slice(1);

const statusColor = (status?: string) => {
  switch (status) {
    case "completed":
      return "bg-success/[0.08] text-success";
    case "pending":
      return "bg-warning/[0.08] text-warning";
    case "failed":
      return "bg-destructive/[0.08] text-destructive";
    default:
      return "bg-muted/35 text-muted-foreground";
  }
};

const FINANCE_DIALOG_CONTENT =
  "max-h-[90vh] w-[calc(100%-1rem)] overflow-y-auto rounded-[24px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.14)] backdrop-blur-xl sm:w-full";

const FINANCE_DIALOG_HEADER =
  "space-y-1.5 border-b border-border/40 px-4 py-4 text-start sm:px-6 sm:py-5";

const FINANCE_DIALOG_BODY = "px-4 py-4 sm:px-6 sm:py-5";

type UpdatePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentReceipt | null;
  isLoading?: boolean;
  onSubmit: (id: string, values: UpdatePaymentPayload) => void;
};

const updatePaymentSchema = z.object({
  paymentMethod: z
    .string()
    .min(1, "Please select a payment method") as z.ZodType<
    "cash" | "bank_transfer" | "cheque" | "electronic_wallet"
  >,
  paperReceiptNo: z.string().optional(),
  digitalReference: z.string().optional(),
});

type DeletePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onConfirm: () => void;
};

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
  } = useFinancePayments();

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
  const [selectedPayment, setSelectedPayment] = useState<PaymentReceipt | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPaymentIdToDelete, setSelectedPaymentIdToDelete] = useState<
    string | number | null
  >(null);

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
        <p className="text-sm text-muted-foreground">
          Failed to load payment history.
        </p>
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
      },
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
            },
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
    </FinanceSectionShell>
  );
}

export function PaymentForm({
  students,
  initialStudentId,
  onSubmit,
  isLoading = false,
}: PaymentFormProps) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      studentId: initialStudentId ? Number(initialStudentId) : 0,
      paidAmount: 0,
      paymentMethod: "cash",
      paperReceiptNo: "",
      digitalReference: "",
    },
  });

  const selectedMethod = watch("paymentMethod");

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as PaymentFormValues))}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Student Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Student Account
          </label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground shadow-lg">
                  {students.map((student) => (
                    <SelectItem
                      key={student.id}
                      value={String(student.id)}
                      className="rounded-lg cursor-pointer"
                    >
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.studentId && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.studentId.message)}
            </p>
          )}
        </div>

        {/* Paid Amount */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Amount to Pay ($)
          </label>
          <Input
            type="number"
            className="h-11 rounded-xl border-border bg-card text-lg font-bold text-primary focus-visible:ring-ring"
            {...register("paidAmount")}
          />
          {errors.paidAmount && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.paidAmount.message)}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Method
          </label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground shadow-lg">
                  <SelectItem
                    value="cash"
                    className="rounded-lg cursor-pointer"
                  >
                    Cash
                  </SelectItem>
                  <SelectItem
                    value="bank_transfer"
                    className="rounded-lg cursor-pointer"
                  >
                    Bank Transfer
                  </SelectItem>
                  <SelectItem
                    value="cheque"
                    className="rounded-lg cursor-pointer"
                  >
                    Cheque
                  </SelectItem>
                  <SelectItem
                    value="electronic_wallet"
                    className="rounded-lg cursor-pointer"
                  >
                    E-Wallet
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.paymentMethod.message)}
            </p>
          )}
        </div>

        {/* Paper Receipt */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Paper Receipt No. (Optional)
          </label>
          <Input
            type="text"
            className="h-11 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring"
            placeholder="e.g. REC-12345"
            {...register("paperReceiptNo")}
          />
        </div>

        {/* Digital Reference */}
        {selectedMethod !== "cash" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Digital Reference (Optional)
            </label>
            <Input
              type="text"
              className="h-11 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring"
              placeholder="e.g. TXN-987654321"
              {...register("digitalReference")}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="primary-gradient h-12 w-full rounded-xl text-base font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
        disabled={isLoading}
      >
        {isLoading ? "Processing Transaction..." : "Process Payment"}
      </Button>
    </form>
  );
}

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  students,
  initialStudentId,
  isLoading,
  onSubmit,
}: ProcessPaymentDialogProps) {
  function handleSubmit(values: PaymentFormValues) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${FINANCE_DIALOG_CONTENT} sm:max-w-xl`}>
        <DialogHeader className={FINANCE_DIALOG_HEADER}>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Process New Payment
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record a new payment receipt for a student and update their
            remaining balance automatically.
          </DialogDescription>
        </DialogHeader>

        <div className={FINANCE_DIALOG_BODY}>
          <PaymentForm
            students={students}
            initialStudentId={initialStudentId}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentsTable({
  payments,
  headerAction,
  onEdit,
  onDelete,
}: PaymentsTableProps) {
  if (!payments.length) {
    return (
      <div className="relative rounded-[20px] border border-dashed border-border/55 bg-card px-6 py-14 text-center shadow-[0_10px_30px_rgba(31,22,73,0.035)]">
        {headerAction ? (
          <div className="absolute end-3 top-3">{headerAction}</div>
        ) : null}
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-success/[0.08] text-success">
          <ReceiptText className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No payments recorded
        </h3>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground/78">
          No payment records found for this account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-border/40 bg-muted/22 hover:bg-muted/22">
              {[
                "Payment",
                "Amount",
                "Method",
                "Reference",
                "Date",
                "Status",
                "Cashier",
              ].map((label) => (
                <TableHead
                  key={label}
                  className="h-12 px-5 text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75"
                >
                  {label}
                </TableHead>
              ))}
              <TableHead className="h-12 w-28 px-4 text-right text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">
                <div className="flex items-center justify-end gap-2.5">
                  <span>Actions</span>
                  {headerAction}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="border-border/30 transition-colors hover:bg-success/[0.018]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary/[0.065] text-primary">
                      <ReceiptText className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground/86">
                        {"Student payment"}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground/65">
                        #{payment.id} • {"Payment"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-2 text-success">
                    <Banknote className="h-4 w-4" strokeWidth={1.8} />
                    <span className="text-[13.5px] font-semibold">
                      {payment.paidAmount?.toLocaleString()} $
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <span className="rounded-full border border-border/45 bg-muted/35 px-2.5 py-1 text-[11px] font-medium text-foreground/72">
                    {methodLabel(payment.paymentMethod)}
                  </span>
                </TableCell>

                <TableCell className="max-w-[150px] px-5 py-4 text-[12.5px] text-muted-foreground">
                  <span className="block truncate">
                    {payment.paperReceiptNo || payment.digitalReference || "—"}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4 text-[12.5px] text-foreground/74">
                  {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>

                <TableCell className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                      statusColor("completed"),
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {statusLabel("completed")}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4 text-[12.5px] text-muted-foreground">
                  {"—"}
                </TableCell>

                <TableCell className="px-5 py-4 text-right">
                  <div className="inline-flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit?.(payment)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.045] hover:text-primary"
                      aria-label="Edit payment"
                    >
                      <Edit2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(payment.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-destructive/15 bg-destructive/[0.045] text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/[0.09]"
                      aria-label="Delete payment"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function UpdatePaymentDialog({
  open,
  onOpenChange,
  payment,
  isLoading,
  onSubmit,
}: UpdatePaymentDialogProps) {
  const paymentDetailQuery = useFinancePayment(
    payment?.id,
    open,
  );
  const paymentForForm = paymentDetailQuery.data ?? payment;

  const { control, handleSubmit, register, reset, watch } =
    useForm<UpdatePaymentPayload>({
      resolver: zodResolver(updatePaymentSchema) as any,
      defaultValues: {
        paymentMethod: "cash",
        paperReceiptNo: "",
        digitalReference: "",
      },
    });

  useEffect(() => {
    if (paymentForForm && open) {
      reset({
        paymentMethod: paymentForForm.paymentMethod,
        paperReceiptNo: paymentForForm.paperReceiptNo || "",
        digitalReference: paymentForForm.digitalReference || "",
      });
    }
  }, [paymentForForm, open, reset]);

  const selectedMethod = watch("paymentMethod");

  function handleFormSubmit(values: UpdatePaymentPayload) {
    if (!paymentForForm) return;

    const payload = {
      ...values,
      paperReceiptNo: values.paperReceiptNo || null,
      digitalReference: values.digitalReference || null,
    };

    onSubmit(paymentForForm.id, payload);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${FINANCE_DIALOG_CONTENT} sm:max-w-md`}>
        <DialogHeader className={FINANCE_DIALOG_HEADER}>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Update Payment Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify the payment method or reference numbers. The paid amount
            cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5"
        >
          {/* Read-Only Receipt Amount Reminder */}
          <div className="soft-purple-gradient flex items-center justify-between rounded-2xl border border-primary/20 p-4 text-sm">
            <span className="font-medium text-muted-foreground">
              Receipt Amount:
            </span>
            <span className="text-lg font-bold text-primary">
              {paymentForForm?.paidAmount?.toLocaleString()} $
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground focus:ring-2 focus:ring-ring">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground shadow-lg">
                    <SelectItem
                      value="cash"
                      className="rounded-lg cursor-pointer"
                    >
                      Cash
                    </SelectItem>
                    <SelectItem
                      value="bank_transfer"
                      className="rounded-lg cursor-pointer"
                    >
                      Bank Transfer
                    </SelectItem>
                    <SelectItem
                      value="cheque"
                      className="rounded-lg cursor-pointer"
                    >
                      Cheque
                    </SelectItem>
                    <SelectItem
                      value="electronic_wallet"
                      className="rounded-lg cursor-pointer"
                    >
                      E-Wallet
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Paper Receipt No.
            </label>
            <Input
              className="h-11 rounded-xl border-border bg-card text-foreground focus-visible:ring-ring"
              {...register("paperReceiptNo")}
            />
          </div>

          {selectedMethod !== "cash" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Digital Reference
              </label>
              <Input
                className="h-11 rounded-xl border-border bg-card text-foreground focus-visible:ring-ring"
                {...register("digitalReference")}
              />
            </div>
          )}

          <Button
            type="submit"
            className="primary-gradient h-11 w-full rounded-xl font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeletePaymentDialog({
  open,
  onOpenChange,
  isLoading,
  onConfirm,
}: DeletePaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[430px]`}>
        <div className="px-6 pt-6">
          <DialogHeader className="text-start">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] border border-destructive/18 bg-destructive/[0.07] text-destructive">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <DialogTitle className="text-[17px] font-medium tracking-[-0.015em] text-foreground/90">
              Delete payment?
            </DialogTitle>
            <DialogDescription className="pt-1 text-[13px] font-normal leading-5 text-muted-foreground">
              This reverses the payment amount in the student balance. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-5 flex-col-reverse gap-2 border-t border-border/45 bg-muted/20 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl px-4 text-[12.5px] font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 rounded-xl bg-destructive px-4 text-[12.5px] font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.8} />
            {isLoading ? "Deleting..." : "Delete payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const statementMethodLabels: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  electronic_wallet: "Electronic wallet",
};

function statementMoney(value: number) {
  return `${new Intl.NumberFormat().format(Number(value || 0))} $`;
}

function statementDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(date);
}

export function FullFinancialStatementDialog({
  open,
  onOpenChange,
  studentName,
  academicYearName,
  account,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  academicYearName?: string | null;
  account: import("../types/finance.types").FinancialAccount;
}) {
  const { data: payments = [], isLoading } = useFinancePayments();
  const visiblePayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          String(payment.studentId) === String(account.studentId) ||
          String(payment.accountId) === String(account.id),
      ),
    [account.id, account.studentId, payments],
  );
  const totalPaid = Math.max(
    0,
    Number(account.totalRequiredAmount) - Number(account.remainingBalance),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[900px]`}>
        <DialogHeader className={FINANCE_DIALOG_HEADER}>
          <DialogTitle>Complete financial statement</DialogTitle>
          <DialogDescription>
            Contract, installments, and all recorded payments in one financial
            statement.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 p-4 sm:p-6">
          <div className="rounded-[20px] border border-primary/14 bg-primary/[0.035] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary/75">
              Student financial statement
            </p>
            <h2 className="mt-1 text-[21px] font-semibold">{studentName}</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {academicYearName || "Academic year"} ·{" "}
              {account.feePlan?.name || "Fee plan"}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[16px] border border-border/45 p-4">
              <p className="text-[11px] text-muted-foreground">
                Contract total
              </p>
              <p className="mt-1 text-[19px] font-semibold">
                {statementMoney(account.totalRequiredAmount)}
              </p>
            </div>
            <div className="rounded-[16px] border border-success/18 bg-success/[0.035] p-4">
              <p className="text-[11px] text-muted-foreground">Total paid</p>
              <p className="mt-1 text-[19px] font-semibold text-success">
                {statementMoney(totalPaid)}
              </p>
            </div>
            <div className="rounded-[16px] border border-border/45 p-4">
              <p className="text-[11px] text-muted-foreground">
                Remaining balance
              </p>
              <p className="mt-1 text-[19px] font-semibold">
                {statementMoney(account.remainingBalance)}
              </p>
            </div>
          </div>
          <section>
            <h3 className="text-[14px] font-semibold">Installment schedule</h3>
            <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/45">
              <table className="w-full min-w-[620px] text-left text-[12px]">
                <thead className="bg-muted/25">
                  <tr>
                    {[
                      "#",
                      "Installment",
                      "Due date",
                      "Due",
                      "Paid",
                      "Status",
                    ].map((h) => (
                      <th key={h} className="p-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {account.installments.map((item) => (
                    <tr key={item.id} className="border-t border-border/35">
                      <td className="p-3">{item.installmentNumber}</td>
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">{statementDate(item.dueDate)}</td>
                      <td className="p-3">{statementMoney(item.amountDue)}</td>
                      <td className="p-3">{statementMoney(item.amountPaid)}</td>
                      <td className="p-3 capitalize">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h3 className="text-[14px] font-semibold">Payment history</h3>
            {isLoading ? (
              <p className="mt-3 text-[12px] text-muted-foreground">
                Loading payments...
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/45">
                <table className="w-full min-w-[620px] text-left text-[12px]">
                  <thead className="bg-muted/25">
                    <tr>
                      {["Receipt", "Date", "Method", "Amount", "Reference"].map(
                        (h) => (
                          <th key={h} className="p-3">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-border/35"
                      >
                        <td className="p-3">#{payment.id}</td>
                        <td className="p-3">
                          {statementDate(payment.createdAt)}
                        </td>
                        <td className="p-3">
                          {statementMethodLabels[payment.paymentMethod] ??
                            payment.paymentMethod}
                        </td>
                        <td className="p-3 font-semibold text-success">
                          {statementMoney(payment.paidAmount)}
                        </td>
                        <td className="p-3">
                          {payment.paperReceiptNo ||
                            payment.digitalReference ||
                            "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
