import { useMemo } from "react";
import { FileText, Printer } from "lucide-react";

import { PrintPreviewDialog, usePrintPreview } from "@/features/printing";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { usePayments } from "../../hooks/usePayments";
import type { FinancialAccount, PaymentReceipt } from "../../types/finance.types";
import { buildFinalStatementDocument } from "./financePrintDocuments";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  academicYearName?: string | null;
  account: FinancialAccount;
};

const methodLabels: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  electronic_wallet: "Electronic wallet",
};

function money(value: number) {
  return `${new Intl.NumberFormat().format(Number(value || 0))} $`;
}

function dateLabel(value?: string) {
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
}: Props) {
  const { data: payments = [], isLoading } = usePayments();

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

  const printPreview = usePrintPreview();

  function printStatement() {
    printPreview.openPreview({
      title: "Final financial statement",
      html: buildFinalStatementDocument({
        account,
        studentName,
        academicYearName,
        payments: visiblePayments,
      }),
      kind: "official-document",
      orientation: "portrait",
    });
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[24px] border-border/55 p-0 sm:max-w-[900px]">
        <DialogHeader className="border-b border-border/40 px-5 py-5 text-start sm:px-6">
          <div className="flex items-start gap-3 pe-9">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-success/15 bg-success/[0.07] text-success">
              <FileText className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div>
              <DialogTitle>Complete financial statement</DialogTitle>
              <DialogDescription>
                Contract, installments, and all recorded payments in one printable document.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-6">
          <div id="student-financial-statement" className="space-y-6">
            <div className="rounded-[20px] border border-primary/14 bg-primary/[0.035] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary/75">Student financial statement</p>
              <h2 className="mt-1 text-[21px] font-semibold text-foreground/92">{studentName}</h2>
              <p className="mt-1 text-[12px] text-muted-foreground">{academicYearName || "Academic year"} · {account.feePlan?.name}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[16px] border border-border/45 p-4"><p className="text-[11px] text-muted-foreground">Contract total</p><p className="mt-1 text-[19px] font-semibold">{money(account.totalRequiredAmount)}</p></div>
              <div className="rounded-[16px] border border-success/18 bg-success/[0.035] p-4"><p className="text-[11px] text-muted-foreground">Total paid</p><p className="mt-1 text-[19px] font-semibold text-success">{money(totalPaid)}</p></div>
              <div className="rounded-[16px] border border-border/45 p-4"><p className="text-[11px] text-muted-foreground">Remaining balance</p><p className="mt-1 text-[19px] font-semibold">{money(account.remainingBalance)}</p></div>
            </div>

            <section>
              <h3 className="text-[14px] font-semibold">Contract details</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[14px] border border-border/40 p-3"><p className="text-[10.5px] text-muted-foreground">Fee plan</p><p className="mt-1 text-[12.5px] font-medium">{account.feePlan?.name || "—"}</p></div>
                <div className="rounded-[14px] border border-border/40 p-3"><p className="text-[10.5px] text-muted-foreground">Installment policy</p><p className="mt-1 text-[12.5px] font-medium">{account.installmentPolicy?.name || "—"}</p></div>
              </div>
            </section>

            <section>
              <h3 className="text-[14px] font-semibold">Installment schedule</h3>
              <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/45">
                <table className="w-full min-w-[620px] text-left text-[12px]">
                  <thead className="bg-muted/25"><tr><th className="p-3">#</th><th className="p-3">Installment</th><th className="p-3">Due date</th><th className="p-3">Due</th><th className="p-3">Paid</th><th className="p-3">Status</th></tr></thead>
                  <tbody>{account.installments.map((item) => <tr key={item.id} className="border-t border-border/35"><td className="p-3">{item.installmentNumber}</td><td className="p-3">{item.title}</td><td className="p-3">{dateLabel(item.dueDate)}</td><td className="p-3">{money(item.amountDue)}</td><td className="p-3">{money(item.amountPaid)}</td><td className="p-3 capitalize">{item.status}</td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="text-[14px] font-semibold">Payment history</h3>
              {isLoading ? <p className="mt-3 text-[12px] text-muted-foreground">Loading payments...</p> : (
                <div className="mt-3 overflow-x-auto rounded-[16px] border border-border/45">
                  <table className="w-full min-w-[620px] text-left text-[12px]">
                    <thead className="bg-muted/25"><tr><th className="p-3">Receipt</th><th className="p-3">Date</th><th className="p-3">Method</th><th className="p-3">Amount</th><th className="p-3">Reference</th></tr></thead>
                    <tbody>{visiblePayments.length ? visiblePayments.map((payment: PaymentReceipt) => <tr key={payment.id} className="border-t border-border/35"><td className="p-3">#{payment.id}</td><td className="p-3">{dateLabel(payment.paymentDate || payment.createdAt)}</td><td className="p-3">{methodLabels[payment.paymentMethod] || payment.paymentMethod}</td><td className="p-3">{money(payment.paidAmount)}</td><td className="p-3">{payment.paperReceiptNo || payment.digitalReference || "—"}</td></tr>) : <tr><td className="p-4 text-muted-foreground" colSpan={5}>No payment records were returned for this account.</td></tr>}</tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="flex items-center justify-between border-t border-dashed border-border/55 pt-4 text-[10.5px] text-muted-foreground">
              <span>Generated from the school finance system.</span>
              <span>Account #{account.id}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-border/40 pt-4">
            <Button type="button" variant="outline" onClick={printStatement} className="rounded-[12px] border-success/20 text-success hover:bg-success/[0.055]">
              <Printer className="h-4 w-4" /> Print complete statement
            </Button>
          </div>
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
