import { Flag } from "lucide-react";

import type { SchoolDayScheduleSettings } from "../../types/academic-settings.types";
import { buildSchedulePreview } from "../../utils/academic-settings.utils";

export function SchedulePreview({ schedule }: { schedule: SchoolDayScheduleSettings }) {
  const { items, endTime } = buildSchedulePreview(schedule);

  if (items.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">No working day selected.</div>;
  }

  return (
    <div className="relative space-y-2 pl-5">
      <div className="absolute bottom-6 left-[7px] top-3 border-l border-dashed border-slate-300" />
      {items.map((item) => (
        <div key={`${item.time}-${item.label}`} className="relative grid grid-cols-[70px_minmax(0,1fr)] items-center gap-3">
          <span className={["absolute -left-[17px] h-2 w-2 rounded-full", item.type === "break" ? "bg-amber-500" : "bg-slate-700"].join(" ")} />
          <span className="rounded-lg bg-white px-2 py-2 text-center text-xs font-black text-slate-900">{item.time}</span>
          <span
            className={[
              "rounded-lg border px-3 py-2 text-xs font-bold",
              item.type === "break" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600",
            ].join(" ")}
          >
            {item.label}
          </span>
        </div>
      ))}

      <div className="relative grid grid-cols-[70px_minmax(0,1fr)] items-center gap-3">
        <span className="absolute -left-[17px] h-2 w-2 rounded-full bg-emerald-500" />
        <span className="rounded-lg bg-emerald-50 px-2 py-2 text-center text-xs font-black text-emerald-600">{endTime}</span>
        <span className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
          End of Day
          <Flag size={13} />
        </span>
      </div>
    </div>
  );
}
