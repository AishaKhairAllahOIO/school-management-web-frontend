import { CalendarDays, CircleDollarSign, UserPlus } from "lucide-react";

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
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr_0.8fr]">
        <DashboardSection title="Attendance Overview" className="min-h-[320px]">
          <div className="flex h-60 items-end gap-3">
            {attendanceChart.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="text-xs font-semibold text-foreground">
                  {item.value}%
                </div>
                <div className="flex h-40 w-full items-end rounded-full bg-primary/5">
                  <div
                    className="w-full rounded-full bg-primary/70"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Students by Grade">
          <div className="space-y-4">
            {gradeDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(item.value / 1248) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Fee Collection">
          <div className="flex h-full flex-col justify-center">
            <p className="text-4xl font-bold text-foreground">75%</p>
            <p className="mt-1 text-sm text-muted-foreground">Collection Rate</p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-bold text-success">$48,750</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Fees</span>
                <span className="font-bold text-foreground">$65,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-bold text-destructive">$16,250</span>
              </div>
            </div>
          </div>
        </DashboardSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <DashboardSection title="Recent Activities" action="View All">
          <div className="space-y-4">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserPlus size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </div>

                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Upcoming Events" action="View All">
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 rounded-2xl bg-background/70 p-3">
                <div className="w-12 rounded-2xl border border-border/70 bg-card text-center">
                  <div className="rounded-t-2xl bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                    {event.month}
                  </div>
                  <div className="py-1 text-lg font-bold text-foreground">{event.day}</div>
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">{event.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{event.dateTime}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="System Insights">
          <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
            <CircleDollarSign size={34} />
            <h3 className="mt-4 text-lg font-bold">School performance is strong</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Attendance remains above 90% and fee collection reached 75%.
            </p>

            <button className="mt-5 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-primary">
              View Full Report
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-background p-3 text-xs font-bold text-foreground ring-1 ring-border/60">
              <CalendarDays className="mx-auto mb-2 text-primary" size={20} />
              Reports
            </button>

            <button className="rounded-2xl bg-background p-3 text-xs font-bold text-foreground ring-1 ring-border/60">
              <CircleDollarSign className="mx-auto mb-2 text-primary" size={20} />
              Finance
            </button>
          </div>
        </DashboardSection>
      </section>
    </div>
  );
}