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
    <section className="w-full min-w-0 overflow-hidden rounded-[22px] border border-border/45 bg-card">
      <header className="flex flex-col gap-4 border-b border-border/35 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.06] text-primary">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-foreground/90">{title}</h2>
            <p className="mt-0.5 max-w-3xl text-[12px] leading-5 text-muted-foreground/72">{description}</p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="min-w-0 p-4 sm:p-5">{children}</div>
    </section>
  );
}
