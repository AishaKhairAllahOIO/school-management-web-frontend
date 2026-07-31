import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export function FinancialSectionHeader({
  title,
  description,
  icon: Icon,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3.5">
        {Icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">
            <Icon size={18} strokeWidth={1.8} />
          </span>
        ) : null}

        <div className="min-w-0 pt-0.5">
          <h2 className="text-[17px] font-semibold leading-6 tracking-[-0.01em] text-foreground">
            {title}
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children ? <div className="flex shrink-0 items-center">{children}</div> : null}
    </div>
  );
}
