// features/finance/components/PaymentProcess.tsx

import * as React from "react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Banknote,
  CreditCard,
  Edit2,
  ReceiptText,
  Trash2,
} from "lucide-react";

import {
  Controller,
  useForm,
} from "react-hook-form";

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
  useStudentPayments,
} from "../hooks/useStudentPayments";

import type {
  PaymentReceipt,
} from "../types/studentFinance.types";

import type {
  UpdatePaymentPayload,
} from "../types/studentFinance.payloads";

import {
  paymentSchema,
  type PaymentFormValues,
} from "../schemas/studentPayment.schema";

import { StudentFinanceSectionShell } from "./StudentFinanceSectionShell";
import { StudentFinanceTableSkeleton } from "./StudentFinanceTableSkeleton";

type PaymentFormOption = {
  id: number | string;
  name: string;
};

type PaymentFormProps = {
  students: PaymentFormOption[];
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (
    values: PaymentFormValues,
  ) => void;
};

type StudentPaymentDialogProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  students: PaymentFormOption[];
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (
    values: PaymentFormValues,
  ) => void;
};

type PaymentsTableProps = {
  payments: PaymentReceipt[];
  headerAction?: React.ReactNode;
  onEdit?: (
    payment: PaymentReceipt,
  ) => void;
  onDelete?: (
    paymentId: string | number,
  ) => void;
};

const methodLabel = (
  method: string,
) =>
  ({
    cash: "Cash",
    bank_transfer: "Bank transfer",
    cheque: "Cheque",
    electronic_wallet: "E-wallet",
  })[method] ?? method;

const statusLabel = (
  status?: string,
) =>
  !status
    ? "Completed"
    : status.charAt(0).toUpperCase() +
      status.slice(1);

const statusColor = (
  status?: string,
) => {
  switch (status) {
    case "completed":
      return "bg-success/[0.06] text-success";

    case "pending":
      return "bg-warning/[0.06] text-warning";

    case "failed":
      return "bg-destructive/[0.06] text-destructive";

    default:
      return "bg-muted/35 text-muted-foreground";
  }
};

const FINANCE_DIALOG_CONTENT =
  "w-[calc(100%-1rem)] overflow-hidden rounded-[24px] border-border/35 bg-background/98 p-0 shadow-[0_20px_60px_rgba(31,22,73,0.10)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.34)] sm:w-full";

const FINANCE_DIALOG_HEADER =
  "border-b border-border/25 px-5 pb-4 pt-5 text-start sm:px-6 sm:pt-5";

const FINANCE_DIALOG_BODY =
  "px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-4";

const FINANCE_INPUT_CLASS =
  "h-11 rounded-[13px] border-border/50 bg-background shadow-none outline-none transition-[border-color,box-shadow] focus-visible:border-primary/15 focus-visible:ring-1 focus-visible:ring-primary/[0.035] focus-visible:ring-offset-0";

const FINANCE_SELECT_TRIGGER_CLASS =
  "h-11 rounded-[13px] border-border/50 bg-background text-[12px] text-foreground shadow-none outline-none transition-[border-color,box-shadow] focus:ring-1 focus:ring-primary/[0.035] focus:ring-offset-0";

type UpdatePaymentDialogProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  payment: PaymentReceipt | null;
  isLoading?: boolean;
  onSubmit: (
    id: string,
    values: UpdatePaymentPayload,
  ) => void;
};

const updatePaymentSchema =
  z.object({
    paymentMethod:
      z.string().min(
        1,
        "Please select a payment method",
      ) as z.ZodType<
        | "cash"
        | "bank_transfer"
        | "cheque"
        | "electronic_wallet"
      >,

    paperReceiptNo:
      z.string().optional(),

    digitalReference:
      z.string().optional(),
  });

type DeletePaymentDialogProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  isLoading?: boolean;
  onConfirm: () => void;
};

type StudentPaymentHistoryProps = {
  studentId?: string | number;
  studentName?: string;
  accountId?: string | number;
  title?: string;
  description?: string;
};

export function StudentPaymentHistory({
  studentId,
  accountId,
  title = "Payment History",
  description = "Review and manage recorded payments.",
}: StudentPaymentHistoryProps = {}) {
  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    isError,
    isFetching,
    refetch,
    updatePayment,
    deletePayment,
  } = useStudentPayments(studentId, accountId, studentId !== undefined);

  const visiblePayments =
    useMemo(
      () =>
        payments.filter(
          (payment) =>
            String(payment.studentId) === String(studentId) &&
            (accountId === undefined ||
              String(payment.accountId) === String(accountId)),
        ),
      [
        accountId,
        payments,
        studentId,
      ],
    );

  const [editOpen, setEditOpen] =
    useState(false);

  const [
    selectedPayment,
    setSelectedPayment,
  ] =
    useState<PaymentReceipt | null>(
      null,
    );

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [
    selectedPaymentIdToDelete,
    setSelectedPaymentIdToDelete,
  ] =
    useState<
      string | number | null
    >(null);

  if (isLoadingPayments) {
    return (
      <StudentFinanceSectionShell
        title={title}
        description={description}
        icon={ReceiptText}
      >
        <StudentFinanceTableSkeleton />
      </StudentFinanceSectionShell>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/15 bg-destructive/[0.035] py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Failed to load payment history.
        </p>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-4 h-9 rounded-[12px] text-xs"
        >
          {isFetching
            ? "Retrying..."
            : "Retry"}
        </Button>
      </div>
    );
  }

  function handleDelete(
    id: string | number,
  ) {
    setSelectedPaymentIdToDelete(id);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (
      selectedPaymentIdToDelete ==
        null ||
      deletePayment.isPending
    ) {
      return;
    }

    try {
      await deletePayment.mutateAsync({
        id: selectedPaymentIdToDelete,
        studentId,
      });

      setDeleteOpen(false);
      setSelectedPaymentIdToDelete(
        null,
      );

      await refetch();
    } catch (error) {
      console.error(
        "Failed to delete payment:",
        error,
      );
    }
  }

  return (
    <StudentFinanceSectionShell
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
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedPayment(null);
          }
        }}
        payment={selectedPayment}
        isLoading={
          updatePayment.isPending
        }
        onSubmit={(
          id,
          payload,
        ) =>
          updatePayment.mutate(
            {
              id,
              studentId:
                selectedPayment?.studentId ??
                studentId,
              payload,
            },
            {
              onSuccess: async () => {
                setEditOpen(false);
                setSelectedPayment(null);

                await refetch();
              },
            },
          )
        }
      />

      <DeletePaymentDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setSelectedPaymentIdToDelete(
              null,
            );
          }
        }}
        isLoading={
          deletePayment.isPending
        }
        onConfirm={confirmDelete}
      />
    </StudentFinanceSectionShell>
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
  } =
    useForm<PaymentFormValues>({
      resolver:
        zodResolver(
          paymentSchema,
        ) as any,

      defaultValues: {
        studentId:
          initialStudentId
            ? Number(
                initialStudentId,
              )
            : 0,

        paidAmount: 0,

        paymentMethod: "cash",

        paperReceiptNo: "",

        digitalReference: "",
      },
    });

  const selectedMethod =
    watch("paymentMethod");

  const fixedStudent =
    useMemo(() => {
      if (
        initialStudentId ===
        undefined
      ) {
        return undefined;
      }

      return students.find(
        (student) =>
          String(student.id) ===
          String(
            initialStudentId,
          ),
      );
    }, [
      initialStudentId,
      students,
    ]);

  const hasFixedStudent =
    initialStudentId !== undefined;

  return (
    <form
      onSubmit={handleSubmit(
        (data) =>
          onSubmit(
            data as PaymentFormValues,
          ),
      )}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
            Student Account
          </label>

          {hasFixedStudent ? (
            <div className="flex h-11 items-center rounded-[13px] border border-border/50 bg-muted/[0.22] px-3.5 text-[12px] text-foreground/85">
              <span className="truncate">
                {fixedStudent?.name ??
                  "Student account"}
              </span>

              <span className="ml-auto shrink-0 rounded-full bg-muted/50 px-2 py-1 text-[9.5px] font-medium text-muted-foreground">
                Fixed
              </span>
            </div>
          ) : (
            <Controller
              control={control}
              name="studentId"
              render={({ field }) => (
                <Select
                  value={
                    field.value
                      ? String(
                          field.value,
                        )
                      : ""
                  }
                  onValueChange={(
                    val,
                  ) =>
                    field.onChange(
                      Number(val),
                    )
                  }
                >
                  <SelectTrigger
                    className={
                      FINANCE_SELECT_TRIGGER_CLASS
                    }
                  >
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>

                  <SelectContent className="rounded-[14px] border-border/50 bg-popover text-popover-foreground shadow-md">
                    {students.map(
                      (student) => (
                        <SelectItem
                          key={
                            student.id
                          }
                          value={String(
                            student.id,
                          )}
                          className="cursor-pointer rounded-[10px]"
                        >
                          {
                            student.name
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          )}

          {errors.studentId &&
            !hasFixedStudent && (
              <p className="text-[10.5px] font-medium text-destructive">
                {String(
                  errors.studentId
                    .message,
                )}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
            Amount to Pay ($)
          </label>

          <Input
            type="number"
            className={cn(
              FINANCE_INPUT_CLASS,
              "text-[14px] font-semibold text-primary",
            )}
            {...register(
              "paidAmount",
            )}
          />

          {errors.paidAmount && (
            <p className="text-[10.5px] font-medium text-destructive">
              {String(
                errors.paidAmount
                  .message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
            Payment Method
          </label>

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
              >
                <SelectTrigger
                  className={
                    FINANCE_SELECT_TRIGGER_CLASS
                  }
                >
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>

                <SelectContent className="rounded-[14px] border-border/50 shadow-md">
                  <SelectItem
                    value="cash"
                    className="rounded-[10px]"
                  >
                    Cash
                  </SelectItem>

                  <SelectItem
                    value="bank_transfer"
                    className="rounded-[10px]"
                  >
                    Bank Transfer
                  </SelectItem>

                  <SelectItem
                    value="cheque"
                    className="rounded-[10px]"
                  >
                    Cheque
                  </SelectItem>

                  <SelectItem
                    value="electronic_wallet"
                    className="rounded-[10px]"
                  >
                    E-Wallet
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.paymentMethod && (
            <p className="text-[10.5px] font-medium text-destructive">
              {String(
                errors.paymentMethod
                  .message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
            Paper Receipt No.
          </label>

          <Input
            type="text"
            className={cn(
              FINANCE_INPUT_CLASS,
              "text-[12px]",
            )}
            placeholder="Optional"
            {...register(
              "paperReceiptNo",
            )}
          />
        </div>

        {selectedMethod !==
          "cash" && (
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
              Digital Reference
            </label>

            <Input
              type="text"
              className={cn(
                FINANCE_INPUT_CLASS,
                "text-[12px]",
              )}
              placeholder="Optional"
              {...register(
                "digitalReference",
              )}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-[13px] bg-primary text-[12px] font-semibold text-primary-foreground shadow-none transition-colors hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading
          ? "Processing Transaction..."
          : "Process Payment"}
      </Button>
    </form>
  );
}

export function StudentPaymentDialog({
  open,
  onOpenChange,
  students,
  initialStudentId,
  isLoading,
  onSubmit,
}: StudentPaymentDialogProps) {
  function handleSubmit(
    values: PaymentFormValues,
  ) {
    onSubmit(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[540px]`}
      >
        <DialogHeader
          className={
            FINANCE_DIALOG_HEADER
          }
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.055] text-primary">
              <ReceiptText
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.025em] text-foreground/92">
                Process New Payment
              </DialogTitle>

              <DialogDescription className="mt-1 text-[12px] leading-5 text-muted-foreground/75">
                Record a new payment
                receipt and update the
                student balance
                automatically.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div
          className={
            FINANCE_DIALOG_BODY
          }
        >
          <PaymentForm
            students={students}
            initialStudentId={
              initialStudentId
            }
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
      <div className="relative rounded-[20px] border border-dashed border-border/50 bg-card px-6 py-14 text-center">
        {headerAction ? (
          <div className="absolute end-3 top-3">
            {headerAction}
          </div>
        ) : null}

        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] border border-success/12 bg-success/[0.045] text-success">
          <ReceiptText
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </span>

        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No payments recorded
        </h3>

        <p className="mt-1.5 text-[12.5px] text-muted-foreground/78">
          No payment records found
          for this account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/30 bg-card/90 shadow-none">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-border/25 bg-muted/[0.08] hover:bg-muted/[0.12]">
              {[
                "Payment",
                "Amount",
                "Method",
                "Reference",
                "Date",
                "Status",
              ].map((label) => (
                <TableHead
                  key={label}
                  className="h-10 px-5 text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground/60"
                >
                  {label}
                </TableHead>
              ))}

              <TableHead className="h-10 w-24 px-4 text-right text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground/60">
                <div className="flex items-center justify-end gap-2.5">
                  <span>
                    Actions
                  </span>

                  {headerAction}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map(
              (payment, index) => (
                <TableRow
                  key={payment.id}
                  className="border-border/20 transition-colors hover:bg-muted/[0.24]"
                >
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-primary/10 bg-primary/[0.055] text-primary">
                        <ReceiptText
                          className="h-4 w-4"
                          strokeWidth={
                            1.8
                          }
                        />
                      </span>

                      <div>
                        <p className="text-[13px] font-semibold text-foreground/86">
                          Payment {index + 1}
                        </p>

                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2 text-success">
                      <Banknote
                        className="h-4 w-4"
                        strokeWidth={
                          1.8
                        }
                      />

                      <span className="text-[13.5px] font-semibold">
                        {payment.paidAmount?.toLocaleString()}{" "}
                        $
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <span className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-foreground/72">
                      {methodLabel(
                        payment.paymentMethod,
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-[150px] px-5 py-4 text-[12.5px] text-muted-foreground">
                    <span className="block truncate">
                      {payment.paperReceiptNo ||
                        payment.digitalReference ||
                        "—"}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-[12.5px] text-foreground/74">
                    {payment.createdAt
                      ? new Date(
                          payment.createdAt,
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                        statusColor(
                          "completed",
                        ),
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />

                      {statusLabel(
                        "completed",
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(
                            payment,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-card text-muted-foreground transition-colors hover:border-primary/15 hover:bg-primary/[0.04] hover:text-primary"
                        aria-label="Edit payment"
                      >
                        <Edit2
                          className="h-4 w-4"
                          strokeWidth={
                            1.8
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete?.(
                            payment.id,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-destructive/12 bg-destructive/[0.035] text-destructive transition-colors hover:bg-destructive/[0.07]"
                        aria-label="Delete payment"
                      >
                        <Trash2
                          className="h-4 w-4"
                          strokeWidth={
                            1.8
                          }
                        />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )}
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
  const paymentDetailQuery =
    useFinancePayment(
      payment?.id,
      open,
    );

  const paymentForForm =
    paymentDetailQuery.data ??
    payment;

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
  } =
    useForm<UpdatePaymentPayload>({
      resolver:
        zodResolver(
          updatePaymentSchema,
        ) as any,

      defaultValues: {
        paymentMethod: "cash",
        paperReceiptNo: "",
        digitalReference: "",
      },
    });

  useEffect(() => {
    if (
      paymentForForm &&
      open
    ) {
      reset({
        paymentMethod:
          paymentForForm.paymentMethod,

        paperReceiptNo:
          paymentForForm.paperReceiptNo ||
          "",

        digitalReference:
          paymentForForm.digitalReference ||
          "",
      });
    }
  }, [
    paymentForForm,
    open,
    reset,
  ]);

  const selectedMethod =
    watch("paymentMethod");

  function handleFormSubmit(
    values: UpdatePaymentPayload,
  ) {
    if (!paymentForForm) {
      return;
    }

    const payload = {
      ...values,

      paperReceiptNo:
        values.paperReceiptNo ||
        null,

      digitalReference:
        values.digitalReference ||
        null,
    };

    onSubmit(
      String(paymentForForm.id),
      payload,
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[540px]`}
      >
        <DialogHeader
          className={
            FINANCE_DIALOG_HEADER
          }
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.055] text-primary">
              <CreditCard
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.025em] text-foreground/92">
                Update Payment
                Details
              </DialogTitle>

              <DialogDescription className="mt-1 text-[12px] leading-5 text-muted-foreground/75">
                Modify the payment
                method or reference
                numbers. The paid
                amount cannot be
                changed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            handleFormSubmit,
          )}
          className="space-y-4 px-5 pb-5 pt-5 sm:px-6 sm:pb-6"
        >
          <div className="flex items-center justify-between rounded-[18px] border border-primary/10 bg-primary/[0.025] px-4 py-3.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              Receipt Amount
            </span>

            <span className="text-[17px] font-semibold text-primary">
              {paymentForForm?.paidAmount?.toLocaleString()}{" "}
              $
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
              Payment Method
            </label>

            <Controller
              control={control}
              name="paymentMethod"
              render={({
                field,
              }) => (
                <Select
                  value={
                    field.value as string
                  }
                  onValueChange={
                    field.onChange
                  }
                >
                  <SelectTrigger
                    className={
                      FINANCE_SELECT_TRIGGER_CLASS
                    }
                  >
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>

                  <SelectContent className="rounded-[14px] border-border/50 shadow-md">
                    <SelectItem
                      value="cash"
                      className="rounded-[10px]"
                    >
                      Cash
                    </SelectItem>

                    <SelectItem
                      value="bank_transfer"
                      className="rounded-[10px]"
                    >
                      Bank Transfer
                    </SelectItem>

                    <SelectItem
                      value="cheque"
                      className="rounded-[10px]"
                    >
                      Cheque
                    </SelectItem>

                    <SelectItem
                      value="electronic_wallet"
                      className="rounded-[10px]"
                    >
                      E-Wallet
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
              Paper Receipt No.
            </label>

            <Input
              className={cn(
                FINANCE_INPUT_CLASS,
                "text-[12px]",
              )}
              {...register(
                "paperReceiptNo",
              )}
            />
          </div>

          {selectedMethod !==
            "cash" && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/75">
                Digital Reference
              </label>

              <Input
                className={cn(
                  FINANCE_INPUT_CLASS,
                  "text-[12px]",
                )}
                {...register(
                  "digitalReference",
                )}
              />
            </div>
          )}

          <DialogFooter className="gap-2 border-t border-border/35 pt-4 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                onOpenChange(false)
              }
              className="h-10 rounded-[13px] px-4 text-[11.5px] text-muted-foreground hover:bg-muted/50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 rounded-[13px] bg-primary px-5 text-[11.5px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving Changes..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[430px]`}
      >
        <div className="px-6 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-destructive/12 bg-destructive/[0.045] text-destructive">
                <AlertTriangle
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em] text-foreground/90">
                  Delete payment?
                </DialogTitle>

                <DialogDescription className="mt-1.5 max-w-[310px] text-[12px] leading-5 text-muted-foreground/75">
                  This reverses the
                  payment amount in the
                  student balance. This
                  action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="border-t border-border/35 bg-muted/[0.10] px-6 py-5 sm:px-7 sm:py-5">
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={isLoading}
              className="h-10 rounded-[13px] px-5 text-[11.5px] text-muted-foreground hover:bg-muted/50"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-10 rounded-[13px] bg-destructive px-5 text-[11.5px] font-medium text-destructive-foreground shadow-none hover:bg-destructive/90"
            >
              <Trash2
                className="mr-2 h-4 w-4"
                strokeWidth={1.8}
              />

              {isLoading
                ? "Deleting..."
                : "Delete payment"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const statementMethodLabels: Record<
  string,
  string
> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  electronic_wallet:
    "Electronic wallet",
};

function statementMoney(
  value: number,
) {
  return `${new Intl.NumberFormat().format(
    Number(value || 0),
  )} $`;
}

function statementDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
        },
      ).format(date);
}

export function StudentFinancialStatementDialog({
  open,
  onOpenChange,
  studentName,
  academicYearName,
  account,
  installments = [],
}: {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  studentName: string;
  academicYearName?:
    | string
    | null;
  account: import("../types/studentFinance.types").FinancialAccount;
  installments?: import("../types/studentFinance.types").Installment[];
}) {
  const {
    data: payments = [],
    isLoading,
  } = useStudentPayments(
    account.studentId,
    account.id,
  );

  const visiblePayments = payments;

  const totalPaid = Math.max(
    0,
    Number(
      account.totalRequiredAmount,
    ) -
      Number(
        account.remainingBalance,
      ),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={`${FINANCE_DIALOG_CONTENT} sm:max-w-[900px]`}
      >
        <DialogHeader
          className={
            FINANCE_DIALOG_HEADER
          }
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.055] text-primary">
              <ReceiptText
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
              />
            </span>

            <div>
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.025em] text-foreground/92">
                Complete financial
                statement
              </DialogTitle>

              <DialogDescription className="mt-1 text-[12px] leading-5 text-muted-foreground/75">
                Contract, installments,
                and recorded payments
                in one financial statement.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <div className="rounded-[20px] border border-primary/10 bg-primary/[0.025] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-primary/70">
              Student financial
              statement
            </p>

            <h2 className="mt-1 text-[20px] font-semibold text-foreground/90">
              {studentName}
            </h2>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {academicYearName ||
                "Academic year"}{" "}
              ·{" "}
              {account.feePlan?.name ||
                "Fee plan"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[16px] border border-border/45 bg-card p-4">
              <p className="text-[11px] text-muted-foreground">
                Contract total
              </p>

              <p className="mt-1 text-[18px] font-semibold">
                {statementMoney(
                  account.totalRequiredAmount,
                )}
              </p>
            </div>

            <div className="rounded-[16px] border border-success/12 bg-success/[0.025] p-4">
              <p className="text-[11px] text-muted-foreground">
                Total paid
              </p>

              <p className="mt-1 text-[18px] font-semibold text-success">
                {statementMoney(
                  totalPaid,
                )}
              </p>
            </div>

            <div className="rounded-[16px] border border-border/45 bg-card p-4">
              <p className="text-[11px] text-muted-foreground">
                Remaining balance
              </p>

              <p className="mt-1 text-[18px] font-semibold">
                {statementMoney(
                  account.remainingBalance,
                )}
              </p>
            </div>
          </div>

          <section>
            <h3 className="text-[14px] font-semibold text-foreground/90">
              Installment schedule
            </h3>

            <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/30 bg-card/70">
              <table className="w-full min-w-[620px] text-left text-[12px]">
                <thead className="bg-muted/[0.08]">
                  <tr>
                    {[
                      "No.",
                      "Installment",
                      "Due date",
                      "Due",
                      "Paid",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-3 font-semibold text-muted-foreground/75"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {installments.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t border-border/20"
                      >
                        <td className="p-3">
                          {
                            item.installmentNumber
                          }
                        </td>

                        <td className="p-3">
                          {item.title}
                        </td>

                        <td className="p-3">
                          {statementDate(
                            item.dueDate,
                          )}
                        </td>

                        <td className="p-3">
                          {statementMoney(
                            item.amountDue,
                          )}
                        </td>

                        <td className="p-3">
                          {statementMoney(
                            item.amountPaid,
                          )}
                        </td>

                        <td className="p-3 capitalize">
                          {item.status}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-foreground/90">
              Payment history
            </h3>

            {isLoading ? (
              <p className="mt-3 text-[12px] text-muted-foreground">
                Loading payments...
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/30 bg-card/70">
                <table className="w-full min-w-[620px] text-left text-[12px]">
                  <thead className="bg-muted/[0.08]">
                    <tr>
                      {[
                        "Payment",
                        "Date",
                        "Method",
                        "Amount",
                        "Reference",
                      ].map((h) => (
                        <th
                          key={h}
                          className="p-3 font-semibold text-muted-foreground/75"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {visiblePayments.map(
                      (payment, index) => (
                        <tr
                          key={payment.id}
                          className="border-t border-border/20"
                        >
                          <td className="p-3 font-medium text-foreground/85">
                            Payment {index + 1}
                          </td>

                          <td className="p-3">
                            {statementDate(
                              payment.createdAt,
                            )}
                          </td>

                          <td className="p-3">
                            {statementMethodLabels[
                              payment.paymentMethod
                            ] ??
                              payment.paymentMethod}
                          </td>

                          <td className="p-3 font-semibold text-success">
                            {statementMoney(
                              payment.paidAmount,
                            )}
                          </td>

                          <td className="p-3">
                            {payment.paperReceiptNo ||
                              payment.digitalReference ||
                              "—"}
                          </td>
                        </tr>
                      ),
                    )}
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