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

/**
 * Deliberately keeps the finance workspace visually quiet.
 * The page title already exists in the application breadcrumb, so this shell
 * only provides an optional action row and the content surface.
 */
export function FinanceSectionShell({
  action,
  children,
}: Props) {
  return (
    <section className="w-full min-w-0">
      {action ? (
        <div className="mb-3 flex items-center justify-end px-0.5">
          {action}
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </section>
  );
}
