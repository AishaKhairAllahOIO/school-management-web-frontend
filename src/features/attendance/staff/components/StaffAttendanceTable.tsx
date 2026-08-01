import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  StaffAbsenceType,
  StaffAttendance,
  StaffAttendanceStatus,
} from "../types/staffAttendance.types";

type Props = {
  data: StaffAttendance[];
  isLoading?: boolean;
  onUpdate: (
    id: string,
    patch: Partial<
      Pick<
        StaffAttendance,
        "status" | "absenceType" | "attendedPeriods"
      >
    >,
  ) => void;
};

const inlineControlClass =
  "h-9 rounded-[11px] border-border/55 bg-background/80 text-[12px] shadow-none";

export function StaffAttendanceTable({
  data,
  isLoading = false,
  onUpdate,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
      <div className="border-b border-border/50 px-5 py-4">
        <h3 className="text-[15px] font-semibold text-foreground">Staff attendance</h3>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          {isLoading ? "Loading records" : `${data.length} staff members for the selected date`}
        </p>
      </div>

      <div className="overflow-x-hidden">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[31%]" />
            <col className="w-[17%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[10%]" />
          </colgroup>

          <thead className="bg-muted/[0.28]">
            <tr className="text-[10px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
              <th className="h-11 px-4 text-start">Name</th>
              <th className="h-11 px-4 text-start">Staff type</th>
              <th className="h-11 px-4 text-start">Attendance</th>
              <th className="h-11 px-4 text-start">Attendance details</th>
              <th className="h-11 px-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-t border-border/45">
                    <td colSpan={5} className="px-4 py-3.5">
                      <div className="h-10 animate-pulse rounded-[10px] bg-muted/45" />
                    </td>
                  </tr>
                ))
              : data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border/45 text-[12px] text-foreground transition-colors hover:bg-muted/[0.22]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.09] text-[12px] font-semibold text-info">
                          {item.employeeName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{item.employeeName}</p>
                          {item.role === "Teacher" ? (
                            <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                              Daily teaching attendance
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-muted-foreground">{item.role}</td>

                    <td className="px-4 py-3.5">
                      {item.role === "Teacher" ? (
                        <div className="flex min-w-0 items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={item.requiredPeriods ?? 0}
                            value={item.attendedPeriods ?? 0}
                            onChange={(event) => {
                              const value = Math.max(
                                0,
                                Math.min(
                                  Number(event.target.value),
                                  item.requiredPeriods ?? 0,
                                ),
                              );

                              onUpdate(item.id, {
                                attendedPeriods: value,
                                status: value > 0 ? "Present" : "Absent",
                              });
                            }}
                            className="h-9 w-14 rounded-[11px] border-border/55 px-2 text-center text-[12px]"
                            aria-label={`Attended periods for ${item.employeeName}`}
                          />
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            / {item.requiredPeriods ?? 0}
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            onUpdate(item.id, {
                              status: value as StaffAttendanceStatus,
                              ...(value === "Present"
                                ? { absenceType: undefined }
                                : { absenceType: item.absenceType ?? "Excused" }),
                            })
                          }
                        >
                          <SelectTrigger className={inlineControlClass}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {item.role === "Teacher" ? (
                        item.status === "Absent" ? (
                          <Select
                            value={item.absenceType ?? "Excused"}
                            onValueChange={(value) =>
                              onUpdate(item.id, {
                                absenceType: value as StaffAbsenceType,
                              })
                            }
                          >
                            <SelectTrigger className={inlineControlClass}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excused">Excused absence</SelectItem>
                              <SelectItem value="Unexcused">Unexcused absence</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="rounded-[11px] border border-info/15 bg-info/[0.05] px-3 py-2 text-[11px] text-info">
                            {item.attendedPeriods ?? 0} of {item.requiredPeriods ?? 0} periods
                          </div>
                        )
                      ) : item.status === "Absent" ? (
                        <Select
                          value={item.absenceType ?? "Excused"}
                          onValueChange={(value) =>
                            onUpdate(item.id, {
                              absenceType: value as StaffAbsenceType,
                            })
                          }
                        >
                          <SelectTrigger className={inlineControlClass}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excused">Excused absence</SelectItem>
                            <SelectItem value="Unexcused">Unexcused absence</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-center">
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-info/15 text-info hover:bg-info/[0.06]"
                      >
                        <Link
                          to={`/attendance/staff/${item.employeeId}`}
                          aria-label={`View attendance history for ${item.employeeName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center text-[12px] text-muted-foreground">
                  No staff attendance records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
