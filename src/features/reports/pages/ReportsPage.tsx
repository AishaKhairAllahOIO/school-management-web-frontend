import { BarChart3, CalendarCheck, FileText, ListChecks, PieChart, TrendingUp, Users, Wallet } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { RecentReportsList } from "../components/RecentReportsList";
import { ReportCard } from "../components/ReportCard";
import { ReportMetricCard } from "../components/ReportMetricCard";
import { ReportAnalyticsCard } from "../components/ReportAnalyticsCard";
import { useReports } from "../hooks/useReports";

export function ReportsPage() {
  const { data, isLoading } = useReports();

  const analyticsMetrics = [
    {
      title: "Payment Delay Rate",
      value: "18%",
      description: "Students with overdue fees and pending collection.",
      icon: Wallet,
      color: "text-warning bg-warning/10",
    },
    {
      title: "Attendance Alert",
      value: "12%",
      description: "Students approaching absence thresholds.",
      icon: CalendarCheck,
      color: "text-info bg-info/10",
    },
    {
      title: "Behavioral Incidents",
      value: "24",
      description: "Open evaluations and disciplinary actions.",
      icon: ListChecks,
      color: "text-destructive bg-destructive/10",
    },
    {
      title: "Academic Risk",
      value: "8%",
      description: "Students needing intervention based on grades.",
      icon: TrendingUp,
      color: "text-success bg-success/10",
    },
    {
      title: "Salary Compliance",
      value: "100%",
      description: "Payroll processed for active staff this month.",
      icon: Users,
      color: "text-primary bg-primary/10",
    },
  ];

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="mt-3 text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="soft-card rounded-3xl p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">
              Reports
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage system reports across attendance, academics, finance, and student
              engagement from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-2xl" size="lg">
              New Report
            </Button>
            <Button variant="outline" className="rounded-2xl" size="lg">
              Schedule Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {analyticsMetrics.map((metric) => (
              <ReportAnalyticsCard key={metric.title} metric={metric} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <ReportMetricCard key={metric.title} metric={metric} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {data.reportCards.map((report) => (
              <ReportCard key={report.title} report={report} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <RecentReportsList reports={data.recentReports} />

          <Card className="rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Report workflow</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Automate report generation and keep stakeholders aligned.
                </p>
              </div>
              <BarChart3 className="text-primary" size={24} />
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Monthly schedule</p>
                <p className="mt-1 text-lg font-semibold text-foreground">Every 1st of month</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Next delivery</p>
                <p className="mt-1 text-lg font-semibold text-foreground">Apr 1, 2026</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
