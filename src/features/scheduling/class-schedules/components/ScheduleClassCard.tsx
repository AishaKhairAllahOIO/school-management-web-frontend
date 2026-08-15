import {
  BookOpen,
  Pencil,
  User,
} from "lucide-react";

import type { SchedulePeriod } from "../types/schedule.types";

type Props = {
  period: SchedulePeriod;
  onEdit?: () => void;
};

export function ScheduleClassCard({
  period,
  onEdit,
}: Props) {
  return (
    <article
      className={[
        "group relative rounded-[15px] border p-2.5",
        "transition-all duration-200",
        "hover:-translate-y-[1px] hover:shadow-[0_8px_22px_rgba(30,20,70,0.06)]",
        period.is_heavy
          ? "border-amber-200/70 bg-amber-50/75"
          : "border-violet-200/70 bg-violet-50/75",
      ].join(" ")}
    >
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="
            absolute right-2 top-2
            flex h-6 w-6 items-center justify-center
            rounded-full
            border border-white/70
            bg-white/70
            text-muted-foreground
            opacity-0
            shadow-sm
            transition-all
            hover:bg-white
            hover:text-primary
            group-hover:opacity-100
          "
          aria-label="Edit lesson"
          title="Edit lesson"
        >
          <Pencil size={11} />
        </button>
      )}

      <div className="flex items-start gap-2 pr-6">
        <span className="mt-0.5 shrink-0">
          <BookOpen
            size={12}
            strokeWidth={1.8}
          />
        </span>

        <p className="truncate text-[11px] font-medium text-foreground">
          {period.subject_name ?? "Unknown subject"}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/70">
        <User size={10} />

        <span className="truncate">
          {period.teacher_name ?? "Unknown teacher"}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {period.start_time} – {period.end_time}
      </p>
    </article>
  );
}