import { useMemo } from "react";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useFinanceInstallments } from "../hooks/useInstallments";
import type { Installment } from "../types/finance.types";
import { FinanceSectionShell } from "./FinanceSectionShell";
import { FinanceTableSkeleton } from "./FinanceTableSkeleton";

type InstallmentsSectionProps = {
  studentId?: string | number;
  installments?: Installment[];
  title?: string;
  description?: string;
};

function formatAmount(value: number | undefined | null) {
  return `${Number(value ?? 0).toLocaleString()} $`;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInstallmentState(item: Installment) {
  const overdue = item.dueDate
    ? new Date() > new Date(item.dueDate) && item.status !== "paid"
    : false;

  if (item.status === "paid") {
    return {
      label: "Paid",
      className: "border-success/18 bg-success/[0.075] text-success",
      icon: CheckCircle2,
    };
  }

  if (overdue || item.status === "overdue") {
    return {
      label: "Overdue",
      className: "border-destructive/18 bg-destructive/[0.06] text-destructive",
      icon: Clock3,
    };
  }

  return {
    label: "Pending",
    className: "border-info/18 bg-info/[0.07] text-info",
    icon: CalendarClock,
  };
}

function InstallmentStatus({ item }: { item: Installment }) {
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
      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      {state.label}
    </span>
  );
}

function ProgressBar({ paid, due }: { paid: number; due: number }) {
  const progress =
    due > 0 ? Math.min(100, Math.max(0, Math.round((paid / due) * 100))) : 0;

  return (
    <div className="w-[130px]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10.5px] text-muted-foreground/65">
          Collected
        </span>

        <span className="text-[10.5px] font-medium text-foreground/70">
          {progress}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-primary/75 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function InstallmentsTable({ installments }: { installments: Installment[] }) {
  if (!installments.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/55 bg-card px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-info/[0.08] text-info">
          <CalendarClock className="h-5 w-5" strokeWidth={1.8} />
        </span>

        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No installments found
        </h3>

        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-5 text-muted-foreground/75">
          Installments will appear here once the student's financial contract
          has been finalized.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/[0.22]">
              <th className="h-12 px-5 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Installment
              </th>

              <th className="h-12 px-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Amount due
              </th>

              <th className="h-12 px-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Paid
              </th>

              <th className="h-12 px-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Remaining
              </th>

              <th className="h-12 px-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Progress
              </th>

              <th className="h-12 px-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Due date
              </th>

              <th className="h-12 px-5 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {installments.map((item) => {
              const amountDue = Number(item.amountDue ?? 0);
              const amountPaid = Number(item.amountPaid ?? 0);

              const remaining = Math.max(0, amountDue - amountPaid);

              return (
                <tr
                  key={item.id}
                  className={[
                    "border-b border-border/30",
                    "transition-colors last:border-b-0",
                    "hover:bg-primary/[0.018]",
                  ].join(" ")}
                >
                  {/* INSTALLMENT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.07] text-primary">
                        <Wallet className="h-4 w-4" strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-foreground/88">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[10.5px] text-muted-foreground/60">
                          Installment #{item.installmentNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* AMOUNT DUE */}
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

                  {/* PAID */}
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

                  {/* REMAINING */}
                  <td className="px-4 py-4">
                    <span
                      className={[
                        "text-[13px] font-semibold",
                        remaining > 0 ? "text-foreground/85" : "text-success",
                      ].join(" ")}
                    >
                      {formatAmount(remaining)}
                    </span>
                  </td>

                  {/* PROGRESS */}
                  <td className="px-4 py-4">
                    <ProgressBar paid={amountPaid} due={amountDue} />
                  </td>

                  {/* DUE DATE */}
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

                  {/* STATUS */}
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

export function InstallmentsSection({
  installments: providedInstallments,
  title = "Installment Schedule",
  description = "Track what is due, what has been paid, and what remains.",
}: InstallmentsSectionProps = {}) {
  const {
    data: queriedInstallments = [],
    isLoading,
    isError,
    refetch,
  } = useFinanceInstallments();

  const installments = useMemo(() => {
    if (!providedInstallments?.length) {
      return queriedInstallments;
    }

    // The account response already gives us the exact installment ids for this
    // student. API #5 is still the source used by this table; we narrow its
    // global result to those ids so another student's installments can never
    // leak into the profile.
    const accountInstallmentIds = new Set(
      providedInstallments.map((item) => String(item.id)),
    );

    const matched = queriedInstallments.filter((item) =>
      accountInstallmentIds.has(String(item.id)),
    );

    return matched.length || queriedInstallments.length === 0
      ? matched
      : providedInstallments;
  }, [providedInstallments, queriedInstallments]);

  if (isLoading && !providedInstallments?.length) {
    return <FinanceTableSkeleton />;
  }

  if (isError && !providedInstallments?.length) {
    return (
      <FinanceSectionShell
        title={title}
        description={description}
        icon={CalendarDays}
      >
        <div className="rounded-[18px] border border-destructive/15 bg-destructive/[0.035] px-5 py-8 text-center">
          <p className="text-[12px] font-semibold text-destructive">
            Installments could not be loaded.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 h-9 rounded-xl px-3 text-[11px]"
            onClick={() => void refetch()}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      </FinanceSectionShell>
    );
  }

  return (
    <FinanceSectionShell
      title={title}
      description={description}
      icon={CalendarDays}
    >
      <InstallmentsTable installments={installments} />
    </FinanceSectionShell>
  );
}
