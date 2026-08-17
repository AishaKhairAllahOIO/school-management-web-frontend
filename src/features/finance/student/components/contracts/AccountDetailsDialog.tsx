import {
  CalendarClock,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  WalletCards,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { useStudentFinancialAccount } from "../../hooks/useFinancialAccounts";

import type { FinancialAccount } from "../../types/finance.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string | number | null;
};

function AccountSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 animate-pulse rounded-[18px] bg-muted/60" />
        <div className="h-28 animate-pulse rounded-[18px] bg-muted/55" />
      </div>
      <div className="space-y-2 rounded-[18px] border border-border/40 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-[12px] bg-muted/45"
          />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status?: FinancialAccount["paymentStatus"];
}) {
  const classes =
    status === "fully_paid"
      ? "border-success/18 bg-success/[0.085] text-success"
      : status === "partially_paid"
        ? "border-warning/18 bg-warning/[0.085] text-warning"
        : "border-destructive/18 bg-destructive/[0.075] text-destructive";
  const label =
    status === "partially_paid"
      ? "Partially paid"
      : status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

export function AccountDetailsDialog({ open, onOpenChange, studentId }: Props) {
  const {
    data: account,
    isLoading,
    isError,
  } = useStudentFinancialAccount(studentId ?? undefined);

  const paid = account
    ? Math.max(
        0,
        Number(account.totalRequiredAmount ?? 0) -
          Number(account.remainingBalance ?? 0),
      )
    : 0;
  const progress = account?.totalRequiredAmount
    ? Math.min(100, Math.round((paid / account.totalRequiredAmount) * 100))
    : 0;

  const details = account
    ? [
        {
          icon: GraduationCap,
          label: "Fee plan",
          value: account.feePlan?.name || "Not assigned",
        },
        {
          icon: CalendarClock,
          label: "Installment policy",
          value: account.installmentPolicy?.name || "Not assigned",
        },
        {
          icon: FileCheck2,
          label: "Installments",
          value: `${account.installmentPolicy?.installmentsCount ?? 0} scheduled`,
        },
        {
          icon: WalletCards,
          label: "Academic year ID",
          value: account.academicYearId || "—",
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.14)] backdrop-blur-xl sm:max-w-[620px]">
        <DialogHeader className="border-b border-border/30 bg-background/70 px-6 py-5 text-start">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-primary/16 bg-primary/[0.07] text-primary">
              <WalletCards className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div>
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground/92">
                Financial account profile
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[12px] font-normal text-muted-foreground/75">
                Contract value, payment progress and scheduling details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {isLoading ? (
            <AccountSkeleton />
          ) : isError || !account ? (
            <div className="rounded-[18px] border border-destructive/18 bg-destructive/[0.04] px-5 py-10 text-center">
              <p className="text-[14px] font-medium text-destructive">
                Failed to load account details
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Please close the dialog and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[21px] border border-border/40 bg-card/80 p-5 shadow-[0_8px_24px_rgba(31,22,73,0.03)]">
                  <div className="flex items-center gap-2 text-muted-foreground/75">
                    <CircleDollarSign className="h-4 w-4" strokeWidth={1.8} />
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em]">
                      Contract total
                    </span>
                  </div>
                  <p className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-foreground/90">
                    {account.totalRequiredAmount?.toLocaleString()} $
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    Original required amount
                  </p>
                </div>

                <div className="rounded-[21px] border border-primary/14 bg-primary/[0.045] p-5 shadow-[0_8px_24px_rgba(99,78,181,0.045)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-primary/75">
                      Remaining balance
                    </span>
                    <StatusBadge status={account.paymentStatus} />
                  </div>
                  <p className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-primary">
                    {account.remainingBalance?.toLocaleString()} $
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary/75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-primary/65">
                    {progress}% collected
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-[17px] border border-border/40 bg-card/75 px-4 py-3.5 transition-colors hover:bg-muted/[0.16]"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span className="text-[10.5px] font-medium uppercase tracking-[0.05em]">
                        {label}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-[12.5px] font-medium text-foreground/84">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
