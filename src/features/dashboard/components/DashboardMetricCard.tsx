import {
  AlertTriangle,
  BookOpen,
  CircleDollarSign,
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
  wallet: Wallet,
  revenue: CircleDollarSign,
};

export function DashboardMetricCard({
  metric,
}: {
  metric: DashboardMetric;
}) {
  const Icon =
    icons[metric.icon as keyof typeof icons];

  return (
    <article className="rounded-[22px] border border-border/45 bg-card p-4 shadow-[0_10px_30px_rgba(30,20,70,0.035)] transition duration-200 hover:border-border/65 hover:shadow-[0_14px_34px_rgba(30,20,70,0.05)]">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-muted-foreground">
            {metric.label}
          </p>

          <h3 className="mt-1 text-[25px] font-semibold leading-none tracking-[-0.035em] text-foreground">
            {metric.value}
          </h3>

          <p className="mt-2 text-[10px] text-muted-foreground">
            <span className="font-medium text-success">
              {metric.change}
            </span>{" "}
            from last month
          </p>
        </div>
      </div>
    </article>
  );
}
