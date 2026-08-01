import {
  CalendarDays,
  FileText,
  Phone,
  UserPlus,
  Wallet,
} from "lucide-react";

import { DashboardMetricCard } from "@/features/dashboard/components/DashboardMetricCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import {
  secretaryActivities,
  secretaryMetrics,
  upcomingEvents,
} from "@/features/dashboard/data/dashboard.mock";

export function SecretaryDashboard() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {secretaryMetrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardSection title="Administrative Activity" description="Recent secretary operations">
          <div className="space-y-3">
            {secretaryActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-[16px] border border-border/40 bg-muted/[0.08] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
                  <FileText size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{item.description}</p>
                </div>
                <span className="text-[9px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Quick Actions" description="Common daily tasks">
          <div className="grid grid-cols-2 gap-3">
            {[
              [UserPlus, "Register Student"],
              [Phone, "Schedule Call"],
              [Wallet, "Review Payment"],
              [CalendarDays, "Open Calendar"],
            ].map(([Icon, label]) => {
              const ActionIcon = Icon as typeof UserPlus;
              return (
                <button key={label as string} type="button" className="rounded-[16px] border border-border/50 bg-muted/[0.08] p-4 text-[10px] font-medium text-foreground transition hover:border-primary/20 hover:bg-primary/[0.035]">
                  <ActionIcon className="mx-auto mb-2 text-primary" size={19} />
                  {label as string}
                </button>
              );
            })}
          </div>
        </DashboardSection>
      </section>

      <DashboardSection title="Upcoming Events" action="View All">
        <div className="grid gap-3 md:grid-cols-3">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="flex items-center gap-3 rounded-[16px] border border-border/45 bg-muted/[0.08] p-3">
              <div className="w-11 shrink-0 overflow-hidden rounded-[12px] border border-border/60 bg-card text-center">
                <div className="bg-primary px-2 py-1 text-[8px] font-medium text-primary-foreground">{event.month}</div>
                <div className="py-1 text-[15px] font-semibold text-foreground">{event.day}</div>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-foreground">{event.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{event.dateTime}</p>
              </div>
            </article>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
