import {
  AlertTriangle,
  BookOpen,
  FileText,
  GraduationCap,
  Phone,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

import type { DashboardMetric } from "@/features/dashboard/types/dashboard.types";

const icons = {
  students: Users,
  teachers: GraduationCap,
  classes: BookOpen,
  fees: Wallet,
  attendance: UserCheck,
  documents: FileText,
  calls: Phone,
  cases: ShieldCheck,
  warnings: AlertTriangle,
  meetings: Users,
};

export function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = icons[metric.icon];

  return (
    <article className="soft-card rounded-3xl p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={24} strokeWidth={1.9} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">
            {metric.label}
          </p>

          <h3 className="mt-1 text-[2rem] font-bold leading-none tracking-[-0.04em] text-foreground">
            {metric.value}
          </h3>

          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-success">{metric.change}</span>{" "}
            from last month
          </p>
        </div>
      </div>
    </article>
  );
}