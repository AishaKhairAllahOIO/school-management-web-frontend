import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;
  description?: string;
  action?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  description,
  action,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section
      className={[
        "rounded-[24px]",
        "border border-border/45",
        "bg-card p-5",
        "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
        className,
      ].join(" ")}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-foreground">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <button
            type="button"
            className="shrink-0 text-[10px] font-medium text-primary transition hover:text-primary/80"
          >
            {action}
          </button>
        ) : null}
      </div>

      {children}
    </section>
  );
}
