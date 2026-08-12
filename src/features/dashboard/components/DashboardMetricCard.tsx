
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
  wallet: Wallet,
  revenue: CircleDollarSign,
};

const tones = [
  "bg-sky-50 text-sky-600 dark:bg-sky-500/10",
  "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
];

export function DashboardMetricCard({
  metric,
}: {
  metric: DashboardMetric;
}) {
  const Icon = icons[metric.icon as keyof typeof icons];

  const tone =
    tones[
      Math.abs(
        metric.id
          .split("")
          .reduce((a, c) => a + c.charCodeAt(0), 0),
      ) % tones.length
    ];

  return (
    <article className="group rounded-[26px] border border-border/50 bg-card p-5 shadow-[0_12px_35px_rgba(40,25,90,0.05)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${tone}`}>
          <Icon size={21} strokeWidth={1.8} />
        </div>

        <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
          {metric.change}
        </span>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {metric.label}
      </p>

      <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-foreground">
        {metric.value}
      </h3>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-3/4 rounded-full bg-primary/60 transition-all group-hover:w-5/6" />
      </div>
    </article>
  );
}
// في نهاية الملف، أضف هذا السطر:
export default DashboardMetricCard;