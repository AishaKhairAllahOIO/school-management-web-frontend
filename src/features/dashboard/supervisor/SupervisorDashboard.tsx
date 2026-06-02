import { AlertTriangle, CalendarDays, FileText, ShieldCheck } from "lucide-react";

import { DashboardMetricCard } from "@/features/dashboard/components/DashboardMetricCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import {
  supervisorActivities,
  supervisorMetrics,
} from "@/features/dashboard/data/dashboard.mock";

export function SupervisorDashboard() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {supervisorMetrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardSection title="Students Requiring Follow-up">
          <div className="space-y-3">
            {[
              ["Ahmed Nasser", "Repeated Absence", "High"],
              ["Lina Saleh", "Academic Risk", "Medium"],
              ["Omar Sami", "Behavior Report", "High"],
            ].map(([name, issue, priority]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl bg-background/70 p-4">
                <div>
                  <p className="text-sm font-bold text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{issue}</p>
                </div>

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-bold",
                    priority === "High"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning",
                  ].join(" ")}
                >
                  {priority}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-primary/10 p-4 text-xs font-bold text-primary">
              <ShieldCheck className="mx-auto mb-2" size={22} />
              Open Case
            </button>

            <button className="rounded-2xl bg-warning/10 p-4 text-xs font-bold text-warning">
              <AlertTriangle className="mx-auto mb-2" size={22} />
              Add Report
            </button>

            <button className="rounded-2xl bg-info/10 p-4 text-xs font-bold text-info">
              <CalendarDays className="mx-auto mb-2" size={22} />
              Schedule
            </button>

            <button className="rounded-2xl bg-success/10 p-4 text-xs font-bold text-success">
              <FileText className="mx-auto mb-2" size={22} />
              Add Note
            </button>
          </div>
        </DashboardSection>
      </section>

      <DashboardSection title="Supervisor Activity">
        <div className="space-y-4">
          {supervisorActivities.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <AlertTriangle size={17} />
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
    </div>
  );
}