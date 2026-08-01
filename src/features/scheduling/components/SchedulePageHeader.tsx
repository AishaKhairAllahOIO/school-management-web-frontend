import type { LucideIcon } from "lucide-react";
import { Download, Plus } from "lucide-react";

type SchedulePageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
};

export function SchedulePageHeader({
  title,
  description,
  icon: Icon,
  onExport,
  onAdd,
  addLabel = "Add item",
}: SchedulePageHeaderProps) {
  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
            <Icon size={20} strokeWidth={1.8} />
          </span>

          <div className="min-w-0 pt-0.5">
            <h1 className="text-[20px] font-semibold tracking-[-0.025em] text-foreground">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {onExport ? (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 hover:text-foreground"
            >
              <Download size={14} strokeWidth={1.8} />
              Export
            </button>
          ) : null}

          {onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Plus size={14} strokeWidth={1.9} />
              {addLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
