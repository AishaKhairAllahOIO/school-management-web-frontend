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
  action,
  children,
}: Props) {
  return (
    <section className="w-full min-w-0">
      {action ? (
        <div className="mb-4 flex w-full items-center justify-end">
          <div className="shrink-0">{action}</div>
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </section>
  );
}
