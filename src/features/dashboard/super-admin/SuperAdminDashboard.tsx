import {
  CalendarDays,
  CircleDollarSign,
  UserPlus,
} from "lucide-react";

import { DashboardMetricCard } from "@/features/dashboard/components/DashboardMetricCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import {
  attendanceChart,
  gradeDistribution,
  recentActivities,
  superAdminMetrics,
  upcomingEvents,
} from "@/features/dashboard/data/dashboard.mock";

export function SuperAdminDashboard() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {superAdminMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.id}
            metric={metric}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr_0.8fr]">
        <DashboardSection
          title="Attendance Overview"
          description="Weekly attendance rate"
          className="min-h-[300px]"
        >
          <div className="flex h-56 items-end gap-3">
            {attendanceChart.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="text-[10px] font-medium text-foreground">
                  {item.value}%
                </div>

                <div className="flex h-36 w-full items-end rounded-full bg-primary/[0.055]">
                  <div
                    className="w-full rounded-full bg-primary/65"
                    style={{
                      height: `${item.value}%`,
                    }}
                  />
                </div>

                <div className="text-[10px] text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Students by Grade"
          description="Current distribution"
        >
          <div className="space-y-4">
            {gradeDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted/70">
                  <div
                    className="h-2 rounded-full bg-primary/80"
                    style={{
                      width: `${(item.value / 1248) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Fee Collection"
          description="Annual collection progress"
        >
          <div className="flex h-full flex-col justify-center">
            <p className="text-[34px] font-semibold tracking-[-0.04em] text-foreground">
              75%
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Collection rate
            </p>

            <div className="mt-5 space-y-3 text-[11px]">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-medium text-success">$48,750</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Total Fees</span>
                <span className="font-medium text-foreground">$65,000</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium text-destructive">$16,250</span>
              </div>
            </div>
          </div>
        </DashboardSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <DashboardSection
          title="Recent Activities"
          action="View All"
        >
          <div className="space-y-3">
            {recentActivities.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[16px] border border-border/40 bg-muted/[0.08] p-3"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
                  <UserPlus size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 text-[9px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Upcoming Events"
          action="View All"
        >
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-[16px] border border-border/40 bg-muted/[0.08] p-3"
              >
                <div className="w-11 shrink-0 overflow-hidden rounded-[12px] border border-border/60 bg-card text-center">
                  <div className="bg-primary px-2 py-1 text-[8px] font-medium text-primary-foreground">{event.month}</div>
                  <div className="py-1 text-[15px] font-semibold text-foreground">{event.day}</div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-foreground">{event.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{event.dateTime}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="System Insights">
          <div className="rounded-[20px] bg-primary p-5 text-primary-foreground">
            <CircleDollarSign size={28} strokeWidth={1.7} />
            <h3 className="mt-4 text-[15px] font-semibold">School performance is strong</h3>
            <p className="mt-2 text-[11px] leading-5 text-primary-foreground/80">Attendance remains above 90% and fee collection reached 75%.</p>
            <button type="button" className="mt-5 rounded-full bg-white px-4 py-2 text-[10px] font-medium text-primary">View Full Report</button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              [CalendarDays, "Reports"],
              [CircleDollarSign, "Finance"],
            ].map(([Icon, label]) => {
              const ActionIcon = Icon as typeof CalendarDays;
              return (
                <button key={label as string} type="button" className="rounded-[16px] border border-border/50 bg-background p-3 text-[10px] font-medium text-foreground transition hover:bg-muted/40">
                  <ActionIcon className="mx-auto mb-2 text-primary" size={18} />
                  {label as string}
                </button>
              );
            })}
          </div>
        </DashboardSection>
      </section>
    </div>
  );
}
