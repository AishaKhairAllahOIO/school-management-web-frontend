import { ArrowRight, CreditCard, FileText } from "lucide-react";
import type { StaffSummary } from "../types/payroll.types";

type Props = {
  staff: StaffSummary;
  hasContract?: boolean;
  onViewContract: () => void;
  onViewPayments: () => void;
};

export function StaffPayrollRow({ staff, hasContract, onViewContract, onViewPayments }: Props) {
  const name =
    staff.user?.name ??
    staff.name ??
    staff.full_name ??
    ([staff.first_name, staff.last_name].filter(Boolean).join(" ") ||
      `Staff #${staff.id}`);

  return (
    <article className="group border-b border-border/50 px-4 py-4 transition-colors hover:bg-primary/[0.025] last:border-0">
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-sm font-semibold text-primary">
          {name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Staff #{staff.id}</p>
        </div>
        <div className="hidden sm:block">
          <span className={hasContract ? "inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success" : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"}>
            {hasContract ? "Contract active" : "No contract"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onViewContract} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <FileText className="size-4" />
            <span className="hidden md:inline">Contract</span>
          </button>
          <button type="button" onClick={onViewPayments} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/8">
            <CreditCard className="size-4" />
            <span className="hidden md:inline">Payments</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
