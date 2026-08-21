import { useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Wallet,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import type { Installment } from "../types/studentFinance.types";
import { StudentFinanceSectionShell } from "./StudentFinanceSectionShell";
import { StudentFinanceTableSkeleton } from "./StudentFinanceTableSkeleton";

type StudentInstallmentsSectionProps = {
  installments: Installment[];
  isLoading?: boolean;
  title?: string;
  description?: string;
};

function formatAmount(value: number | undefined | null) {
  return `${Number(value ?? 0).toLocaleString()} $`;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInstallmentState(item: Installment) {
  // The backend is the source of truth for installment status.
  // Do not infer `overdue` from the browser date because an API response
  // of `pending` must remain `Pending` even when its due date is in the past.
  switch (item.status) {
    case "paid":
      return {
        label: "Paid",
        className:
          "border-success/18 bg-success/[0.075] text-success",
        icon: CheckCircle2,
      };

    case "overdue":
      return {
        label: "Overdue",
        className:
          "border-destructive/18 bg-destructive/[0.06] text-destructive",
        icon: Clock3,
      };

    case "pending":
    default:
      return {
        label: "Pending",
        className:
          "border-info/18 bg-info/[0.07] text-info",
        icon: CalendarClock,
      };
  }
}

function InstallmentStatus({
  item,
}: {
  item: Installment;
}) {
  const state = getInstallmentState(item);
  const Icon = state.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border",
        "px-2.5 py-1 text-[11px] font-medium",
        state.className,
      ].join(" ")}
    >
      <Icon
        className="h-3.5 w-3.5"
        strokeWidth={1.8}
      />

      {state.label}
    </span>
  );
}

function ProgressBar({
  paid,
  due,
}: {
  paid: number;
  due: number;
}) {
  const progress =
    due > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round((paid / due) * 100),
          ),
        )
      : 0;

  return (
    <div className="w-[138px]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10.5px] text-muted-foreground/65">
          Collected
        </span>

        <span className="text-[10.5px] font-medium text-foreground/70">
          {progress}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted/70">
        <div
          className="h-full rounded-full bg-primary/75 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function InstallmentsTable({
  installments,
  onSelect,
}: {
  installments: Installment[];
  onSelect: (item: Installment) => void;
}) {
  if (!installments.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-border/50 bg-muted/[0.10] px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-info/[0.08] text-info">
          <CalendarClock
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </span>

        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No installments found
        </h3>

        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-5 text-muted-foreground/75">
          No installments have been created for this
          student's financial account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/30 bg-card/90 shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="border-b border-border/25 bg-muted/[0.08]">
              <th className="h-11 px-5 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Installment
              </th>

              <th className="h-11 px-4 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Amount due
              </th>

              <th className="h-11 px-4 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Paid
              </th>

              <th className="h-11 px-4 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Remaining
              </th>

              <th className="h-11 px-4 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Progress
              </th>

              <th className="h-11 px-4 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Due date
              </th>

              <th className="h-11 px-5 text-left text-[10px] font-semibold uppercase tracking-[0.055em] text-muted-foreground/60">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {installments.map((item) => {
              const amountDue =
                Number(item.amountDue ?? 0);

              const amountPaid =
                Number(item.amountPaid ?? 0);

              const remaining = Math.max(
                0,
                amountDue - amountPaid,
              );

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      onSelect(item);
                    }
                  }}
                  className="cursor-pointer border-b border-border/20 transition-colors last:border-b-0 hover:bg-muted/[0.24]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.065] text-primary">
                        <Wallet
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      </span>

                      <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground/90">
                        {item.title}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign
                        className="h-3.5 w-3.5 text-muted-foreground/55"
                        strokeWidth={1.8}
                      />

                      <span className="text-[13px] font-semibold text-foreground/85">
                        {formatAmount(amountDue)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-success"
                        strokeWidth={1.8}
                      />

                      <span className="text-[13px] font-semibold text-success">
                        {formatAmount(amountPaid)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={[
                        "text-[13px] font-semibold",
                        remaining > 0
                          ? "text-foreground/85"
                          : "text-success",
                      ].join(" ")}
                    >
                      {formatAmount(remaining)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <ProgressBar
                      paid={amountPaid}
                      due={amountDue}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="h-3.5 w-3.5 text-muted-foreground/55"
                        strokeWidth={1.8}
                      />

                      <span className="whitespace-nowrap text-[12px] text-foreground/75">
                        {formatDate(item.dueDate)}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <InstallmentStatus item={item} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StudentInstallmentsSection({
  installments,
  isLoading = false,
  title = "Student Installments",
  description = "Track this student's installments, payments, and remaining balances.",
}: StudentInstallmentsSectionProps) {
  const [
    selectedInstallment,
    setSelectedInstallment,
  ] = useState<Installment | null>(null);

  if (isLoading) {
    return (
      <StudentFinanceSectionShell
        title={title}
        description={description}
        icon={CalendarDays}
      >
        <StudentFinanceTableSkeleton />
      </StudentFinanceSectionShell>
    );
  }

  return (
    <StudentFinanceSectionShell
      title={title}
      description={description}
      icon={CalendarDays}
    >
      <InstallmentsTable
        installments={installments}
        onSelect={setSelectedInstallment}
      />

      <Dialog
        open={selectedInstallment !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInstallment(null);
          }
        }}
      >
        <DialogContent className="w-[calc(100%-1rem)] rounded-[24px] border-border/35 bg-background/98 p-0 shadow-[0_20px_60px_rgba(31,22,73,0.10)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.32)] sm:max-w-[500px]">
          <DialogHeader className="border-b border-border/25 px-5 pb-4 pt-5 text-start sm:px-6">
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.02em]">
              {selectedInstallment?.title ??
                "Installment details"}
            </DialogTitle>

            <DialogDescription className="mt-1 text-[11.5px] leading-5 text-muted-foreground/75">
              Installment details and payment progress.
            </DialogDescription>
          </DialogHeader>

          {selectedInstallment && (
            <div className="grid gap-2.5 px-5 pb-5 pt-4 sm:grid-cols-2 sm:px-6">
              <div className="rounded-[14px] border border-border/30 bg-muted/[0.12] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Installment
                </p>

                <p className="mt-1 text-[13px] font-semibold">
                  {selectedInstallment.installmentNumber}
                </p>
              </div>

              <div className="rounded-[14px] border border-border/30 bg-muted/[0.12] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 text-[13px] font-semibold capitalize">
                  {selectedInstallment.status}
                </p>
              </div>

              <div className="rounded-[14px] border border-border/30 bg-muted/[0.12] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Amount due
                </p>

                <p className="mt-1 text-[13px] font-semibold">
                  {formatAmount(
                    selectedInstallment.amountDue,
                  )}
                </p>
              </div>

              <div className="rounded-[14px] border border-success/12 bg-success/[0.035] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Amount paid
                </p>

                <p className="mt-1 text-[13px] font-semibold text-success">
                  {formatAmount(
                    selectedInstallment.amountPaid,
                  )}
                </p>
              </div>

              <div className="rounded-[14px] border border-border/30 bg-muted/[0.12] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Remaining
                </p>

                <p className="mt-1 text-[13px] font-semibold">
                  {formatAmount(
                    Math.max(
                      0,
                      Number(
                        selectedInstallment.amountDue,
                      ) -
                        Number(
                          selectedInstallment.amountPaid,
                        ),
                    ),
                  )}
                </p>
              </div>

              <div className="rounded-[14px] border border-border/30 bg-muted/[0.12] p-3">
                <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                  Due date
                </p>

                <p className="mt-1 text-[13px] font-semibold">
                  {formatDate(
                    selectedInstallment.dueDate,
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StudentFinanceSectionShell>
  );
}