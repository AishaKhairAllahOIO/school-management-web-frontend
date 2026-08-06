import {
  Banknote,
  CalendarDays,
  CircleUserRound,
  CreditCard,
  FileText,
  Printer,
  ReceiptText,
  UserRound,
} from "lucide-react";

import { PrintPreviewDialog, usePrintIdentity, usePrintPreview } from "@/features/printing";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { usePaymentDetails } from "../../hooks/usePayments";
import type {
  PaymentMethod,
  PaymentReceipt,
} from "../../types/finance.types";
import { buildPaymentReceiptDocument } from "./financePrintDocuments";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId?: string | number | null;
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  electronic_wallet: "Electronic wallet",
};

function formatMoney(value: number) {
  return `${new Intl.NumberFormat().format(Number(value || 0))} $`;
}

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ReceiptSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-[20px] bg-muted/65" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[76px] animate-pulse rounded-[16px] bg-muted/50"
          />
        ))}
      </div>
      <div className="h-12 animate-pulse rounded-[14px] bg-muted/55" />
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-border/45 bg-card px-4 py-3.5">
      <div className="flex items-center gap-2 text-muted-foreground/70">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.055em]">
          {label}
        </span>
      </div>
      <p className="mt-2 break-words text-[12.5px] font-medium text-foreground/86">
        {value}
      </p>
    </div>
  );
}

function ReceiptBody({ payment }: { payment: PaymentReceipt }) {
  const reference =
    payment.paperReceiptNo ||
    payment.digitalReference ||
    "Not provided";

  return (
    <div id="finance-payment-receipt" className="space-y-5">
      <div className="rounded-[22px] border border-primary/14 bg-primary/[0.035] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/15 bg-card text-primary shadow-sm">
              <ReceiptText className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-primary/75">
                Official payment receipt
              </p>
              <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.025em] text-foreground/92">
                {payment.studentName || "Student payment"}
              </h3>
              <p className="mt-1 text-[11.5px] text-muted-foreground/75">
                Recorded on {formatDate(payment.paymentDate || payment.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-[18px] border border-success/15 bg-success/[0.055] px-4 py-3 text-start sm:min-w-[180px] sm:text-end">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-success/75">
              Amount received
            </p>
            <p className="mt-1 text-[28px] font-semibold tracking-[-0.035em] text-success">
              {formatMoney(payment.paidAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailItem
          icon={UserRound}
          label="Student"
          value={payment.studentName || "Not supplied by the backend"}
        />
        <DetailItem
          icon={CreditCard}
          label="Payment method"
          value={paymentMethodLabels[payment.paymentMethod] || payment.paymentMethod}
        />
        <DetailItem
          icon={FileText}
          label="Receipt / reference"
          value={reference}
        />
        <DetailItem
          icon={CalendarDays}
          label="Payment date"
          value={formatDate(payment.paymentDate || payment.createdAt)}
        />
        <DetailItem
          icon={CircleUserRound}
          label="Cashier"
          value={payment.cashierName || "Not supplied by the backend"}
        />
        <DetailItem
          icon={Banknote}
          label="Applied to"
          value={payment.installmentTitle || "Student financial account"}
        />
      </div>

      {payment.notes ? (
        <div className="rounded-[16px] border border-border/45 bg-muted/[0.18] px-4 py-3.5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.055em] text-muted-foreground/70">
            Notes
          </p>
          <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-5 text-foreground/82">
            {payment.notes}
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4 border-t border-dashed border-border/55 pt-4 text-[10.5px] text-muted-foreground/65">
        <span>Generated from the school finance system.</span>
        <span>Receipt record #{payment.id}</span>
      </div>
    </div>
  );
}

export function PaymentReceiptDialog({
  open,
  onOpenChange,
  paymentId,
}: Props) {
  const paymentQuery = usePaymentDetails(paymentId, open);

  const printPreview = usePrintPreview();
  const printIdentity = usePrintIdentity();

  function printReceipt() {
    if (!paymentQuery.data) return;
    printPreview.openPreview(buildPaymentReceiptDocument(paymentQuery.data, printIdentity));
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[24px] border-border/55 p-0 sm:max-w-[720px]">
        <DialogHeader className="border-b border-border/40 px-5 py-5 text-start sm:px-6">
          <div className="flex items-start gap-3 pe-9">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-primary/15 bg-primary/[0.07] text-primary">
              <ReceiptText className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground/92">
                Payment receipt
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[12px] font-normal text-muted-foreground/75">
                Review the recorded payment details and print an official copy.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-6">
          {paymentQuery.isLoading ? (
            <ReceiptSkeleton />
          ) : paymentQuery.isError || !paymentQuery.data ? (
            <div className="rounded-[18px] border border-destructive/18 bg-destructive/[0.04] px-5 py-10 text-center">
              <p className="text-[14px] font-medium text-destructive">
                Unable to load this receipt
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                The payment details request failed. Retry without closing the dialog.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => paymentQuery.refetch()}
                disabled={paymentQuery.isFetching}
                className="mt-4 rounded-[12px]"
              >
                {paymentQuery.isFetching ? "Retrying..." : "Try again"}
              </Button>
            </div>
          ) : (
            <>
              <ReceiptBody payment={paymentQuery.data} />
              <div className="mt-5 flex justify-end border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={printReceipt}
                  className="h-10 rounded-[12px] border-primary/20 bg-transparent text-primary hover:bg-primary/[0.055]"
                >
                  <Printer className="h-4 w-4" />
                  Print receipt
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    <PrintPreviewDialog
      open={printPreview.isOpen}
      onOpenChange={printPreview.setOpen}
      document={printPreview.document}
    />
  </>
  );
}
