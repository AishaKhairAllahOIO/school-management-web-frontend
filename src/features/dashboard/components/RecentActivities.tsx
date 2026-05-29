import { CalendarDays, DollarSign, UserPlus, UserRound } from "lucide-react";

import { recentActivities } from "@/features/dashboard/data/dashboard.mock";
import type { RecentActivity } from "@/features/dashboard/types/dashboard.types";

const activityIcons = {
  student: UserPlus,
  payment: DollarSign,
  schedule: CalendarDays,
  teacher: UserRound,
};

const activityClasses: Record<RecentActivity["type"], string> = {
  student: "bg-primary/10 text-primary",
  payment: "bg-success/10 text-success",
  schedule: "bg-warning/10 text-warning",
  teacher: "bg-info/10 text-info",
};

export function RecentActivities() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Recent Activities</h2>

        <button
          type="button"
          className="rounded-2xl border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          View all
        </button>
      </div>

      <div className="space-y-5">
        {recentActivities.map((activity) => {
          const Icon = activityIcons[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${activityClasses[activity.type]}`}>
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-foreground">
                    {activity.title}
                  </h3>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}