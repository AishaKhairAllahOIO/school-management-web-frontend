import {
  createOfficialDocument,
  escapePrintHtml,
  type PrintIdentity,
} from "@/features/printing";
import type {
  FinancialAccount,
  PaymentReceipt,
} from "../../types/finance.types";

const paymentMethodLabels: Record<string, string> = {
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
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}

export function buildPaymentReceiptDocument(
  payment: PaymentReceipt,
  identity: PrintIdentity,
) {
  const reference = payment.paperReceiptNo || payment.digitalReference || "—";
  const content = `
    <section class="official-title-block">
      <div><p class="official-kicker">Payment confirmed</p><h1 class="official-title">${escapePrintHtml(payment.studentName || "Student payment")}</h1><p class="official-description">Recorded on ${escapePrintHtml(dateLabel(payment.paymentDate || payment.createdAt))}</p></div>
      <div class="official-highlight"><small>Amount received</small><strong>${escapePrintHtml(money(payment.paidAmount))}</strong></div>
    </section>
    <section class="official-grid">
      <div class="official-field"><span>Student</span><strong>${escapePrintHtml(payment.studentName || "—")}</strong></div>
      <div class="official-field"><span>Payment method</span><strong>${escapePrintHtml(paymentMethodLabels[payment.paymentMethod] || payment.paymentMethod)}</strong></div>
      <div class="official-field"><span>Receipt / reference</span><strong>${escapePrintHtml(reference)}</strong></div>
      <div class="official-field"><span>Payment date</span><strong>${escapePrintHtml(dateLabel(payment.paymentDate || payment.createdAt))}</strong></div>
      <div class="official-field"><span>Cashier</span><strong>${escapePrintHtml(payment.cashierName || "—")}</strong></div>
      <div class="official-field"><span>Applied to</span><strong>${escapePrintHtml(payment.installmentTitle || "Student financial account")}</strong></div>
    </section>
    ${payment.notes ? `<section class="official-section"><h2 class="official-section-title">Notes</h2><p class="official-description">${escapePrintHtml(payment.notes)}</p></section>` : ""}
    <div class="official-signatures"><div class="official-signature">Cashier signature</div><div class="official-signature">School stamp</div></div>
    <footer class="official-footer"><span>This receipt confirms the recorded payment.</span><span>Generated ${escapePrintHtml(dateLabel(new Date().toISOString()))}</span></footer>`;

  return createOfficialDocument({
    title: `Payment receipt #${payment.id}`,
    identity,
    documentTitle: "Payment receipt",
    reference: `Receipt #${payment.id}`,
    content,
  });
}

export function buildFinalStatementDocument({
  account,
  studentName,
  academicYearName,
  payments,
  identity,
}: {
  account: FinancialAccount;
  studentName: string;
  academicYearName?: string | null;
  payments: PaymentReceipt[];
  identity: PrintIdentity;
}) {
  const totalPaid = Math.max(
    0,
    Number(account.totalRequiredAmount) - Number(account.remainingBalance),
  );
  const installmentRows = account.installments
    .map(
      (item) => `<tr><td>${escapePrintHtml(item.installmentNumber)}</td><td>${escapePrintHtml(item.title)}</td><td>${escapePrintHtml(dateLabel(item.dueDate))}</td><td>${escapePrintHtml(money(item.amountDue))}</td><td>${escapePrintHtml(money(item.amountPaid))}</td><td>${escapePrintHtml(item.status)}</td></tr>`,
    )
    .join("");
  const paymentRows = payments.length
    ? payments
        .map(
          (item) => `<tr><td>#${escapePrintHtml(item.id)}</td><td>${escapePrintHtml(dateLabel(item.paymentDate || item.createdAt))}</td><td>${escapePrintHtml(paymentMethodLabels[item.paymentMethod] || item.paymentMethod)}</td><td>${escapePrintHtml(money(item.paidAmount))}</td><td>${escapePrintHtml(item.paperReceiptNo || item.digitalReference || "—")}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="5">No payment records were returned for this account.</td></tr>`;

  const content = `
    <section class="official-title-block">
      <div><p class="official-kicker">Paid in full</p><h1 class="official-title">${escapePrintHtml(studentName)}</h1><p class="official-description">${escapePrintHtml(academicYearName || "Academic year")} · ${escapePrintHtml(account.feePlan?.name || "Fee plan")}</p></div>
      <div class="official-highlight"><small>Total paid</small><strong>${escapePrintHtml(money(totalPaid))}</strong></div>
    </section>
    <section class="official-summary">
      <div class="official-summary-card"><span>Contract total</span><strong>${escapePrintHtml(money(account.totalRequiredAmount))}</strong></div>
      <div class="official-summary-card"><span>Total paid</span><strong>${escapePrintHtml(money(totalPaid))}</strong></div>
      <div class="official-summary-card"><span>Remaining</span><strong>${escapePrintHtml(money(account.remainingBalance))}</strong></div>
    </section>
    <section class="official-grid" style="margin-top:4mm"><div class="official-field"><span>Fee plan</span><strong>${escapePrintHtml(account.feePlan?.name || "—")}</strong></div><div class="official-field"><span>Installment policy</span><strong>${escapePrintHtml(account.installmentPolicy?.name || "—")}</strong></div></section>
    <section class="official-section"><h2 class="official-section-title">Installment schedule</h2><table class="official-table"><thead><tr><th>#</th><th>Installment</th><th>Due date</th><th>Due</th><th>Paid</th><th>Status</th></tr></thead><tbody>${installmentRows}</tbody></table></section>
    <section class="official-section"><h2 class="official-section-title">Payment history</h2><table class="official-table"><thead><tr><th>Receipt</th><th>Date</th><th>Method</th><th>Amount</th><th>Reference</th></tr></thead><tbody>${paymentRows}</tbody></table></section>
    <div class="official-signatures"><div class="official-signature">Finance officer</div><div class="official-signature">School stamp</div></div>
    <footer class="official-footer"><span>Final statement issued after full settlement of the account.</span><span>Generated ${escapePrintHtml(dateLabel(new Date().toISOString()))}</span></footer>`;

  return createOfficialDocument({
    title: `Final statement - ${studentName}`,
    identity,
    documentTitle: "Final financial statement",
    reference: `Account #${account.id}`,
    content,
  });
}
