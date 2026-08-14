import { CalendarDays, Clock } from "lucide-react";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { DeleteLeaveDialog } from "./DeleteLeaveDialog";
import { EditLeaveDialog } from "./EditLeaveDialog";

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
              <div key={index} className="h-[74px] animate-pulse rounded-[14px] bg-muted/45" />
            ))
          : data.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect?.(item)}
                className="flex cursor-pointer w-full items-start gap-2.5 rounded-[14px] border border-transparent px-2.5 py-2.5 transition-colors hover:border-border/55 hover:bg-muted/[0.28]"
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
                    {item.leave_type?.name || "Unknown Leave"}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/85">
                    <CalendarDays className="h-3 w-3" strokeWidth={1.7} />
                    {item.start_date} — {item.end_date}
                  </span>
                </span>
              </div>
            ))}
        {!isLoading && data.length === 0 && (
          <p className="px-3 py-10 text-center text-[11px] text-muted-foreground">No vacations found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed text-left text-sm">
          <thead className="border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-4 w-[25%]">Employee ID</th>
              <th className="px-5 py-4 w-[25%]">Leave Type</th>
              <th className="px-5 py-4 w-[25%]">Duration</th>
              <th className="px-5 py-4 w-[15%] text-center">Status</th>
              <th className="px-5 py-4 w-[10%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5} className="p-4">
                    <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 text-center text-muted-foreground">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 font-medium">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {item.staff_id}
                      </span>
                      Staff #{item.staff_id}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {item.leave_type?.name || "N/A"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={14} />
                      {item.start_date} to {item.end_date}
                      <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">
                        {calculateDays(item.start_date, item.end_date)}d
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {/* ✅ تجاوز الإيرور واستخدام Pending كافتراضي */}
                    <LeaveStatusBadge status={(item as any).status || "Pending"} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <EditLeaveDialog onEdit={() => onSelect?.(item)} />
                      <DeleteLeaveDialog onDelete={() => console.log("Delete", item.id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}