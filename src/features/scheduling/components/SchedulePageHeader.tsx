import type { LucideIcon } from "lucide-react";
import { Download } from "lucide-react";

type SchedulePageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function SchedulePageHeader({
  title,
  description,
  icon: Icon,
}: SchedulePageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
            {title}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <button
        type="button"
        className="hidden h-10 items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted md:flex"
      >
        <Download size={16} />
        Export
      </button>
    </div>
  );
}