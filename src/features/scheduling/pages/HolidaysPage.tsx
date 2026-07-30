import { CalendarDays, Palmtree, Sparkles } from "lucide-react";

import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";

const holidays = [
  { id: "h-1", name: "New Year Holiday", startDate: "2027-01-01", endDate: "2027-01-01", type: "Public Holiday" },
  { id: "h-2", name: "Midyear Break", startDate: "2027-01-24", endDate: "2027-02-04", type: "School Break" },
  { id: "h-3", name: "Teachers Development Day", startDate: "2027-03-11", endDate: "2027-03-11", type: "School Event" },
];

export function HolidaysPage() {
  function handleExport() {
    exportScheduleWorkbook({
      fileName: "school-holidays",
      sheetName: "Holidays",
      rows: holidays.map((item) => ({
        Holiday: item.name,
        "Start Date": item.startDate,
        "End Date": item.endDate,
        Type: item.type,
      })),
    });
  }

  return (
    <div className="space-y-5">
      <SchedulePageHeader
        title="Holidays"
        description="Manage school holidays, breaks and non-working days."
        icon={CalendarDays}
        onExport={handleExport}
      />

      <section className="grid gap-3 md:grid-cols-3">
        {holidays.map((item, index) => {
          const tones = [
            "border-amber-200/60 bg-amber-50/65 text-amber-700",
            "border-sky-200/60 bg-sky-50/65 text-sky-700",
            "border-violet-200/60 bg-violet-50/65 text-violet-700",
          ];
          const Icon = index === 1 ? Palmtree : Sparkles;

          return (
            <article key={item.id} className={`rounded-[22px] border p-4 ${tones[index]}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-card/70">
                <Icon size={18} />
              </span>
              <p className="mt-4 text-[13px] font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{item.type}</p>
              <p className="mt-3 text-[11px] font-medium">{item.startDate} → {item.endDate}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
