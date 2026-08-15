import type { ReactNode } from "react";

export type PageHeaderColor =
  | "violet"
  | "cyan"
  | "emerald"
  | "sky"
  | "amber";

interface PageHeaderMetric {
  label: string;
  value: string | number;
  color?: PageHeaderColor;
}

interface PageHeaderProps {
  title: string;
  academicYear: string;
  semester: string;

  icon: ReactNode;

  color?: PageHeaderColor;

  metrics?: PageHeaderMetric[];

  action?: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
}

const colorStyles: Record<
  PageHeaderColor,
  {
    icon: string;
    metric: string;
    metricText: string;
    button: string;
  }
> = {
  violet: {
    icon: "bg-violet-50 text-violet-700",
    metric: "border-violet-200/60 bg-violet-50/70",
    metricText: "text-violet-700",
    button:
      "bg-violet-600 text-white hover:bg-violet-700 shadow-[0_6px_16px_rgba(124,58,237,0.14)]",
  },

  cyan: {
    icon: "bg-cyan-50 text-cyan-700",
    metric: "border-cyan-200/60 bg-cyan-50/70",
    metricText: "text-cyan-700",
    button:
      "bg-cyan-600 text-white hover:bg-cyan-700 shadow-[0_6px_16px_rgba(8,145,178,0.14)]",
  },

  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    metric: "border-emerald-200/60 bg-emerald-50/70",
    metricText: "text-emerald-700",
    button:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_6px_16px_rgba(5,150,105,0.14)]",
  },

  sky: {
    icon: "bg-sky-50 text-sky-700",
    metric: "border-sky-200/60 bg-sky-50/70",
    metricText: "text-sky-700",
    button:
      "bg-sky-600 text-white hover:bg-sky-700 shadow-[0_6px_16px_rgba(2,132,199,0.14)]",
  },

  amber: {
    icon: "bg-amber-50 text-amber-700",
    metric: "border-amber-200/60 bg-amber-50/70",
    metricText: "text-amber-700",
    button:
      "bg-amber-600 text-white hover:bg-amber-700 shadow-[0_6px_16px_rgba(217,119,6,0.14)]",
  },
};

const metricColorStyles: Record<
  PageHeaderColor,
  string
> = {
  violet:
    "border-violet-200/60 bg-violet-50/70 text-violet-700",

  cyan:
    "border-cyan-200/60 bg-cyan-50/70 text-cyan-700",

  emerald:
    "border-emerald-200/60 bg-emerald-50/70 text-emerald-700",

  sky:
    "border-sky-200/60 bg-sky-50/70 text-sky-700",

  amber:
    "border-amber-200/60 bg-amber-50/70 text-amber-700",
};

function HeaderMetric({
  label,
  value,
  color = "violet",
}: PageHeaderMetric) {
  return (
    <article
      className={[
        "flex h-9 min-w-[88px] items-center justify-center",
        "rounded-[12px] border px-3",
        "transition-all duration-200",
        "hover:-translate-y-[1px]",
        metricColorStyles[color],
      ].join(" ")}
    >
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <p className="text-[10px] font-semibold leading-none tracking-[-0.01em]">
          {label}
        </p>

        <p className="text-[11px] font-medium leading-none opacity-75">
          {value}
        </p>
      </div>
    </article>
  );
}

export function PageHeader({
  title,
  academicYear,
  semester,
  icon,
  color = "violet",
  metrics = [],
  action,
}: PageHeaderProps) {
  const styles = colorStyles[color];

  return (
    <section
      className="
        rounded-[24px]
        border border-border/45
        bg-card
        px-4 py-3.5
        shadow-[0_8px_30px_rgba(30,20,70,0.035)]
        sm:px-4.5 sm:py-4
      "
    >
      <div
        className="
          flex flex-col gap-3.5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Page identity */}
        <div className="flex items-center gap-3">
          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[13px]",
              styles.icon,
            ].join(" ")}
          >
            {icon}
          </span>

          <div className="min-w-0">
            <h1 className="text-[16px] font-semibold tracking-[-0.02em]">
              {title}
            </h1>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {academicYear} · {semester}
            </p>
          </div>
        </div>

        {/* Metrics + action */}
        {(metrics.length > 0 || action) && (
          <div className="flex flex-wrap items-center gap-2">
            {metrics.map((metric, index) => (
              <HeaderMetric
                key={`${metric.label}-${index}`}
                {...metric}
              />
            ))}

            {action && (
              <div className="ml-1.5 lg:ml-2">
                <button
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={[
                    "inline-flex h-9",
                    "items-center justify-center gap-2",
                    "rounded-full px-4",
                    "text-[12px] font-medium",
                    "transition-all duration-200",
                    "hover:-translate-y-[1px]",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "disabled:hover:translate-y-0",
                    styles.button,
                  ].join(" ")}
                >
                  {action.icon}

                  {action.label}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}