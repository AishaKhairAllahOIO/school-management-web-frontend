import type { ReportMetric, ReportTone } from "../types/reports.types";

const toneClasses: Record<ReportTone, { icon: string; change: string; glow: string }> = {
  primary: {
    icon: "bg-primary/[0.09] text-primary",
    change: "bg-primary/[0.07] text-primary",
    glow: "bg-primary/10",
  },
  info: {
    icon: "bg-info/[0.10] text-info",
    change: "bg-info/[0.08] text-info",
    glow: "bg-info/10",
  },
  success: {
    icon: "bg-success/[0.10] text-success",
    change: "bg-success/[0.08] text-success",
    glow: "bg-success/10",
  },
  warning: {
    icon: "bg-warning/[0.11] text-warning",
    change: "bg-warning/[0.09] text-warning",
    glow: "bg-warning/10",
  },
  destructive: {
    icon: "bg-destructive/[0.09] text-destructive",
    change: "bg-destructive/[0.07] text-destructive",
    glow: "bg-destructive/10",
  },
  secondary: {
    icon: "bg-secondary text-secondary-foreground",
    change: "bg-secondary text-secondary-foreground",
    glow: "bg-secondary-foreground/8",
  },
};

export function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  const Icon = metric.icon;
  const tone = toneClasses[metric.tone];

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[20px] border border-border/60 bg-card px-4 py-4 shadow-[0_8px_26px_rgba(30,20,70,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_14px_34px_rgba(30,20,70,0.07)]">
      <span aria-hidden className={`absolute -end-8 -top-8 h-24 w-24 rounded-full blur-3xl ${tone.glow}`} />

      <div className="relative flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${tone.icon}`}>
          <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>

        {metric.change ? (
          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tone.change}`}>
            {metric.change}
          </span>
        ) : null}
      </div>

      <div className="relative mt-4">
        <strong className="block text-[24px] font-semibold leading-none tracking-[-0.04em] text-foreground">
          {metric.value}
        </strong>
        <p className="mt-2 text-[12px] font-medium text-foreground/90">{metric.title}</p>
        <p className="mt-1 line-clamp-1 text-[10.5px] text-muted-foreground">{metric.description}</p>
      </div>
    </article>
  );
}
