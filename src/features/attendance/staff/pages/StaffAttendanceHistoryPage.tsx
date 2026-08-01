import { CalendarSearch } from "lucide-react";
import { useParams } from "react-router-dom";

export function StaffAttendanceHistoryPage() {
  const { employeeId } = useParams();

  return (
    <section className="pt-1">
      <div className="flex min-h-[420px] items-center justify-center rounded-[20px] border border-dashed border-border/70 bg-card/70 p-8 text-center shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
        <div>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-info/[0.09] text-info">
            <CalendarSearch className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h1 className="mt-4 text-[17px] font-semibold text-foreground">Staff attendance history</h1>
          <p className="mt-2 text-[12px] text-muted-foreground">
            The detailed attendance timeline for employee {employeeId ?? "—"} will be added here.
          </p>
        </div>
      </div>
    </section>
  );
}
