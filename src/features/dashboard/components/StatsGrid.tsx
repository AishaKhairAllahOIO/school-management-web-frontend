import type { LucideIcon } from "lucide-react";
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
    card:
      "bg-violet-50/70 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/40",
    icon:
      "bg-violet-100 text-violet-600 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800/50",
    accent: "bg-violet-400 dark:bg-violet-500",
  },

  info: {
    card:
      "bg-sky-50/70 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/40",
    icon:
      "bg-sky-100 text-sky-600 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800/50",
    accent: "bg-sky-400 dark:bg-sky-500",
  },

  success: {
    card:
      "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40",
    icon:
      "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50",
    accent: "bg-emerald-400 dark:bg-emerald-500",
  },

  warning: {
    card:
      "bg-amber-50/70 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40",
    icon:
      "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/50",
    accent: "bg-amber-400 dark:bg-amber-500",
  },

  destructive: {
    card:
      "bg-rose-50/70 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40",
    icon:
      "bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/50",
    accent: "bg-rose-400 dark:bg-rose-500",
  },
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color];

        return (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border p-4",
              colors.card,
              "shadow-sm dark:shadow-black/10",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-md",
              "dark:hover:border-border/60 dark:hover:bg-muted/30",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                  {stat.value.toLocaleString()}
                </p>
              </div>

              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-lg border",
                  colors.icon,
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/80 dark:bg-white/10">
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

              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Overview
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}