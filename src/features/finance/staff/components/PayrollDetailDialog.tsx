import {
  CheckCircle2,
  Clock3,
  Loader2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { usePayroll, useUpdatePayroll } from "../hooks/usePayroll";

import {
  getStaffName,
} from "../utils/payroll.utils";

import type { ApiId } from "../types/payroll.types";

import { DatePicker } from "@/shared/ui/date-picker/DatePicker";

type Props = {
  payrollId: ApiId | null;
  onClose: () => void;
};

export function PayrollDetailDialog({
  payrollId,
  onClose,
}: Props) {
  const query = usePayroll(
    payrollId ?? undefined,
  );

  const updateMutation =
    useUpdatePayroll();

  const [paymentDate, setPaymentDate] =
    useState("");

  const payroll =
    query.data?.data;

  /*
   * Keep payment date synchronized
   * whenever another payroll is opened.
   */
  useEffect(() => {
    setPaymentDate(
      payroll?.payment_date ?? "",
    );
  }, [
    payroll?.id,
    payroll?.payment_date,
  ]);

  async function saveDate() {
    if (!payroll || !paymentDate) {
      return;
    }

    await updateMutation.mutateAsync({
      id: payroll.id,
      payload: {
        payment_date: paymentDate,
      },
    });
  }

  if (!payrollId) {
    return null;
  }

  return (
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
      {/* =====================================================
          BACKDROP
         ===================================================== */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        disabled={
          updateMutation.isPending
        }
        className="
          absolute
          inset-0
          cursor-default
          bg-black/25
          backdrop-blur-[2px]
        "
      />

      {/* =====================================================
          DIALOG
         ===================================================== */}

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
        {/* =====================================================
            HEADER
           ===================================================== */}

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
          <div>
            <h2
              className="
                text-[14px]
                font-semibold
                leading-tight
                text-foreground
              "
            >
              Payroll details
            </h2>

            <p
              className="
                mt-1
                text-[10.5px]
                font-medium
                text-muted-foreground
              "
            >
              Payment information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              updateMutation.isPending
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

        {/* =====================================================
            LOADING
           ===================================================== */}

        {query.isLoading && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-5
              py-12
            "
          >
            <Loader2
              className="
                size-5
                animate-spin
                text-primary
              "
              strokeWidth={1.8}
            />

            <p
              className="
                mt-3
                text-[11px]
                text-muted-foreground
              "
            >
              Loading payroll...
            </p>
          </div>
        )}

        {/* =====================================================
            ERROR
           ===================================================== */}

        {query.isError && (
          <div
            className="
              px-5
              py-10
              text-center
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                text-destructive
              "
            >
              Failed to load payroll.
            </p>

            <p
              className="
                mt-1
                text-[10.5px]
                text-muted-foreground
              "
            >
              Please try again.
            </p>
          </div>
        )}

        {/* =====================================================
            CONTENT
           ===================================================== */}

        {payroll && (
          <div className="px-5 py-5">

            {/* =================================================
                EMPLOYEE / PERIOD
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
              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[13px]
                    font-semibold
                    text-foreground
                  "
                >
                  {getStaffName(
                    payroll.staff,
                  )}
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  Payroll period
                </p>
              </div>

              <p
                dir="ltr"
                className="
                  shrink-0
                  text-[12px]
                  font-semibold
                  text-foreground
                "
              >
                {formatEnglishNumber(
                  payroll.month,
                )}
                /
                {formatEnglishNumber(
                  payroll.year,
                )}
              </p>
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
              <InfoRow
                label="Net salary"
                value={formatEnglishSalary(
                  payroll.net_salary,
                )}
              />

              

              <InfoRow
                label="Status"
                value={
                  payroll.payment_date
                    ? "Paid"
                    : "Pending"
                }
                icon={
                  payroll.payment_date
                    ? CheckCircle2
                    : Clock3
                }
                iconClassName={
                  payroll.payment_date
                    ? "text-success"
                    : "text-warning"
                }
              />

            
            </div>

            {/* =================================================
                PAYMENT DATE
               ================================================= */}

            <div className="mt-4">

              <DatePicker
                value={paymentDate}
                onChange={setPaymentDate}
                label="Payment date"
                placeholder="Select payment date"
                disabled={
                  updateMutation.isPending
                }
                className="w-full"
              />

              {/* =================================================
                  SAVE
                 ================================================= */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-end
                "
              >
                <button
                  type="button"
                  onClick={saveDate}
                  disabled={
                    updateMutation.isPending ||
                    !paymentDate
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
                  {updateMutation.isPending && (
                    <Loader2
                      className="
                        size-3.5
                        animate-spin
                      "
                      strokeWidth={2}
                    />
                  )}

                  Save
                </button>
              </div>

              {/* ERROR */}

              {updateMutation.isError && (
                <p
                  className="
                    mt-2
                    text-[10.5px]
                    font-medium
                    text-destructive
                  "
                >
                  Failed to update payment
                  date.
                </p>
              )}

            </div>

            {/* =================================================
                FOOTER
               ================================================= */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-end
                border-t
                border-border/35
                pt-4
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={
                  updateMutation.isPending
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
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   INFO ROW
   ========================================================= */

function InfoRow({
  label,
  value,
  icon: Icon,
  iconClassName = "text-success",
  last = false,
}: {
  label: string;
  value: string;
  icon?: typeof CheckCircle2;
  iconClassName?: string;
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

      <div
        dir="ltr"
        className="
          flex
          items-center
          gap-1.5
          text-[12px]
          font-semibold
          text-foreground
        "
      >
        {Icon && (
          <Icon
            className={[
              "size-3.5",
              iconClassName,
            ].join(" ")}
            strokeWidth={1.9}
          />
        )}

        <span>{value}</span>
      </div>
    </div>
  );
}

/* =========================================================
   ENGLISH NUMBER
   ========================================================= */

function toEnglishDigits(
  value: string,
): string {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(
          digit,
        ),
      ),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(
          digit,
        ),
      ),
    );
}

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
    toEnglishDigits(
      String(value),
    );

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
    toEnglishDigits(
      String(value),
    );

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