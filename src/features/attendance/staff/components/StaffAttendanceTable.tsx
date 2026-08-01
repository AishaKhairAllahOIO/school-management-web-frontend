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
    patch: Partial<Pick<StaffAttendance, "status" | "absenceType" | "date" | "attendedPeriods">>,
  ) => void;
};

const inlineControlClass =
  "h-8 rounded-[10px] border-border/55 bg-background/80 text-[10px] shadow-none";

export function StaffAttendanceTable({ data, isLoading = false, onUpdate }: Props) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.04)]">
      <div className="border-b border-border/50 px-4 py-3.5">
        <h3 className="text-[14px] font-semibold text-foreground">Staff records</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {isLoading ? "Loading records" : `${data.length} records`}
        </p>
      </div>

      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[15%]" />
          <col className="w-[21%]" />
          <col className="w-[17%]" />
          <col className="w-[14%]" />
          <col className="w-[7%]" />
        </colgroup>
        <thead className="bg-muted/[0.28]">
          <tr className="text-[9px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
            <th className="h-10 px-3 text-start">Name</th>
            <th className="h-10 px-3 text-start">Staff type</th>
            <th className="h-10 px-3 text-start">Attendance</th>
            <th className="h-10 px-3 text-start">Absence type</th>
            <th className="h-10 px-3 text-start">Date</th>
            <th className="h-10 px-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-border/45">
                  <td colSpan={6} className="px-3 py-3">
                    <div className="h-9 animate-pulse rounded-[9px] bg-muted/45" />
                  </td>
                </tr>
              ))
            : data.map((item) => (
                <tr key={item.id} className="border-t border-border/45 text-[10px] text-foreground transition-colors hover:bg-muted/[0.22]">
                  <td className="px-3 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-info/[0.09] text-[11px] font-semibold text-info">
                        {item.employeeName.charAt(0)}
                      </span>
                      <p className="min-w-0 truncate font-medium">{item.employeeName}</p>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-muted-foreground">{item.role}</td>

                  <td className="px-3 py-3">
                    {item.role === "Teacher" ? (
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          max={item.requiredPeriods ?? 0}
                          value={item.attendedPeriods ?? 0}
                          onChange={(event) => {
                            const value = Math.max(0, Math.min(Number(event.target.value), item.requiredPeriods ?? 0));
                            onUpdate(item.id, {
                              attendedPeriods: value,
                              status: value > 0 ? "Present" : "Absent",
                            });
                          }}
                          className="h-8 w-12 rounded-[10px] border-border/55 px-2 text-center text-[10px]"
                          aria-label={`Attended periods for ${item.employeeName}`}
                        />
                        <span className="shrink-0 text-[9px] text-muted-foreground">
                          / {item.requiredPeriods ?? 0} periods
                        </span>
                      </div>
                    ) : (
                      <Select
                        value={item.status}
                        onValueChange={(value) => onUpdate(item.id, { status: value as StaffAttendanceStatus })}
                      >
                        <SelectTrigger className={inlineControlClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>

                  <td className="px-3 py-3">
                    {item.status === "Absent" ? (
                      <Select
                        value={item.absenceType ?? "Excused"}
                        onValueChange={(value) => onUpdate(item.id, { absenceType: value as StaffAbsenceType })}
                      >
                        <SelectTrigger className={inlineControlClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excused">Excused</SelectItem>
                          <SelectItem value="Unexcused">Unexcused</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <Input
                      type="date"
                      value={item.date}
                      onChange={(event) => onUpdate(item.id, { date: event.target.value })}
                      className={inlineControlClass}
                      aria-label={`Attendance date for ${item.employeeName}`}
                    />
                  </td>

                  <td className="px-2 py-3 text-center">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full border-info/15 text-info hover:bg-info/[0.06]">
                      <Link to={`/attendance/staff/${item.employeeId}`} aria-label={`View ${item.employeeName}`}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-12 text-center text-[11px] text-muted-foreground">
                No staff attendance records match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
