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
  tone = "student",
  action,
  children,
}: Props) {
  const staff = tone === "staff";

  return (
    <section className="overflow-hidden rounded-[22px] border border-border/55 bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 border-b border-border/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border",
              staff
                ? "border-info/20 bg-info/[0.09] text-info"
                : "border-primary/20 bg-primary/[0.075] text-primary",
            ].join(" ")}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-medium tracking-[-0.015em] text-foreground/90">
              {title}
            </h2>
            <p className="mt-0.5 text-[12.5px] font-normal leading-5 text-muted-foreground/85">
              {description}
            </p>
          </div>
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}
