import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;
  action?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  action,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`soft-card rounded-3xl p-5 ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-foreground">
          {title}
        </h2>

        {action ? (
          <button className="text-xs font-semibold text-primary hover:text-primary/80">
            {action}
          </button>
        ) : null}
      </div>

      {children}
    </section>
  );
}