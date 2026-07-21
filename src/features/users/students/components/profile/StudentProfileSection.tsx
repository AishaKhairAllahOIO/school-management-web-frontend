import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

type StudentProfileSectionProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
};

export function StudentProfileSection({
  title,
  description,
  icon,
  children,
  onEdit,
  className = "",
}: StudentProfileSectionProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[30px] border border-border/70 bg-card",
        "shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      <header className="flex flex-col gap-4 border-b border-border/70 bg-secondary/35 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-foreground">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-primary/25 hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        ) : null}
      </header>

      <div className="p-5">{children}</div>
    </section>
  );
}
