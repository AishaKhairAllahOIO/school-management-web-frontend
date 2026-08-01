import { CalendarCheck2, Palmtree, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AddLeaveDialog } from "@/features/attendance/Leave Requests/components/AddLeaveDialog";
import { LeaveRequestsTable } from "@/features/attendance/Leave Requests/components/LeaveRequestsTable";
import { useLeaveRequests } from "@/features/attendance/Leave Requests/hooks/useLeaveRequests";
import type { LeaveRequest } from "@/features/attendance/Leave Requests/types/staffLeave.types";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { Input } from "@/shared/ui/input";

import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceFilters } from "../components/StaffAttendanceFilters";
import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { useStaffAttendance } from "../hooks/useStaffAttendance";
import type { StaffAttendance } from "../types/staffAttendance.types";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

export function StaffAttendancePage() {
  const attendanceQuery = useStaffAttendance();
  const leaveQuery = useLeaveRequests();

  const [records, setRecords] = useState<StaffAttendance[]>([]);
  const [vacations, setVacations] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [vacationSearch, setVacationSearch] = useState("");
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!attendanceQuery.data) return;

    setRecords(attendanceQuery.data);

    const firstDate = attendanceQuery.data[0]?.date;
    if (firstDate && !attendanceQuery.data.some((item) => item.date === selectedDate)) {
      setDraftDate(firstDate);
      setSelectedDate(firstDate);
    }
  }, [attendanceQuery.data, selectedDate]);

  useEffect(() => {
    if (leaveQuery.data) setVacations(leaveQuery.data);
  }, [leaveQuery.data]);

  const selectedDateRecords = useMemo(
    () => records.filter((employee) => employee.date === selectedDate),
    [records, selectedDate],
  );

  const filteredAttendance = useMemo(
    () =>
      selectedDateRecords.filter((employee) => {
        const normalizedSearch = search.trim().toLowerCase();

        return (
          (!normalizedSearch || employee.employeeName.toLowerCase().includes(normalizedSearch)) &&
          (role === "all" || employee.role === role) &&
          (status === "all" || employee.status === status) &&
          (status !== "Absent" || absenceType === "all" || employee.absenceType === absenceType)
        );
      }),
    [selectedDateRecords, search, role, status, absenceType],
  );

  const filteredVacations = useMemo(
    () =>
      vacations.filter((vacation) =>
        vacation.employeeName.toLowerCase().includes(vacationSearch.trim().toLowerCase()),
      ),
    [vacationSearch, vacations],
  );

  const present = filteredAttendance.filter((item) => item.status === "Present").length;
  const absent = filteredAttendance.filter((item) => item.status === "Absent").length;
  const excused = filteredAttendance.filter((item) => item.absenceType === "Excused").length;
  const unexcused = filteredAttendance.filter((item) => item.absenceType === "Unexcused").length;
  const isInitialLoading =
    (attendanceQuery.isLoading && attendanceQuery.data === undefined) ||
    (leaveQuery.isLoading && leaveQuery.data === undefined);

  function updateRecord(
    id: string,
    patch: Partial<
      Pick<
        StaffAttendance,
        "status" | "absenceType" | "attendedPeriods"
      >
    >,
  ) {
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== id) return record;

        const next = { ...record, ...patch };

        if (patch.status === "Present") {
          delete next.absenceType;
        }

        if (patch.status === "Absent") {
          next.absenceType = next.absenceType ?? "Excused";
        }

        return next;
      }),
    );

    setDirtyIds((current) => new Set(current).add(id));
    setSavedAt(null);
  }

  function applyDate() {
    if (!draftDate) return;
    setSelectedDate(draftDate);
    setDirtyIds(new Set());
    setSavedAt(null);
  }

  function saveAttendance() {
    if (dirtyIds.size === 0) return;
    setDirtyIds(new Set());
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  return (
    <section className="space-y-4 pt-5">
      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="p-4">
          <AttendanceFilters
            data={records}
            search={search}
            setSearch={setSearch}
            role={role}
            setRole={setRole}
            status={status}
            setStatus={setStatus}
            absenceType={absenceType}
            setAbsenceType={setAbsenceType}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border/45 bg-muted/[0.12] px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.08] text-info">
              <CalendarCheck2 className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-foreground">Daily staff attendance date</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Apply one date to the full table, then save all attendance changes together.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
            <DatePicker
              value={draftDate}
              onChange={setDraftDate}
              label="Attendance date"
              className="w-full sm:w-[220px]"
            />

            <Button
              type="button"
              variant="outline"
              onClick={applyDate}
              disabled={!draftDate || draftDate === selectedDate}
              className="h-11 rounded-[13px] border-info/20 bg-card px-4 text-info hover:bg-info/[0.06]"
            >
              Apply date
            </Button>

            <Button
              type="button"
              onClick={saveAttendance}
              disabled={dirtyIds.size === 0}
              className="h-11 rounded-[13px] px-5"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {savedAt ? (
        <p className="-mt-1 text-end text-[11px] font-medium text-success">
          Staff attendance changes saved at {savedAt}.
        </p>
      ) : null}

      <AttendanceStats
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(290px,1fr)]">
        <div className="min-w-0">
          <StaffAttendanceTable
            data={filteredAttendance}
            isLoading={isInitialLoading}
            onUpdate={updateRecord}
          />
        </div>

        <aside className="min-w-0 self-start overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.10] text-warning">
                <Palmtree className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">Vacation</h2>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  Search staff and add vacation directly.
                </p>
              </div>
            </div>

            <AddLeaveDialog
              onAdd={(vacation) => setVacations((current) => [vacation, ...current])}
            />
          </div>

          <div className="border-b border-border/45 p-3.5">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={vacationSearch}
                onChange={(event) => setVacationSearch(event.target.value)}
                placeholder="Search staff vacation..."
                className="h-10 rounded-[12px] border-border/60 bg-background/80 ps-8 text-[11px] shadow-none"
              />
            </div>
          </div>

          <LeaveRequestsTable
            data={filteredVacations}
            compact
            isLoading={isInitialLoading}
          />
        </aside>
      </div>
    </section>
  );
}
