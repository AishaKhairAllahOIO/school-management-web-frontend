import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  CalendarClock,
  CircleDollarSign,
  History,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { financeOperationsService } from "../../services/finance-operations.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentId: string | number | null;
};

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-[20px] bg-muted/60" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[74px] animate-pulse rounded-[16px] bg-muted/50" />
        ))}
      </div>
    </div>
  );
}

export function InstallmentDetailsDialog({
  open,
  onOpenChange,
  installmentId,
}: Props) {
  const {
    data: installment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["installment-details", installmentId],
    queryFn: () => financeOperationsService.getInstallmentDetails(installmentId!),
    enabled: Boolean(installmentId) && open,
  });

  const overdue = installment
    ? new Date() > new Date(installment.dueDate) && installment.status !== "paid"
    : false;
  const progress = installment?.amountDue
    ? Math.min(100, Math.round((installment.amountPaid / installment.amountDue) * 100))
    : 0;
  const remaining = installment
    ? Math.max(0, Number(installment.amountDue ?? 0) - Number(installment.amountPaid ?? 0))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[24px] border-border/55 p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b border-border/40 px-6 py-5 text-start">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-info/16 bg-info/[0.07] text-info">
              <CalendarClock className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div>
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground/92">
                Installment details
              </DialogTitle>
              <p className="mt-0.5 text-[12px] text-muted-foreground/75">
                Payment progress and scheduled due date.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {isLoading ? (
            <DetailSkeleton />
          ) : isError || !installment ? (
            <div className="rounded-[18px] border border-destructive/18 bg-destructive/[0.04] px-5 py-10 text-center">
              <p className="text-[14px] font-medium text-destructive">
                Unable to load installment details
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Please close the dialog and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-[20px] border border-info/14 bg-gradient-to-br from-info/[0.07] via-info/[0.03] to-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/75">
                      {installment.title}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-foreground/90">
                      {installment.amountDue?.toLocaleString()} $
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      Installment #{installment.installmentNumber}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      installment.status === "paid"
                        ? "border-success/18 bg-success/[0.085] text-success"
                        : overdue || installment.status === "overdue"
                          ? "border-destructive/18 bg-destructive/[0.075] text-destructive"
                          : "border-info/18 bg-info/[0.08] text-info",
                    ].join(" ")}
                  >
                    {installment.status === "paid"
                      ? "Paid"
                      : overdue || installment.status === "overdue"
                        ? "Overdue"
                        : "Pending"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground/72">
                    <span>Collection progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-info/10">
                    <div className="h-full rounded-full bg-info/75" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: BadgeCheck,
                    label: "Amount paid",
                    value: `${installment.amountPaid?.toLocaleString()} $`,
                    tone: "text-success",
                  },
                  {
                    icon: CircleDollarSign,
                    label: "Remaining",
                    value: `${remaining.toLocaleString()} $`,
                    tone: "text-primary",
                  },
                  {
                    icon: CalendarDays,
                    label: "Due date",
                    value: new Date(installment.dueDate).toLocaleDateString(),
                    tone: "text-foreground/85",
                  },
                  {
                    icon: History,
                    label: "Last updated",
                    value: installment.updatedAt
                      ? new Date(installment.updatedAt).toLocaleDateString()
                      : "—",
                    tone: "text-foreground/85",
                  },
                ].map(({ icon: Icon, label, value, tone }) => (
                  <div key={label} className="rounded-[16px] border border-border/45 bg-card px-4 py-3.5">
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span className="text-[10.5px] font-medium uppercase tracking-[0.05em]">{label}</span>
                    </div>
                    <p className={`mt-2 text-[13px] font-semibold ${tone}`}>{value}</p>
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
