import { useState } from "react";
import { Clock, Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { StaffLeaveRecord } from "../types/staffLeave.types";
import { DeleteLeaveDialog } from "./DeleteLeaveDialog";
import { EditLeaveDialog } from "./EditLeaveDialog";
import { LeaveDetailsDialog } from "./LeaveDetailsDialog";

type Props = {
  data: StaffLeaveRecord[];
  staffList: any[];
  leaveTypes: any[];
  compact?: boolean;
  isLoading?: boolean;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return dateStr.split("T")[0];
}

function calculateDays(startDate: string, endDate: string) {
  try {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const diff =
      new Date(end).getTime() -
      new Date(start).getTime();

    const days = Math.floor(diff / 86400000) + 1;

    return isNaN(days) ? 1 : days;
  } catch {
    return 1;
  }
}

export function LeaveRequestsTable({
  data,
  staffList = [],
  leaveTypes = [],
  isLoading = false,
}: Props) {
  const [selectedLeave, setSelectedLeave] =
    useState<any>(null);

  // استخدام String() لضمان تطابق الـ ID
  // سواء كان نصًا أو رقمًا
  const getStaffDetails = (
    staffId: string | number
  ) => {
    const staff = staffList.find(
      (s: any) => String(s.id) === String(staffId)
    );

    if (!staff) {
      return {
        name: `Staff #${staffId}`,
        role: "Employee",
        initials: "?",
      };
    }

    const name =
      staff.fullName ||
      staff.name ||
      `${staff.firstName || ""} ${
        staff.lastName || ""
      }`.trim() ||
      `Staff #${staffId}`;

    const roleString = Array.isArray(staff?.role)
      ? staff.role[0]
      : staff?.role;

    const role = roleString || "Employee";

    const initials = name.substring(0, 2).toUpperCase();

    return {
      name,
      role,
      initials,
    };
  };

  const getLeaveTypeName = (
    leaveTypeId: string | number
  ) => {
    const type = leaveTypes.find(
      (t: any) =>
        String(t.id) === String(leaveTypeId)
    );

    return type
      ? type.name
      : `نوع إجازة #${leaveTypeId}`;
  };

  return (
    <>
      <div className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-[30%] px-5 py-4">
                  Staff Member
                </th>

                <th className="w-[25%] px-5 py-4">
                  Leave Type
                </th>

                <th className="w-[30%] px-5 py-4">
                  Duration
                </th>

                <th className="w-[15%] px-5 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 3 }).map(
                  (_, index) => (
                    <tr key={index}>
                      <td
                        colSpan={4}
                        className="p-4"
                      >
                        <div className="h-12 w-full animate-pulse rounded-xl bg-muted/40" />
                      </td>
                    </tr>
                  )
                )
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-14 text-center text-muted-foreground"
                  >
                    No leave records found.
                  </td>
                </tr>
              ) : (
                data.map((item: any) => {
                  const startDateClean =
                    formatDate(item.start_date);

                  const endDateClean =
                    formatDate(item.end_date);

                  // جلب بيانات الموظف
                  const staff = getStaffDetails(
                    item.staff_id
                  );

                  // جلب اسم نوع الإجازة
                  const leaveName =
                    getLeaveTypeName(
                      item.leave_type_id ||
                        item.leave_type?.id
                    );

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/10"
                    >
                      {/* Staff Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-violet-600/10 text-[13px] font-semibold text-violet-700">
                            {staff.initials}
                          </span>

                          <div className="flex flex-col">
                            <span className="text-[13.5px] font-semibold text-foreground">
                              {staff.name}
                            </span>

                            <span className="text-[11.5px] font-medium text-muted-foreground">
                              {staff.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-secondary/50 px-2.5 py-1 text-[12px] font-semibold text-secondary-foreground">
                          {leaveName}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground">
                          <Clock
                            size={14}
                            className="text-primary/70"
                          />

                          {startDateClean}
                          &nbsp;to&nbsp;
                          {endDateClean}

                          <span className="ml-1.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
                            {calculateDays(
                              startDateClean,
                              endDateClean
                            )}
                            d
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-violet-600/20 text-violet-700 transition-colors hover:bg-violet-600/10"
                            onClick={() =>
                              setSelectedLeave({
                                ...item,
                                staffDetails: staff,
                                leaveTypeName:
                                  leaveName,
                              })
                            }
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <EditLeaveDialog leave={item} />

                          <DeleteLeaveDialog
                            leaveId={item.id}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveDetailsDialog
        open={!!selectedLeave}
        onOpenChange={(open) =>
          !open && setSelectedLeave(null)
        }
        leave={selectedLeave || undefined}
      />
    </>
  );
}