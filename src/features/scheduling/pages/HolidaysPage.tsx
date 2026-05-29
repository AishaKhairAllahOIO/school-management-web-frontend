import { CalendarDays } from "lucide-react";

import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";

export function HolidaysPage() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <SchedulePageHeader
        title="Holidays"
        description="Manage school holidays and days off"
        icon={CalendarDays}
      />

      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
        Holidays calendar will be added here.
      </div>
    </section>
  );
}