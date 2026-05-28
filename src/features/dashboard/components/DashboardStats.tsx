import {
  BookOpen,
  GraduationCap,
  MoreVertical,
  Users,
  Wallet,
} from "lucide-react";

import { dashboardStats } from "@/features/dashboard/data/dashboard.mock";
import type { DashboardStat } from "@/features/dashboard/types/dashboard.types";

const statIcons = {
  students: Users,
  teachers: GraduationCap,
  classes: BookOpen,
  revenue: Wallet,
};

const statIconClasses: Record<DashboardStat["icon"], string> = {
  students: "bg-primary/15 text-primary",
  teachers: "bg-info/15 text-info",
  classes: "bg-success/15 text-success",
  revenue: "bg-warning/15 text-warning",
};

export function DashboardStats() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = statIcons[stat.icon];

        return (
          <article key={stat.id} className="soft-card rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statIconClasses[stat.icon]}`}
                >
                  <Icon size={24} strokeWidth={1.9} />
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <h3 className="mt-1 text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-foreground">
                    {stat.value}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-success">
                      {stat.growth}
                    </span>{" "}
                    vs last month
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <MoreVertical size={17} />
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}