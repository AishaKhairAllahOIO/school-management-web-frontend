import type {
  ReportMetric,
  ReportTone,
} from "../types/reports.types";

const toneClasses: Record<
  ReportTone,
  {
    icon: string;
    change: string;
  }
> = {
  primary: {
    icon: "bg-primary/[0.08] text-primary",
    change: "text-primary",
  },

  info: {
    icon: "bg-info/[0.09] text-info",
    change: "text-info",
  },

  success: {
    icon: "bg-success/[0.09] text-success",
    change: "text-success",
  },

  warning: {
    icon: "bg-warning/[0.10] text-warning",
    change: "text-warning",
  },

  destructive: {
    icon: "bg-destructive/[0.08] text-destructive",
    change: "text-destructive",
  },

  secondary: {
    icon: "bg-secondary text-secondary-foreground",
    change: "text-secondary-foreground",
  },
};

export function ReportMetricCard({
  metric,
}: {
  metric: ReportMetric;
}) {
  const Icon = metric.icon;

  const tone = toneClasses[metric.tone];

  return (
    <article className="flex min-w-0 items-center gap-3 border-e border-border/45 px-4 py-3 last:border-e-0">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${tone.icon}`}
      >
        <Icon
          aria-hidden="true"
          size={17}
          strokeWidth={1.8}
        />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <strong className="truncate text-[18px] font-semibold leading-none tracking-[-0.035em] text-foreground">
            {metric.value}
          </strong>

          {metric.change && (
            <span
              className={`shrink-0 text-[9.5px] font-semibold ${tone.change}`}
            >
              {metric.change}
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-[11px] font-medium text-foreground/90">
          {metric.title}
        </p>
      </div>
    </article>
  );
}