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

export function StudentFinanceSectionShell({
  title,
  description,
  icon: Icon,
  action,
  children,
}: Props) {
  return (
    <section className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-border/35 bg-card/95 shadow-[0_12px_40px_rgba(31,22,73,0.035)] backdrop-blur-md dark:shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
      <header className="relative flex flex-col gap-4 border-b border-border/25 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/10 bg-primary/[0.05] text-primary dark:bg-primary/[0.08]">
            <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-foreground/92">{title}</h2>
            </div>
            <p className="mt-1 max-w-3xl text-[12px] leading-5 text-muted-foreground/72">{description}</p>
          </div>
        </div>
        {action ? <div className="relative shrink-0">{action}</div> : null}
      </header>

      <div className="relative min-w-0 p-3 sm:p-4 lg:p-5">{children}</div>
    </section>
  );
}
