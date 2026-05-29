import { Sparkles } from "lucide-react";

import { dashboardInsight } from "@/features/dashboard/data/dashboard.mock";

export function DashboardInsight() {
  return (
    <section className="soft-card flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={24} />
        </div>

        <div>
          <h2 className="text-base font-bold text-foreground">
            {dashboardInsight.title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {dashboardInsight.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
      >
        {dashboardInsight.actionLabel}
      </button>
    </section>
  );
}