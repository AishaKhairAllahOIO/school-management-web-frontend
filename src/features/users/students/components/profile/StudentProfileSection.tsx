import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

type StudentProfileSectionProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
  eyebrow?: string;
};

export function StudentProfileSection({
  title,
  description,
  icon,
  children,
  onEdit,
  className = "",
  eyebrow = "Student profile",
}: StudentProfileSectionProps) {
  return (
    <section className={["overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[var(--shadow-card)]", className].join(" ")}>
      <header className="flex items-start justify-between gap-4 border-b border-border/60 bg-muted/25 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">{icon}</span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">{eyebrow}</p>
            <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
            {description ? <p className="mt-1 text-[13px] font-normal leading-5 text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {onEdit ? (
          <button type="button" onClick={onEdit} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15">
            <Pencil className="h-4 w-4" /> Edit
          </button>
        ) : null}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
