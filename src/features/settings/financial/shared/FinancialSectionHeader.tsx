import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function FinancialSectionHeader({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>

        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex items-center">{children}</div>
    </div>
  );
}