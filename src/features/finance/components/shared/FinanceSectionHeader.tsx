import type { ReactNode } from "react";

export function FinanceSectionHeader({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">{icon}</div>
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
