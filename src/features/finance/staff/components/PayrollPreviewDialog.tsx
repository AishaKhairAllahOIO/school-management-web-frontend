import {
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  Printer,
  X,
} from "lucide-react";

import { useMemo } from "react";

import { useCommitPayroll } from "../hooks/usePayroll";

import type {
  ApiId,
  PayrollPreview,
} from "../types/payroll.types";

import { usePrintIdentity } from "@/features/printing/hooks/usePrintIdentity";
import { usePrintPreview } from "@/features/printing/hooks/usePrintPreview";
import { PrintPreviewDialog } from "@/features/printing/components/PrintPreviewDialog";
import { createOfficialDocument } from "@/features/printing/templates/official-document";

type Props = {
  open: boolean;
  staffId: ApiId;
  year: number;
  month: number;

  preview: PayrollPreview | null;
  previewLoading: boolean;
  previewError: boolean;

  onPreview: () => void;
  onClose: () => void;
  onCommitted: () => void;
};

/* =========================================================
   ARABIC / PERSIAN DIGITS → ENGLISH DIGITS
   ========================================================= */

function toEnglishDigits(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(
      /[٠-٩]/g,
      (digit) =>
        String(
          "٠١٢٣٤٥٦٧٨٩".indexOf(
            digit,
          ),
        ),
    )
    .replace(
      /[۰-۹]/g,
      (digit) =>
        String(
          "۰۱۲۳۴۵۶۷۸۹".indexOf(
            digit,
          ),
        ),
    );
}

/* =========================================================
   ENGLISH NUMBER FORMAT
   ========================================================= */

              
function formatEnglishNumber(
  value:
    | number
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const normalized =
    toEnglishDigits(value);

  const numericValue =
    Number(normalized);

  if (
    Number.isNaN(
      numericValue,
    )
  ) {
    return normalized;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    },
  ).format(numericValue);
}

/* =========================================================
   ENGLISH SALARY FORMAT
   ========================================================= */

function formatEnglishSalary(
  value:
    | number
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const normalized =
    toEnglishDigits(value);

  const numericValue =
    Number(normalized);

  if (
    Number.isNaN(
      numericValue,
    )
  ) {
    return normalized;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  ).format(numericValue);
}

/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function PayrollPreviewDialog({
  open,
  staffId,
  year,
  month,
  preview,
  previewLoading,
  previewError,
  onPreview,
  onClose,
  onCommitted,
}: Props) {
  const commitMutation =
    useCommitPayroll();

  /* =======================================================
     PRINTING
     ======================================================= */

  const printIdentity =
    usePrintIdentity();

  const printPreview =
    usePrintPreview();

  /**
   * Build the printable payroll document.
   *
   * We only create the document when a payroll
   * preview actually exists.
   */
  const printablePayroll =
    useMemo(() => {
      if (!preview) {
        return null;
      }

      const period =
        `${toEnglishDigits(month)}/${toEnglishDigits(year)}`;

      const paymentDate =
        new Date()
          .toISOString()
          .slice(0, 10);

      const staffReference =
        toEnglishDigits(staffId);

      const content = `
      

    

            <div class="official-field">
              <span>
                Payment Date
              </span>

              <strong dir="ltr">
                ${escapeHtml(
                  paymentDate,
                )}
              </strong>
            </div>
   


        <section class="official-section">
          <h3 class="official-section-title">
            Salary Details
          </h3>

          <table class="official-table">
            <thead>
              <tr>
                <th>
                  Description
                </th>

                <th>
                  Value
                </th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  Contract rate
                </td>

                <td dir="ltr">
                  ${escapeHtml(
                    formatEnglishSalary(
                      preview.contract_rate,
                    ),
                  )}
                </td>
              </tr>


              <tr>
                <td>
                  Expected units
                </td>

                <td dir="ltr">
                  ${escapeHtml(
                    formatEnglishNumber(
                      preview.expected_units,
                    ),
                  )}
                </td>
              </tr>


              <tr>
                <td>
                  Missed units
                </td>

                <td dir="ltr">
                  ${escapeHtml(
                    formatEnglishNumber(
                      preview.missed_units,
                    ),
                  )}
                </td>
              </tr>


              <tr>
                <td>
                  Deductions
                </td>

                <td dir="ltr">
                  ${escapeHtml(
                    formatEnglishSalary(
                      preview.deductions,
                    ),
                  )}
                </td>
              </tr>

            </tbody>
          </table>
        </section>


        <section class="official-summary">

          <div class="official-summary-card">
            <span>
              Contract Rate
            </span>

            <strong dir="ltr">
              ${escapeHtml(
                formatEnglishSalary(
                  preview.contract_rate,
                ),
              )}
            </strong>
          </div>


          <div class="official-summary-card">
            <span>
              Deductions
            </span>

            <strong dir="ltr">
              ${escapeHtml(
                formatEnglishSalary(
                  preview.deductions,
                ),
              )}
            </strong>
          </div>


          <div class="official-summary-card">
            <span>
              Net Salary
            </span>

            <strong dir="ltr">
              ${escapeHtml(
                formatEnglishSalary(
                  preview.net_salary,
                ),
              )}
            </strong>
          </div>

        </section>


        <div class="official-note">
          This document represents the payroll calculation
          generated for the selected payroll period.
          The final payment status is determined after
          the payroll is confirmed.
        </div>
      `;

    return createOfficialDocument({
  title: `Payroll - ${period}`,

  identity: printIdentity,

  documentTitle: "PAYROLL STATEMENT",

  reference: `PAYROLL-${staffReference}-${period}`,

  content,

  signatureLabel: "Authorized payroll officer",
});
    }, [
      month,
      year,
      staffId,
      preview,
      printIdentity,
    ]);

  /* =======================================================
     PRINT
     ======================================================= */

  function handlePrint() {
    if (!printablePayroll) {
      return;
    }

    printPreview.openPreview(
      printablePayroll,
    );
  }

  /* =======================================================
     COMMIT
     ======================================================= */

  async function commit() {
    await commitMutation.mutateAsync({
      staff_id: staffId,
      year,
      month,
      payment_date:
        new Date()
          .toISOString()
          .slice(0, 10),
    });

    onCommitted();
    onClose();
  }

  /* =======================================================
     PRINT PREVIEW
     ======================================================= */

  const printDialog =
    printablePayroll ? (
      <PrintPreviewDialog
        open={printPreview.isOpen}
        onOpenChange={
          printPreview.setOpen
        }
        document={
          printPreview.document
        }
      />
    ) : null;

  /* =======================================================
     CLOSED
     ======================================================= */

  if (!open) {
    return (
      <>
        {printDialog}
      </>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          p-4
        "
      >

        {/* =================================================
            BACKDROP
           ================================================= */}

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={
            commitMutation.isPending
          }
          className="
            absolute
            inset-0
            cursor-default
            bg-black/25
            backdrop-blur-[2px]
          "
        />


        {/* =================================================
            DIALOG
           ================================================= */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-[440px]
            overflow-hidden
            rounded-[22px]
            border
            border-border/50
            bg-card
            shadow-[0_20px_60px_rgba(31,22,73,0.16)]
          "
        >

          {/* =================================================
              HEADER
             ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-border/40
              px-5
              py-4
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/[0.08]
                  text-primary
                "
              >
                <CircleDollarSign
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              </div>


              <div>

                <h2
                  className="
                    text-[14px]
                    font-semibold
                    leading-tight
                    text-foreground
                  "
                >
                  Payroll preview
                </h2>

                <p
                  dir="ltr"
                  className="
                    mt-1
                    text-[10.5px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  {toEnglishDigits(
                    month,
                  )}
                  /
                  {toEnglishDigits(
                    year,
                  )}
                </p>

              </div>

            </div>


            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              disabled={
                commitMutation.isPending
              }
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-xl
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/20
                focus-visible:ring-offset-2
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <X
                className="size-4"
                strokeWidth={1.8}
              />
            </button>

          </div>


          {/* =================================================
              CONTENT
             ================================================= */}

          <div className="px-5 py-5">

            {/* =================================================
                BEFORE PREVIEW
               ================================================= */}

            {!preview && (
              <div className="py-3 text-center">

                <div
                  className="
                    mx-auto
                    flex
                    size-11
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-primary/[0.07]
                    text-primary
                  "
                >
                  <CircleDollarSign
                    className="size-5"
                    strokeWidth={1.7}
                  />
                </div>


                <h3
                  className="
                    mt-3
                    text-[13px]
                    font-semibold
                    text-foreground
                  "
                >
                  Calculate payroll
                </h3>


                <p
                  className="
                    mx-auto
                    mt-1.5
                    max-w-[280px]
                    text-[10.5px]
                    leading-5
                    text-muted-foreground
                  "
                >
                  Calculate the employee salary
                  before confirming the payment.
                </p>


                <button
                  type="button"
                  onClick={onPreview}
                  disabled={previewLoading}
                  className="
                    mt-4
                    inline-flex
                    h-9
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-border/50
                    bg-background
                    px-3.5
                    text-[11.5px]
                    font-semibold
                    text-foreground
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-primary/30
                    hover:bg-primary/[0.035]
                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/20
                    focus-visible:ring-offset-2
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >

                  {previewLoading ? (
                    <Loader2
                      className="
                        size-3.5
                        animate-spin
                      "
                      strokeWidth={2}
                    />
                  ) : (
                    <CircleDollarSign
                      className="size-3.5"
                      strokeWidth={1.9}
                    />
                  )}

                  Generate preview

                </button>


                {previewError && (
                  <p
                    className="
                      mt-3
                      text-[10.5px]
                      font-medium
                      text-destructive
                    "
                  >
                    Unable to generate payroll
                    preview.
                  </p>
                )}

              </div>
            )}


            {/* =================================================
                PREVIEW
               ================================================= */}

            {preview && (
              <>

                {/* =================================================
                    SUMMARY
                   ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-[15px]
                    border
                    border-border/40
                    bg-muted/[0.18]
                    px-4
                    py-3
                  "
                >

                  <div>

                    <p
                      className="
                        text-[10px]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      Payroll period
                    </p>

                    <p
                      dir="ltr"
                      className="
                        mt-0.5
                        text-[12px]
                        font-semibold
                        text-foreground
                      "
                    >
                      {toEnglishDigits(
                        month,
                      )}
                      /
                      {toEnglishDigits(
                        year,
                      )}
                    </p>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-medium
                      text-success
                    "
                  >

                    <CheckCircle2
                      className="size-3.5"
                      strokeWidth={2}
                    />

                    Preview ready

                  </div>

                </div>


                {/* =================================================
                    DETAILS
                   ================================================= */}

                <div
                  className="
                    mt-3
                    overflow-hidden
                    rounded-[15px]
                    border
                    border-border/40
                    bg-background
                  "
                >

                  <PreviewRow
                    label="Contract rate"
                    value={formatEnglishSalary(
                      preview.contract_rate,
                    )}
                  />

                  <PreviewRow
                    label="Expected units"
                    value={formatEnglishNumber(
                      preview.expected_units,
                    )}
                  />

                  <PreviewRow
                    label="Missed units"
                    value={formatEnglishNumber(
                      preview.missed_units,
                    )}
                  />

                  <PreviewRow
                    label="Deductions"
                    value={formatEnglishSalary(
                      preview.deductions,
                    )}
                    last
                  />

                </div>


                {/* =================================================
                    NET SALARY
                   ================================================= */}

                <div
                  className="
                    mt-3
                    rounded-[16px]
                    bg-primary/[0.065]
                    px-4
                    py-3.5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[10px]
                          font-medium
                          text-muted-foreground
                        "
                      >
                        Net salary
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[9.5px]
                          text-muted-foreground
                        "
                      >
                        Final payment amount
                      </p>

                    </div>


                    <span
                      dir="ltr"
                      className="
                        whitespace-nowrap
                        text-[20px]
                        font-bold
                        tracking-tight
                        text-primary
                      "
                    >
                      {formatEnglishSalary(
                        preview.net_salary,
                      )}
                    </span>

                  </div>

                </div>


                {/* =================================================
                    ERROR
                   ================================================= */}

                {commitMutation.isError && (
                  <div
                    className="
                      mt-3
                      rounded-xl
                      bg-destructive/[0.07]
                      px-3
                      py-2.5
                      text-[10.5px]
                      font-medium
                      text-destructive
                    "
                  >
                    Failed to commit payroll.
                    Please try again.
                  </div>
                )}


                {/* =================================================
                    ACTIONS
                   ================================================= */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-border/35
                    pt-4
                  "
                >

                  {/* LEFT */}

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={
                      commitMutation.isPending
                    }
                    className="
                      px-1
                      py-1
                      text-[11.5px]
                      font-medium
                      text-muted-foreground
                      underline
                      underline-offset-4
                      decoration-muted-foreground/25
                      transition-all
                      duration-200
                      hover:text-foreground
                      hover:decoration-foreground/40
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary/20
                      focus-visible:ring-offset-2
                      disabled:pointer-events-none
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  {/* RIGHT ACTIONS */}

                  <div className="flex items-center gap-4">

                    {/* =================================================
                        PRINT
                       ================================================= */}

                    <button
                      type="button"
                      onClick={
                        handlePrint
                      }
                      disabled={
                        !printablePayroll ||
                        commitMutation.isPending
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-1
                        py-1
                        text-[11.5px]
                        font-semibold
                        text-muted-foreground
                        underline
                        underline-offset-4
                        decoration-muted-foreground/25
                        transition-all
                        duration-200
                        hover:text-foreground
                        hover:decoration-foreground/60
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        focus-visible:ring-offset-2
                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >

                      <Printer
                        className="size-3.5"
                        strokeWidth={1.9}
                      />

                      Print

                    </button>


                    {/* =================================================
                        CONFIRM
                       ================================================= */}

                    <button
                      type="button"
                      onClick={commit}
                      disabled={
                        commitMutation.isPending
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-1
                        py-1
                        text-[11.5px]
                        font-semibold
                        text-primary
                        underline
                        underline-offset-4
                        decoration-primary/30
                        transition-all
                        duration-200
                        hover:text-primary/70
                        hover:decoration-primary
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        focus-visible:ring-offset-2
                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >

                      {commitMutation.isPending ? (
                        <Loader2
                          className="
                            size-3.5
                            animate-spin
                          "
                          strokeWidth={2}
                        />
                      ) : (
                        <CheckCircle2
                          className="size-3.5"
                          strokeWidth={2}
                        />
                      )}

                      Confirm payment

                    </button>

                  </div>

                </div>

              </>
            )}

          </div>

        </div>

      </div>


      {/* =======================================================
          PRINT PREVIEW DIALOG
         ======================================================= */}

      {printDialog}

    </>
  );
}


/* =========================================================
   PREVIEW ROW
   ========================================================= */

function PreviewRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex",
        "items-center",
        "justify-between",
        "gap-4",
        "px-4",
        "py-2.5",
        !last
          ? "border-b border-border/35"
          : "",
      ].join(" ")}
    >

      <span
        className="
          text-[10.5px]
          font-medium
          text-muted-foreground
        "
      >
        {label}
      </span>


      <span
        dir="ltr"
        className="
          whitespace-nowrap
          text-[12px]
          font-semibold
          text-foreground
        "
      >
        {toEnglishDigits(value)}
      </span>

    </div>
  );
}