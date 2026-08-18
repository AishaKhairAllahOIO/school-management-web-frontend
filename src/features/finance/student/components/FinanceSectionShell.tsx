import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "student" | "staff";
  action?: ReactNode;
  children: ReactNode;
};

export function FinanceSectionShell({
  title,
  description,
  icon: Icon,
  action,
  children,
}: Props) {
  return (
    <section className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-border/45 bg-card/90 shadow-[0_18px_55px_rgba(31,22,73,0.055)] backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-20 h-40 w-40 rounded-full bg-info/[0.045] blur-3xl" />

      <header className="relative flex flex-col gap-4 border-b border-border/35 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-primary/12 bg-primary/[0.065] text-primary shadow-[0_8px_22px_rgba(99,78,181,0.08)]">
            <span className="absolute inset-1 rounded-[13px] border border-white/50" />
            <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-foreground/92">{title}</h2>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-primary/45 sm:block" />
            </div>
            <p className="mt-1 max-w-3xl text-[12px] leading-5 text-muted-foreground/72">{description}</p>
          </div>
        </div>
        {action ? <div className="relative shrink-0">{action}</div> : null}
      </header>

      <div className="relative min-w-0 p-3.5 sm:p-5">{children}</div>
    </section>
  );
}
