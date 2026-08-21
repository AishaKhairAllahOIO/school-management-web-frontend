import {
  ArrowLeft,
  CalendarX,
  CheckCircle2,
  Clock,
  FileText,
 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { useStaffAttendanceHistory } from "../hooks/useStaffAttendance";

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return dateStr.split("T")[0];
}

export function StaffAttendanceHistoryPage() {
  const { employeeId = "" } = useParams();
  const navigate = useNavigate();

  const {
    data: historyRecords = [],
    isLoading,
  } = useStaffAttendanceHistory(employeeId);

  const totalRecords = historyRecords.length;

  const totalAbsences = historyRecords.filter(
    (record: any) => record.status === "absent",
  ).length;

  const totalLeaves = historyRecords.filter(
    (record: any) => record.status === "on_leave",
  ).length;

  const partialAbsences = historyRecords.filter(
    (record: any) => record.status === "partial_absence",
  ).length;

  /*
   * ------------------------------------------------------------
   * Staff information
   * ------------------------------------------------------------
   *
   * This supports several possible API response shapes.
   * We will adjust this once we inspect the actual response.
   */
  const firstRecord = historyRecords[0];

  const staff =
    firstRecord?.staff ||
    firstRecord?.employee ||
    firstRecord?.user ||
    null;

  const staffName =
    staff?.full_name ||
    [staff?.first_name, staff?.last_name]
      .filter(Boolean)
      .join(" ") ||
    firstRecord?.staff_name ||
    firstRecord?.employee_name ||
    "Staff History";

  return (
    <section className="space-y-5 pt-5 animate-in fade-in duration-300">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="rounded-[24px] border border-border/70 bg-card p-5 shadow-sm">
        <div className="space-y-5">
          {/* Staff Information + Back */}
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Staff Attendance
              </p>

              <h1 className="truncate text-[19px] font-semibold tracking-tight text-foreground">
                {isLoading ? "Loading..." : staffName}
              </h1>

              <p className="mt-1 text-[11.5px] font-medium text-muted-foreground">
                Detailed attendance history and leave records.
              </p>
            </div>

            {/* Back */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/attendance/staff")}
              className="h-auto shrink-0 rounded-none bg-transparent px-0 py-1 text-[12px] font-semibold text-muted-foreground shadow-none hover:bg-transparent hover:text-primary"
            >
              <span className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>Back to staff attendance</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================
          STATISTICS
      ========================================================= */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {/* Total Records */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-border/70 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.12] text-primary">
            <FileText
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Records
            </span>

            <strong className="text-[20px] font-semibold leading-none text-primary">
              {totalRecords}
            </strong>
          </div>
        </div>

        {/* Full Absences */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-destructive/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-destructive/[0.12] text-destructive">
            <CalendarX
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Full Absences
            </span>

            <strong className="text-[20px] font-semibold leading-none text-destructive">
              {totalAbsences}
            </strong>
          </div>
        </div>

        {/* Days On Leave */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-warning/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.12] text-warning">
            <CheckCircle2
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Days On Leave
            </span>

            <strong className="text-[20px] font-semibold leading-none text-warning">
              {totalLeaves}
            </strong>
          </div>
        </div>

        {/* Partial Absences */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-info/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.12] text-info">
            <Clock
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Partial Absences
            </span>

            <strong className="text-[20px] font-semibold leading-none text-info">
              {partialAbsences}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================================
          ATTENDANCE TIMELINE
      ========================================================= */}
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">
              Attendance timeline
            </h2>

            <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `Showing ${historyRecords.length} attendance records`}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[40%]" />
            </colgroup>

            <thead className="bg-muted/40">
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="h-12 px-6 text-start">
                  Date
                </th>

                <th className="h-12 px-6 text-start">
                  Attendance
                </th>

                <th className="h-12 px-6 text-start">
                  Type
                </th>

                <th className="h-12 px-6 text-start">
                  Additional Details
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-t border-border/50"
                  >
                    <td
                      colSpan={4}
                      className="px-6 py-4"
                    >
                      <div className="h-10 animate-pulse rounded-[12px] bg-muted/50" />
                    </td>
                  </tr>
                ))
              ) : historyRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground"
                  >
                    No attendance history found for this
                    staff member.
                  </td>
                </tr>
              ) : (
                historyRecords.map((record: any) => (
                  <tr
                    key={record.id}
                    className="border-t border-border/50 text-[12.5px] transition-colors hover:bg-muted/30"
                  >
                    {/* Date */}
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatDate(record.attendance_date)}
                    </td>

                    {/* Attendance */}
                    <td className="px-6 py-4">
                      <span
                        className={
                          record.status === "present"
                            ? "font-semibold text-success"
                            : record.status === "absent"
                              ? "font-semibold text-destructive"
                              : record.status === "on_leave"
                                ? "font-semibold text-warning"
                                : "font-semibold text-info"
                        }
                      >
                        {String(record.status || "")
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (char) =>
                            char.toUpperCase(),
                          )}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      {record.absence_type ? (
                        <span
                          className={`font-medium ${
                            record.absence_type === "excused"
                              ? "text-info"
                              : record.absence_type === "unexcused"
                                ? "text-warning"
                                : "text-muted-foreground"
                          }`}
                        >
                          {record.absence_type}
                        </span>
                      ) : (
                        <span className="font-medium text-muted-foreground/60">
                          —
                        </span>
                      )}
                    </td>

                    {/* Additional Details */}
                    <td className="px-6 py-4">
                      {record.status === "on_leave" &&
                      record.leave ? (
                        <div className="w-max max-w-full rounded-[12px] border border-warning/25 bg-warning/10 p-2.5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11.5px] font-semibold text-warning">
                              Leave ID: #{record.leave.id}{" "}
                              <span className="font-medium opacity-70">
                                ({record.leave.days_count} Days)
                              </span>
                            </span>

                            <span className="text-[11px] font-medium text-warning/90">
                              From{" "}
                              {formatDate(
                                record.leave.start_date,
                              )}{" "}
                              to{" "}
                              {formatDate(
                                record.leave.end_date,
                              )}
                            </span>
                          </div>
                        </div>
                      ) : record.status ===
                          "partial_absence" &&
                        record.period_attendances?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {record.period_attendances.map(
                            (period: any, index: number) => (
                              <span
                                key={
                                  period.id ??
                                  period.schedule_entry_id ??
                                  index
                                }
                                className="rounded-[8px] border border-info/25 bg-info/10 px-2 py-1 text-[11px] font-medium text-info"
                              >
                                Period{" "}
                                {period.period_index ??
                                  period.schedule_entry?.period_index ??
                                  period.id}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] font-medium text-muted-foreground/60">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}