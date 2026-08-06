import { createPrintableHtml, escapePrintHtml } from "@/features/printing";
import type { FinancialAccount, PaymentReceipt } from "../../types/finance.types";

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

const officialStyles = `
  .document { min-height: 297mm; padding: 14mm 16mm 12mm; position: relative; }
  .document::before { content: ""; position: absolute; inset: 0 0 auto; height: 5mm; background: linear-gradient(90deg,#6857c7,#5f8fe8,#56bda2); }
  .header { display:flex; align-items:flex-start; justify-content:space-between; gap:12mm; padding-top:5mm; padding-bottom:7mm; border-bottom:.35mm solid #dedbea; }
  .brand { display:flex; align-items:center; gap:4mm; }
  .logo { width:14mm; height:14mm; display:grid; place-items:center; border-radius:4mm; color:#6755be; background:#f1efff; font-size:6mm; font-weight:800; }
  .school-name { margin:0; font-size:5mm; font-weight:750; letter-spacing:-.02em; }
  .school-meta { margin:1mm 0 0; color:#77738b; font-size:2.7mm; }
  .document-type { text-align:right; }
  .document-type strong { display:block; color:#5f50b2; font-size:3.5mm; text-transform:uppercase; letter-spacing:.11em; }
  .document-type span { display:block; margin-top:1.2mm; color:#77738b; font-size:2.6mm; }
  .hero { display:flex; justify-content:space-between; gap:8mm; margin-top:8mm; padding:6mm; border:.35mm solid #ddd9ef; border-radius:5mm; background:linear-gradient(135deg,#faf9ff,#f5f9ff); }
  .eyebrow { margin:0; color:#6e5bc0; font-size:2.5mm; font-weight:800; letter-spacing:.11em; text-transform:uppercase; }
  h1 { margin:1.5mm 0 0; font-size:7mm; line-height:1.08; letter-spacing:-.035em; }
  .muted { color:#77738b; font-size:2.8mm; }
  .amount-box { min-width:45mm; padding:4mm 5mm; border:.35mm solid #bde2d4; border-radius:4mm; background:#f1fbf7; text-align:right; }
  .amount-box small { color:#4f8e78; font-size:2.4mm; font-weight:750; text-transform:uppercase; letter-spacing:.08em; }
  .amount-box strong { display:block; margin-top:1mm; color:#278267; font-size:7mm; }
  .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:3mm; margin-top:5mm; }
  .field { padding:4mm; border:.3mm solid #e1deeb; border-radius:3.5mm; }
  .field span { display:block; color:#7c788e; font-size:2.4mm; text-transform:uppercase; letter-spacing:.07em; }
  .field strong { display:block; margin-top:1.4mm; font-size:3.2mm; overflow-wrap:anywhere; }
  .section { margin-top:7mm; }
  .section-title { display:flex; align-items:center; gap:3mm; margin:0 0 3mm; font-size:3.7mm; }
  .section-title::after { content:""; height:.3mm; flex:1; background:#e1deeb; }
  table { width:100%; border-collapse:collapse; table-layout:fixed; }
  th { padding:2.8mm; background:#f5f3fa; color:#686379; font-size:2.5mm; text-align:left; }
  td { padding:2.8mm; border-top:.3mm solid #e4e1eb; font-size:2.7mm; vertical-align:top; overflow-wrap:anywhere; }
  .summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:3mm; margin-top:5mm; }
  .summary-card { padding:4mm; border:.3mm solid #e1deeb; border-radius:3.5mm; }
  .summary-card span { color:#77738b; font-size:2.5mm; }
  .summary-card strong { display:block; margin-top:1mm; font-size:4.8mm; }
  .paid { color:#278267; }
  .footer { display:flex; justify-content:space-between; gap:8mm; margin-top:9mm; padding-top:4mm; border-top:.3mm dashed #ccc8da; color:#7c788e; font-size:2.4mm; }
  .signatures { display:grid; grid-template-columns:repeat(2,1fr); gap:20mm; margin-top:13mm; }
  .signature { padding-top:8mm; border-top:.3mm solid #aaa5bb; text-align:center; color:#77738b; font-size:2.6mm; }
  @media print { .document { break-after:page; } }
`;

export function buildPaymentReceiptDocument(payment: PaymentReceipt) {
  const reference = payment.paperReceiptNo || payment.digitalReference || "—";
  const body = `<main class="print-page document">
    <header class="header">
      <div class="brand"><div class="logo">A</div><div><p class="school-name">Aisha School</p><p class="school-meta">Official finance document</p></div></div>
      <div class="document-type"><strong>Payment receipt</strong><span>Receipt #${escapePrintHtml(payment.id)}</span></div>
    </header>
    <section class="hero">
      <div><p class="eyebrow">Amount received successfully</p><h1>${escapePrintHtml(payment.studentName || "Student payment")}</h1><p class="muted">Recorded on ${escapePrintHtml(dateLabel(payment.paymentDate || payment.createdAt))}</p></div>
      <div class="amount-box"><small>Amount received</small><strong>${escapePrintHtml(money(payment.paidAmount))}</strong></div>
    </section>
    <section class="grid">
      <div class="field"><span>Student</span><strong>${escapePrintHtml(payment.studentName || "—")}</strong></div>
      <div class="field"><span>Payment method</span><strong>${escapePrintHtml(paymentMethodLabels[payment.paymentMethod] || payment.paymentMethod)}</strong></div>
      <div class="field"><span>Receipt / reference</span><strong>${escapePrintHtml(reference)}</strong></div>
      <div class="field"><span>Payment date</span><strong>${escapePrintHtml(dateLabel(payment.paymentDate || payment.createdAt))}</strong></div>
      <div class="field"><span>Cashier</span><strong>${escapePrintHtml(payment.cashierName || "—")}</strong></div>
      <div class="field"><span>Applied to</span><strong>${escapePrintHtml(payment.installmentTitle || "Student financial account")}</strong></div>
    </section>
    ${payment.notes ? `<section class="section"><h2 class="section-title">Notes</h2><p class="muted">${escapePrintHtml(payment.notes)}</p></section>` : ""}
    <div class="signatures"><div class="signature">Cashier signature</div><div class="signature">School stamp</div></div>
    <footer class="footer"><span>This receipt is proof of the recorded payment.</span><span>Generated ${escapePrintHtml(dateLabel(new Date().toISOString()))}</span></footer>
  </main>`;

  return createPrintableHtml({ title: `Payment receipt #${payment.id}`, body, styles: officialStyles });
}

export function buildFinalStatementDocument({
  account,
  studentName,
  academicYearName,
  payments,
}: {
  account: FinancialAccount;
  studentName: string;
  academicYearName?: string | null;
  payments: PaymentReceipt[];
}) {
  const totalPaid = Math.max(0, Number(account.totalRequiredAmount) - Number(account.remainingBalance));
  const installmentRows = account.installments.map((item) => `<tr>
    <td>${escapePrintHtml(item.installmentNumber)}</td><td>${escapePrintHtml(item.title)}</td><td>${escapePrintHtml(dateLabel(item.dueDate))}</td><td>${escapePrintHtml(money(item.amountDue))}</td><td>${escapePrintHtml(money(item.amountPaid))}</td><td>${escapePrintHtml(item.status)}</td>
  </tr>`).join("");
  const paymentRows = payments.length ? payments.map((item) => `<tr>
    <td>#${escapePrintHtml(item.id)}</td><td>${escapePrintHtml(dateLabel(item.paymentDate || item.createdAt))}</td><td>${escapePrintHtml(paymentMethodLabels[item.paymentMethod] || item.paymentMethod)}</td><td>${escapePrintHtml(money(item.paidAmount))}</td><td>${escapePrintHtml(item.paperReceiptNo || item.digitalReference || "—")}</td>
  </tr>`).join("") : `<tr><td colspan="5">No payment records were returned for this account.</td></tr>`;

  const body = `<main class="print-page document">
    <header class="header"><div class="brand"><div class="logo">A</div><div><p class="school-name">Aisha School</p><p class="school-meta">Official finance document</p></div></div><div class="document-type"><strong>Final financial statement</strong><span>Account #${escapePrintHtml(account.id)}</span></div></header>
    <section class="hero"><div><p class="eyebrow">Paid in full</p><h1>${escapePrintHtml(studentName)}</h1><p class="muted">${escapePrintHtml(academicYearName || "Academic year")} · ${escapePrintHtml(account.feePlan?.name || "Fee plan")}</p></div><div class="amount-box"><small>Total paid</small><strong>${escapePrintHtml(money(totalPaid))}</strong></div></section>
    <section class="summary"><div class="summary-card"><span>Contract total</span><strong>${escapePrintHtml(money(account.totalRequiredAmount))}</strong></div><div class="summary-card"><span>Total paid</span><strong class="paid">${escapePrintHtml(money(totalPaid))}</strong></div><div class="summary-card"><span>Remaining</span><strong>${escapePrintHtml(money(account.remainingBalance))}</strong></div></section>
    <section class="grid"><div class="field"><span>Fee plan</span><strong>${escapePrintHtml(account.feePlan?.name || "—")}</strong></div><div class="field"><span>Installment policy</span><strong>${escapePrintHtml(account.installmentPolicy?.name || "—")}</strong></div></section>
    <section class="section"><h2 class="section-title">Installment schedule</h2><table><thead><tr><th>#</th><th>Installment</th><th>Due date</th><th>Due</th><th>Paid</th><th>Status</th></tr></thead><tbody>${installmentRows}</tbody></table></section>
    <section class="section"><h2 class="section-title">Payment history</h2><table><thead><tr><th>Receipt</th><th>Date</th><th>Method</th><th>Amount</th><th>Reference</th></tr></thead><tbody>${paymentRows}</tbody></table></section>
    <div class="signatures"><div class="signature">Finance officer</div><div class="signature">School stamp</div></div>
    <footer class="footer"><span>Final statement issued after full settlement of the account.</span><span>Generated ${escapePrintHtml(dateLabel(new Date().toISOString()))}</span></footer>
  </main>`;

  return createPrintableHtml({ title: `Final statement - ${studentName}`, body, styles: officialStyles });
}
