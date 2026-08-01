import { Palmtree, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AddLeaveDialog } from "@/features/attendance/Leave Requests/components/AddLeaveDialog";
import { LeaveRequestsTable } from "@/features/attendance/Leave Requests/components/LeaveRequestsTable";
import { useLeaveRequests } from "@/features/attendance/Leave Requests/hooks/useLeaveRequests";
import type { LeaveRequest } from "@/features/attendance/Leave Requests/types/staffLeave.types";
import { Input } from "@/shared/ui/input";

import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceFilters } from "../components/StaffAttendanceFilters";
import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { useStaffAttendance } from "../hooks/useStaffAttendance";
import type { StaffAttendance } from "../types/staffAttendance.types";

export function StaffAttendancePage() {
  const attendanceQuery = useStaffAttendance();
  const leaveQuery = useLeaveRequests();

  const [records, setRecords] = useState<StaffAttendance[]>([]);
  const [vacations, setVacations] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [date, setDate] = useState("");
  const [vacationSearch, setVacationSearch] = useState("");

  useEffect(() => {
    if (attendanceQuery.data) setRecords(attendanceQuery.data);
  }, [attendanceQuery.data]);

  useEffect(() => {
    if (leaveQuery.data) setVacations(leaveQuery.data);
  }, [leaveQuery.data]);

  const filteredAttendance = useMemo(
    () =>
      records.filter((employee) => {
        const normalizedSearch = search.trim().toLowerCase();
        return (
          (!normalizedSearch || employee.employeeName.toLowerCase().includes(normalizedSearch)) &&
          (role === "all" || employee.role === role) &&
          (status === "all" || employee.status === status) &&
          (absenceType === "all" || employee.absenceType === absenceType) &&
          (!date || employee.date === date)
        );
      }),
    [records, search, role, status, absenceType, date],
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
    patch: Partial<Pick<StaffAttendance, "status" | "absenceType" | "date" | "attendedPeriods">>,
  ) {
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== id) return record;
        const next = { ...record, ...patch };
        if (patch.status === "Present") delete next.absenceType;
        if (patch.status === "Absent" && !next.absenceType) next.absenceType = "Excused";
        return next;
      }),
    );
  }

  return (
    <section className="space-y-4 pt-1">
      <AttendanceStats
        total={filteredAttendance.length}
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-3">
          <div className="rounded-[18px] border border-border/60 bg-card p-3.5 shadow-[0_7px_24px_rgba(30,20,70,0.04)]">
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
              date={date}
              setDate={setDate}
            />
          </div>

          <StaffAttendanceTable
            data={filteredAttendance}
            isLoading={isInitialLoading}
            onUpdate={updateRecord}
          />
        </div>

        <aside className="min-w-0 self-start overflow-hidden rounded-[18px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.10] text-warning">
                <Palmtree className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">Vacation</h2>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Search staff and add vacation directly.</p>
              </div>
            </div>

            <AddLeaveDialog onAdd={(vacation) => setVacations((current) => [vacation, ...current])} />
          </div>

          <div className="border-b border-border/45 p-3.5">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={vacationSearch}
                onChange={(event) => setVacationSearch(event.target.value)}
                placeholder="Search staff vacation..."
                className="h-9 rounded-[12px] border-border/60 bg-background/80 ps-8 text-[11px] shadow-none"
              />
            </div>
          </div>

          <LeaveRequestsTable data={filteredVacations} compact isLoading={isInitialLoading} />
        </aside>
      </div>
    </section>
  );
}
