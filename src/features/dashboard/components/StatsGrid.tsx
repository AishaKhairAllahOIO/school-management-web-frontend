import {
  GraduationCap,
  UsersRound,
  BriefcaseBusiness,
  School,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: "primary" | "info" | "success" | "warning" | "destructive";
}

interface StatsGridProps {
  stats: StatItem[];
}

const colorMap = {
  primary: {
    card: "bg-violet-50/70 border-violet-100",
    icon: "bg-violet-100 text-violet-600 border-violet-200",
    accent: "bg-violet-400",
  },

  info: {
    card: "bg-sky-50/70 border-sky-100",
    icon: "bg-sky-100 text-sky-600 border-sky-200",
    accent: "bg-sky-400",
  },

  success: {
    card: "bg-emerald-50/70 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600 border-emerald-200",
    accent: "bg-emerald-400",
  },

  warning: {
    card: "bg-amber-50/70 border-amber-100",
    icon: "bg-amber-100 text-amber-600 border-amber-200",
    accent: "bg-amber-400",
  },

  destructive: {
    card: "bg-rose-50/70 border-rose-100",
    icon: "bg-rose-100 text-rose-600 border-rose-200",
    accent: "bg-rose-400",
  },
};

export const dashboardIcons = {
  students: GraduationCap,
  teachers: UsersRound,
  staff: BriefcaseBusiness,
  classes: School,
  attendance: ClipboardList,
  warning: AlertTriangle,
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color];

        return (
          <div
            key={stat.label}
            className={cn(
              "rounded-2xl border p-5",
              colors.card,
              "shadow-sm",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
                  {stat.value.toLocaleString()}
                </p>
              </div>

              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center",
                  "rounded-xl border",
                  colors.icon,
                )}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={1.8}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/80">
                <div
                  className={cn(
                    "h-full rounded-full",
                    colors.accent,
                  )}
                  style={{
                    width: `${Math.min(stat.value / 10, 100)}%`,
                  }}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                Overview
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}