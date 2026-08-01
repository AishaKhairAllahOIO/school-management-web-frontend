import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CreditCard,
  Printer,
  ReceiptText,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

import { financeOperationsService } from "../../services/finance-operations.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string | number | null;
};

const formatMethod = (method: string) =>
  ({
    cash: "Cash",
    bank_transfer: "Bank transfer",
    cheque: "Cheque",
    electronic_wallet: "E-wallet",
  })[method] ?? method;

function ReceiptSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-[20px] bg-muted/60" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[74px] animate-pulse rounded-[16px] bg-muted/50"
          />
        ))}
      </div>
      <div className="h-11 animate-pulse rounded-[14px] bg-muted/55" />
    </div>
  );
}

export function PaymentReceiptDialog({
  open,
  onOpenChange,
  paymentId,
}: Props) {
  const {
    data: receipt,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payment-details", paymentId],
    queryFn: () => financeOperationsService.getPaymentDetails(paymentId!),
    enabled: Boolean(paymentId) && open,
  });

  function printReceipt() {
    if (!receipt) return;

    const popup = window.open("", "_blank", "width=900,height=960");
    if (!popup) return;

    const amount = Number(receipt.paidAmount ?? 0).toLocaleString();
    const reference =
      receipt.paperReceiptNo || receipt.digitalReference || "—";
    const cashier = receipt.cashierName || "System administrator";
    const date = receipt.paymentDate || "Not specified";

    popup.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Official payment receipt</title>
  <style>
    *{box-sizing:border-box}
    @page{size:A4;margin:12mm}
    body{margin:0;background:#eef0f6;color:#171726;font-family:Inter,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{position:relative;width:186mm;min-height:273mm;margin:18px auto;background:#fff;border:1px solid #e7e5f1;border-radius:20px;overflow:hidden;box-shadow:0 24px 70px rgba(35,24,83,.12)}
    .accent{height:4px;background:#24232c}
    .content{padding:22mm 18mm 16mm}
    .header{display:flex;justify-content:space-between;gap:30px;padding-bottom:20px;border-bottom:1px solid #e9e7f2}
    .brand-kicker,.label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#858198}
    .brand{margin-top:7px;font-size:25px;font-weight:700;letter-spacing:-.03em;color:#18172a}
    .brand-note{margin-top:5px;font-size:12px;color:#77738a}
    .document{text-align:right}
    .document-title{font-size:17px;font-weight:700;color:#24232c;text-transform:uppercase;letter-spacing:.08em}
    .receipt-no{margin-top:8px;font-size:12px;color:#77738a}
    .status{display:inline-flex;margin-top:12px;padding:6px 11px;border:1px solid #d8d6df;border-radius:999px;background:#f6f5f8;color:#34323d;font-size:11px;font-weight:700}
    .amount{margin:26px 0 22px;padding:24px;border:1px solid #dedce4;border-radius:16px;background:#f8f7f9;text-align:center}
    .amount-value{margin-top:7px;font-size:39px;line-height:1;font-weight:750;letter-spacing:-.04em;color:#1f1e25}
    .amount-currency{font-size:17px;font-weight:650;color:#5f5c68}
    .details{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e8e6ef;border-radius:18px;overflow:hidden}
    .detail{padding:16px 17px;min-height:72px;border-bottom:1px solid #eceaf2}
    .detail:nth-child(odd){border-right:1px solid #eceaf2}
    .detail:nth-last-child(-n+2){border-bottom:0}
    .detail strong{display:block;margin-top:7px;font-size:13px;font-weight:650;color:#27263a;word-break:break-word}
    .note{margin-top:22px;padding:14px 16px;border-left:3px solid #4a4852;border-radius:0 12px 12px 0;background:#f8f7f9;color:#6f6b7f;font-size:11px;line-height:1.65}
    .footer{position:absolute;left:18mm;right:18mm;bottom:15mm;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-top:18px;border-top:1px solid #e9e7f2}
    .footer-copy{max-width:320px;font-size:10.5px;line-height:1.6;color:#8a8798}
    .signature{width:175px;text-align:center;color:#77738a;font-size:10.5px}
    .signature-line{height:42px;border-bottom:1px solid #aaa7b6;margin-bottom:8px}
    @media print{
      body{background:#fff}
      .page{width:auto;min-height:273mm;margin:0;border:0;border-radius:0;box-shadow:none}
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="accent"></div>
    <div class="content">
      <header class="header">
        <div>
          <div class="brand-kicker">School management system</div>
          <div class="brand">School Finance Office</div>
          <div class="brand-note">Official student payment document</div>
        </div>
        <div class="document">
          <div class="document-title">Payment Receipt</div>
          <div class="receipt-no">Student payment confirmation</div>
          <div class="status">Payment received</div>
        </div>
      </header>

      <section class="amount">
        <div class="label">Amount received</div>
        <div class="amount-value">${amount} <span class="amount-currency">$</span></div>
      </section>

      <section class="details">
        <div class="detail"><span class="label">Payment date</span><strong>${date}</strong></div>
        <div class="detail"><span class="label">Payment method</span><strong>${formatMethod(receipt.paymentMethod)}</strong></div>
        <div class="detail"><span class="label">Reference</span><strong>${reference}</strong></div>
        <div class="detail"><span class="label">Processed by</span><strong>${cashier}</strong></div>
      </section>

      <div class="note">This receipt confirms that the amount shown above was recorded by the school finance office. Keep this document for your records.</div>
    </div>

    <footer class="footer">
      <div class="footer-copy">Generated electronically by the School Management System. The payment reference can be used for internal verification.</div>
      <div class="signature"><div class="signature-line"></div>Authorized signature</div>
    </footer>
  </main>
  <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script>
</body>
</html>`);

    popup.document.close();
  }

  const details = receipt
    ? [
        {
          icon: CalendarDays,
          label: "Payment date",
          value: receipt.paymentDate || "Not specified",
        },
        {
          icon: CreditCard,
          label: "Payment method",
          value: formatMethod(receipt.paymentMethod),
        },
        {
          icon: UserRound,
          label: "Processed by",
          value: receipt.cashierName || "System administrator",
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[24px] border-border/55 p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b border-border/40 px-6 py-5 text-start">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-primary/16 bg-primary/[0.07] text-primary">
              <ReceiptText className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div>
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground/92">
                Official payment receipt
              </DialogTitle>
              <p className="mt-0.5 text-[12px] text-muted-foreground/75">
                Review the payment document before printing.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {isLoading ? (
            <ReceiptSkeleton />
          ) : isError || !receipt ? (
            <div className="rounded-[18px] border border-destructive/18 bg-destructive/[0.04] px-5 py-10 text-center">
              <p className="text-[14px] font-medium text-destructive">
                Unable to load receipt details
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Please close the dialog and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[18px] border border-border/55 bg-muted/[0.22] px-5 py-5">
                
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/75">
                      Amount received
                    </p>
                    <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.035em] text-foreground/92">
                      {receipt.paidAmount?.toLocaleString()} $
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1.5 text-[11px] font-medium text-foreground/72">
                    Payment received
                  </span>
                </div>
                <div className="relative mt-4 border-t border-border/50 pt-3 text-[11.5px] text-muted-foreground/80">
                  Reference: {receipt.paperReceiptNo || receipt.digitalReference || "—"}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-[16px] border border-border/45 bg-card px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span className="text-[10.5px] font-medium uppercase tracking-[0.055em]">
                        {label}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-[12.5px] font-medium text-foreground/85">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={printReceipt}
                className="h-11 w-full rounded-[14px] text-[13px] font-medium"
              >
                <Printer className="me-2 h-4 w-4" strokeWidth={1.8} />
                Print official receipt
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
