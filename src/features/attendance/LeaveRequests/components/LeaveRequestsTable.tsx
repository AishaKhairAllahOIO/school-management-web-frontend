import { CalendarDays, Clock } from "lucide-react";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";
import { DeleteLeaveDialog } from "./DeleteLeaveDialog";
import { EditLeaveDialog } from "./EditLeaveDialog";

type Props = {
  data: StaffLeave[];
  compact?: boolean;
  isLoading?: boolean;
};

function calculateDays(startDate: string, endDate: string) {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.floor(diff / 86400000) + 1;
}

export function LeaveRequestsTable({ data, isLoading = false }: Props) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed text-left text-sm">
          <thead className="border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-4 w-[25%]">Employee ID</th>
              <th className="px-5 py-4 w-[30%]">Leave Type</th>
              <th className="px-5 py-4 w-[30%]">Duration</th>
              <th className="px-5 py-4 w-[15%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={4} className="p-4">
                    <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-14 text-center text-muted-foreground">
                  No leave records found.
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
                    <div className="flex items-center justify-center gap-2">
                      <EditLeaveDialog leave={item} />
                      <DeleteLeaveDialog leaveId={item.id} />
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