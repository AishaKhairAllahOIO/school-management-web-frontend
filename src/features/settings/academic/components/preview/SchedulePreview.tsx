import { Flag } from "lucide-react";

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
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm font-semibold text-muted-foreground">
        No working day selected.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.type}-${item.time}-${index}`}
          className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3"
        >
          <span className="text-xs font-bold text-muted-foreground">
            {item.time}
          </span>

          <span className="text-sm font-semibold text-foreground">
            {item.label}
          </span>
        </div>
      ))}

      <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3 text-primary">
        <div className="flex items-center gap-2">
          <Flag size={16} />

          <span className="text-sm font-bold">
            End of Day
          </span>
        </div>

        <span className="text-sm font-bold">
          {endTime}
        </span>
      </div>
    </div>
  );
}