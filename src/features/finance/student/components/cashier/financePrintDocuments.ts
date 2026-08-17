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

function dateLabel(value?: string | null) {
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

function paymentMethodLabel(method: string) {
  return paymentMethodLabels[method] || method || "—";
}

function safeInstallments(account: FinancialAccount) {
  return Array.isArray(account.installments) ? account.installments : [];
}

function safePayments(payments: PaymentReceipt[]) {
  return Array.isArray(payments) ? payments : [];
}

export function buildPaymentReceiptDocument(
  payment: PaymentReceipt,
  identity: PrintIdentity,
) {
  const paymentDate = dateLabel(payment.createdAt);

  const content = `
    <section class="official-title-block">
      <div>
        <p class="official-kicker">Payment receipt</p>
        <h1 class="official-title">${escapePrintHtml("Student payment")}</h1>
        <p class="official-description">
          Payment recorded on ${escapePrintHtml(paymentDate)}
        </p>
      </div>
      <div class="official-highlight">
        <small>Amount received</small>
        <strong>${escapePrintHtml(money(payment.paidAmount))}</strong>
      </div>
    </section>

    <section class="official-grid">
      <div class="official-field">
        <span>Student</span>
        <strong>${escapePrintHtml("—")}</strong>
      </div>
      <div class="official-field">
        <span>Payment method</span>
        <strong>${escapePrintHtml(paymentMethodLabel(payment.paymentMethod))}</strong>
      </div>
      <div class="official-field">
        <span>Payment date</span>
        <strong>${escapePrintHtml(paymentDate)}</strong>
      </div>
      <div class="official-field">
        <span>Cashier</span>
        <strong>${escapePrintHtml("—")}</strong>
      </div>
      <div class="official-field">
        <span>Applied to</span>
        <strong>${escapePrintHtml("Student financial account")}</strong>
      </div>
    </section>


    <section class="official-note">
      This document confirms that the payment above was recorded in the school financial system.
      Please retain this document for your records.
    </section>
  `;

  return createOfficialDocument({
    title: `Payment receipt - Student`,
    identity,
    documentTitle: "Payment receipt",
    content,
    signatureLabel: "Director / Principal signature",
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
  const totalRequired = Number(account.totalRequiredAmount || 0);
  const remaining = Math.max(0, Number(account.remainingBalance || 0));
  const totalPaid = Math.max(0, totalRequired - remaining);
  const installments = safeInstallments(account);
  const visiblePayments = safePayments(payments);
  const statementStatus =
    remaining <= 0
      ? "Paid in full"
      : account.paymentStatus === "partially_paid"
        ? "Partially paid"
        : "Outstanding";

  const installmentRows = installments.length
    ? installments
        .map(
          (item) => `
            <tr>
              <td>${escapePrintHtml(item.installmentNumber)}</td>
              <td>${escapePrintHtml(item.title)}</td>
              <td>${escapePrintHtml(dateLabel(item.dueDate))}</td>
              <td>${escapePrintHtml(money(item.amountDue))}</td>
              <td>${escapePrintHtml(money(item.amountPaid))}</td>
              <td>${escapePrintHtml(item.status)}</td>
            </tr>`,
        )
        .join("")
    : `<tr><td colspan="6">No installment records are available.</td></tr>`;

  const paymentRows = visiblePayments.length
    ? visiblePayments
        .map(
          (item) => `
            <tr>
              <td>${escapePrintHtml(dateLabel(item.createdAt))}</td>
              <td>${escapePrintHtml(paymentMethodLabel(item.paymentMethod))}</td>
              <td>${escapePrintHtml(money(item.paidAmount))}</td>
              <td>${escapePrintHtml("Financial account")}</td>
            </tr>`,
        )
        .join("")
    : `<tr><td colspan="4">No payment records are available for this account.</td></tr>`;

  const content = `
    <section class="official-title-block">
      <div>
        <p class="official-kicker">${escapePrintHtml(statementStatus)}</p>
        <h1 class="official-title">${escapePrintHtml(studentName)}</h1>
        <p class="official-description">
          ${escapePrintHtml(academicYearName || "Academic year")}
          · ${escapePrintHtml(account.feePlan?.name || "Fee plan")}
        </p>
      </div>
      <div class="official-highlight">
        <small>Total paid</small>
        <strong>${escapePrintHtml(money(totalPaid))}</strong>
      </div>
    </section>

    <section class="official-summary">
      <div class="official-summary-card">
        <span>Contract total</span>
        <strong>${escapePrintHtml(money(totalRequired))}</strong>
      </div>
      <div class="official-summary-card">
        <span>Total paid</span>
        <strong>${escapePrintHtml(money(totalPaid))}</strong>
      </div>
      <div class="official-summary-card">
        <span>Remaining</span>
        <strong>${escapePrintHtml(money(remaining))}</strong>
      </div>
    </section>

    <section class="official-grid" style="margin-top:4mm">
      <div class="official-field">
        <span>Fee plan</span>
        <strong>${escapePrintHtml(account.feePlan?.name || "—")}</strong>
      </div>
      <div class="official-field">
        <span>Installment policy</span>
        <strong>${escapePrintHtml(account.installmentPolicy?.name || "—")}</strong>
      </div>
    </section>

    <section class="official-section">
      <h2 class="official-section-title">Installment schedule</h2>
      <table class="official-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Installment</th>
            <th>Due date</th>
            <th>Due</th>
            <th>Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${installmentRows}</tbody>
      </table>
    </section>

    <section class="official-section">
      <h2 class="official-section-title">Payment history</h2>
      <table class="official-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Applied to</th>
          </tr>
        </thead>
        <tbody>${paymentRows}</tbody>
      </table>
    </section>

    <section class="official-note">
      This statement is an official financial summary generated from the school's recorded account activity.
      It contains no internal system identifiers.
    </section>
  `;

  return createOfficialDocument({
    title: `Final financial statement - ${studentName}`,
    identity,
    documentTitle: "Final financial statement",
    content,
    signatureLabel: "Director / Principal signature",
  });
}
