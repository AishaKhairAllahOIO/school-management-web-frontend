import {
  BookOpen,
  Coffee,
  Flag,
} from "lucide-react";

import type { SchoolScheduleSettings } from "../../types/academic-settings.types";
import { buildSchedulePreview } from "../../utils/academic-settings.utils";

type SchedulePreviewProps = {
  schedule: SchoolScheduleSettings;
};

export function SchedulePreview({
  schedule,
}: SchedulePreviewProps) {
  const { items, endTime } =
    buildSchedulePreview(schedule);

  if (items.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">
          No working days selected
        </p>

        <p className="mt-1 text-xs font-normal text-muted-foreground">
          Select at least one working day to build
          the preview.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const isBreak =
          item.type === "break";

        return (
          <div
            key={`${item.type}-${item.time}-${index}`}
            className={[
              "flex items-center justify-between",
              "gap-4 rounded-[15px]",
              "border px-4 py-3",
              isBreak
                ? "border-amber-200/60 bg-amber-50/60"
                : "border-border/60 bg-card",
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex h-8 w-8 shrink-0",
                  "items-center justify-center",
                  "rounded-xl",
                  isBreak
                    ? "bg-amber-100 text-amber-600"
                    : "bg-primary/[0.07] text-primary",
                ].join(" ")}
              >
                {isBreak ? (
                  <Coffee
                    size={14}
                    strokeWidth={1.8}
                  />
                ) : (
                  <BookOpen
                    size={14}
                    strokeWidth={1.8}
                  />
                )}
              </span>

              <span className="truncate text-xs font-medium text-foreground">
                {item.label}
              </span>
            </div>

            <span className="shrink-0 text-[11px] font-normal text-muted-foreground">
              {item.time}
            </span>
          </div>
        );
      })}

      <div className="flex items-center justify-between rounded-[15px] bg-primary px-4 py-3 text-primary-foreground shadow-sm">
        <div className="flex items-center gap-2.5">
          <Flag
            size={15}
            strokeWidth={1.8}
          />

          <span className="text-xs font-medium">
            End of Day
          </span>
        </div>

        <span className="text-xs font-medium">
          {endTime}
        </span>
      </div>
    </div>
  );
}