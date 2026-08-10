import { CalendarDays } from "lucide-react";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";

type Props = {
  data: StaffLeave[];
  compact?: boolean;
  isLoading?: boolean;
  onSelect?: (leave: StaffLeave) => void;  
};

function calculateDays(startDate: string, endDate: string) {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.floor(diff / 86400000) + 1;
}

export function LeaveRequestsTable({
  data,
  compact = false,
  isLoading = false,
  onSelect,
}: Props) {
  if (compact) {
    return (
      <div className="space-y-1.5 p-2.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[74px] animate-pulse rounded-[14px] bg-muted/45"
              />
            ))
          : data.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect?.(item)}
                className="flex w-full items-start gap-2.5 rounded-[14px] border border-transparent px-2.5 py-2.5 transition-colors hover:border-border/55 hover:bg-muted/[0.28]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-warning/[0.10] text-[11px] font-semibold text-warning">
                  {item.staff_id}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <strong className="truncate text-[12px] font-medium text-foreground">
                      Staff ID: {item.staff_id}
                    </strong>
                    <span className="shrink-0 rounded-full bg-warning/[0.10] px-2 py-0.5 text-[9px] font-medium text-warning">
                      {calculateDays(item.start_date, item.end_date)} days
                    </span>
                  </span>

                  <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                    {item.leave_type?.name}
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/85">
                    <CalendarDays className="h-3 w-3" strokeWidth={1.7} />
                    {item.start_date} — {item.end_date}
                  </span>
                </span>
              </div>
            ))}

        {!isLoading && data.length === 0 && (
          <p className="px-3 py-10 text-center text-[11px] text-muted-foreground">
            No vacations found.
          </p>
        )}
      </div>
    );
  }

  return null;
}