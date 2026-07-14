import { Wallet2, ReceiptText, ShieldCheck } from "lucide-react";

import { FinancialSummaryCards } from "../shared/FinancialSummaryCards";
import { FinancialDashboard } from "../pages/FinancialDashboard";

export function FinancialSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[24px] border border-border/70 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-sm font-medium text-violet-700">
              <Wallet2 className="h-4 w-4" />
              School Financial Configuration
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-foreground">
              Configure the financial foundation of your school.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Define tuition plans, installment structures, and optional services before student enrollment begins.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm">
              <ReceiptText className="h-4 w-4 text-violet-600" />
              Fee Plans
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              Policies
            </div>
          </div>
        </div>
      </div>

      <FinancialSummaryCards />
      <FinancialDashboard />
    </div>
  );
}
