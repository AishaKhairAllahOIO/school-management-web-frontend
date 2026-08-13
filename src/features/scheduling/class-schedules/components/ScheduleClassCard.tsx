import {
  BookOpen,
  User,
} from "lucide-react";

import type {
  SchedulePeriod,
} from "../types/schedule.types";

type Props = {
  period: SchedulePeriod;
};

export function ScheduleClassCard({
  period,
}: Props) {
  return (
    <article
      className={[
        "h-full rounded-[15px] border p-2.5",
        period.is_heavy
          ? "border-amber-200/70 bg-amber-50/75"
          : "border-violet-200/70 bg-violet-50/75",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">
          <BookOpen
            size={12}
            strokeWidth={1.8}
          />
        </span>

        <p className="truncate text-[11px] font-medium text-foreground">
          {period.subject_name ??
            "Unknown subject"}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/70">
        <User size={10} />
        <span className="truncate">
          {period.teacher_name ??
            "Unknown teacher"}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {period.start_time} –{" "}
        {period.end_time}
      </p>
    </article>
  );
}