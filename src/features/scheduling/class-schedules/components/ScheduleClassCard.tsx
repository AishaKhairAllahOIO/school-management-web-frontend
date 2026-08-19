// ScheduleClassCard.tsx

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
        "hover:-translate-y-[1px]",
        "hover:shadow-[0_8px_22px_rgba(30,20,70,0.06)]",
        "dark:hover:shadow-[0_8px_22px_rgba(0,0,0,0.22)]",

        period.is_heavy
          ? [
              "border-amber-200/70 bg-amber-50/75",
              "dark:border-amber-400/20 dark:bg-amber-400/[0.08]",
            ].join(" ")
          : [
              "border-violet-200/70 bg-violet-50/75",
              "dark:border-violet-400/20 dark:bg-violet-400/[0.08]",
            ].join(" "),
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

            dark:border-white/[0.08]
            dark:bg-white/[0.06]
            dark:hover:bg-white/[0.12]
            dark:hover:text-primary
          "
          aria-label="Edit lesson"
          title="Edit lesson"
        >
          <Pencil size={11} />
        </button>
      )}

      <div className="flex items-start gap-2 pr-6">
        <span
          className={
            period.is_heavy
              ? "mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
              : "mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
          }
        >
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
        <User
          size={10}
          className="shrink-0 text-muted-foreground"
        />

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