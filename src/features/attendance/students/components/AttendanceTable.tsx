import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  AbsenceType,
  AttendanceStatus,
  StudentAttendance,
} from "../types/attendance.types";

type Props = {
  data: StudentAttendance[];
  isLoading?: boolean;
  onUpdate: (
    id: string,
    patch: Partial<Pick<StudentAttendance, "status" | "absenceType">>,
  ) => void;
};

const inlineControlClass =
  "h-9 rounded-[11px] border-border/55 bg-background/80 text-[12px] shadow-none";

export function AttendanceTable({ data, isLoading = false, onUpdate }: Props) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Student attendance</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {isLoading ? "Loading records" : `${data.length} students for the selected date`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] table-fixed">
          <colgroup>
            <col className="w-[31%]" />
            <col className="w-[14%]" />
            <col className="w-[21%]" />
            <col className="w-[22%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="bg-muted/[0.28]">
            <tr className="text-[11px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
              {["Student", "Grade", "Attendance", "Attendance details", "Actions"].map((label) => (
                <th
                  key={label}
                  className={label === "Actions" ? "h-11 px-5 text-center" : "h-11 px-5 text-start"}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-t border-border/45">
                    <td colSpan={5} className="px-5 py-3.5">
                      <div className="h-10 animate-pulse rounded-[10px] bg-muted/45" />
                    </td>
                  </tr>
                ))
              : data.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-border/45 text-[13px] transition-colors hover:bg-muted/[0.22]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.08] text-[13px] font-semibold text-primary">
                          {student.studentName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{student.studentName}</p>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            Classroom {student.section} · {student.supervisorName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">{student.className}</td>

                    <td className="px-5 py-3.5">
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          onUpdate(student.id, {
                            status: value as AttendanceStatus,
                            ...(value === "Present"
                              ? { absenceType: undefined }
                              : { absenceType: student.absenceType ?? "Excused" }),
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
                    </td>

                    <td className="px-5 py-3.5">
                      {student.status === "Absent" ? (
                        <Select
                          value={student.absenceType ?? "Excused"}
                          onValueChange={(value) =>
                            onUpdate(student.id, { absenceType: value as AbsenceType })
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

                    <td className="px-5 py-3.5 text-center">
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-primary/15 text-primary hover:bg-primary/[0.06]"
                      >
                        <Link
                          to={`/attendance/students/${student.studentId}`}
                          aria-label={`View attendance history for ${student.studentName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-[13px] text-muted-foreground">
                  No student attendance records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
