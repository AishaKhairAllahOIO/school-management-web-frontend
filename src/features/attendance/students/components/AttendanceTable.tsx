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
  AbsenceType,
  AttendanceStatus,
  StudentAttendance,
} from "../types/attendance.types";

type Props = {
  data: StudentAttendance[];
  isLoading?: boolean;
  onUpdate: (
    id: string,
    patch: Partial<
      Pick<StudentAttendance, "status" | "absenceType" | "date">
    >,
  ) => void;
};

const inlineControlClass =
  "h-8 rounded-[10px] border-border/55 bg-background/80 text-[11px] shadow-none";

export function AttendanceTable({
  data,
  isLoading = false,
  onUpdate,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.04)]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">
            Student records
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {isLoading ? "Loading records" : `${data.length} records`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[13%]" />
            <col className="w-[17%]" />
            <col className="w-[17%]" />
            <col className="w-[17%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="bg-muted/[0.28]">
            <tr className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {[
                "Student",
                "Grade",
                "Attendance",
                "Absence type",
                "Date",
                "Actions",
              ].map((label) => (
                <th
                  key={label}
                  className={
                    label === "Actions"
                      ? "h-10 px-4 text-center"
                      : "h-10 px-4 text-start"
                  }
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
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-9 animate-pulse rounded-[9px] bg-muted/45" />
                    </td>
                  </tr>
                ))
              : data.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-border/45 text-[12px] transition-colors hover:bg-muted/[0.22]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.08] text-[12px] font-semibold text-primary">
                          {student.studentName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {student.studentName}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                            Classroom {student.section}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{student.className}</td>

                    <td className="px-4 py-3">
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          onUpdate(student.id, {
                            status: value as AttendanceStatus,
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

                    <td className="px-4 py-3">
                      {student.status === "Absent" ? (
                        <Select
                          value={student.absenceType ?? "Excused"}
                          onValueChange={(value) =>
                            onUpdate(student.id, {
                              absenceType: value as AbsenceType,
                            })
                          }
                        >
                          <SelectTrigger className={inlineControlClass}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excused">Excused</SelectItem>
                            <SelectItem value="Unexcused">Unexcused</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Input
                        type="date"
                        value={student.date}
                        onChange={(event) =>
                          onUpdate(student.id, { date: event.target.value })
                        }
                        className={inlineControlClass}
                        aria-label={`Attendance date for ${student.studentName}`}
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-primary/15 text-primary hover:bg-primary/[0.06]"
                      >
                        <Link
                          to={`/attendance/students/${student.studentId}`}
                          aria-label={`View ${student.studentName}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-[12px] text-muted-foreground"
                >
                  No student attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
