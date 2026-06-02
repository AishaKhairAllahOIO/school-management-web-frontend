import { FileText, Phone, UserPlus, Wallet } from "lucide-react";

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

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardSection title="Registration Requests" action="View All">
          <div className="space-y-3">
            {["Sara Ahmed", "Omar Khaled", "Lina Mansour"].map((name, index) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl bg-background/70 p-4"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {index === 0 ? "Seventh Grade" : index === 1 ? "Eighth Grade" : "Ninth Grade"}
                  </p>
                </div>

                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-primary/10 p-4 text-xs font-bold text-primary">
              <UserPlus className="mx-auto mb-2" size={22} />
              Add Student
            </button>

            <button className="rounded-2xl bg-success/10 p-4 text-xs font-bold text-success">
              <Wallet className="mx-auto mb-2" size={22} />
              Add Payment
            </button>

            <button className="rounded-2xl bg-info/10 p-4 text-xs font-bold text-info">
              <Phone className="mx-auto mb-2" size={22} />
              Parent Call
            </button>

            <button className="rounded-2xl bg-warning/10 p-4 text-xs font-bold text-warning">
              <FileText className="mx-auto mb-2" size={22} />
              Documents
            </button>
          </div>
        </DashboardSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DashboardSection title="Today Activities">
          <div className="space-y-4">
            {secretaryActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText size={17} />
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

        <DashboardSection title="Appointments">
          <div className="space-y-3">
            {upcomingEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="rounded-2xl bg-background/70 p-4">
                <p className="text-sm font-bold text-foreground">{event.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{event.dateTime}</p>
              </div>
            ))}
          </div>
        </DashboardSection>
      </section>
    </div>
  );
}