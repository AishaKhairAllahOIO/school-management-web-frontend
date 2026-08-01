import { CalendarCheck2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";

import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import type { StudentAttendance } from "../types/attendance.types";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

export function StudentAttendancePage() {
  const attendanceQuery = useStudentAttendance();
  const [records, setRecords] = useState<StudentAttendance[]>([]);

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [supervisorFilter, setSupervisorFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (attendanceQuery.data) setRecords(attendanceQuery.data);
  }, [attendanceQuery.data]);

  const selectedDateRecords = useMemo(
    () => records.filter((student) => student.date === selectedDate),
    [records, selectedDate],
  );

  const filteredData = useMemo(
    () =>
      selectedDateRecords.filter((student) => {
        const normalizedSearch = search.trim().toLowerCase();

        return (
          (!normalizedSearch || student.studentName.toLowerCase().includes(normalizedSearch)) &&
          (gradeFilter === "all" || student.className === gradeFilter) &&
          (classroomFilter === "all" || student.section === classroomFilter) &&
          (supervisorFilter === "all" || student.supervisorName === supervisorFilter) &&
          (status === "all" || student.status === status) &&
          (status !== "Absent" || absenceType === "all" || student.absenceType === absenceType)
        );
      }),
    [
      selectedDateRecords,
      search,
      gradeFilter,
      classroomFilter,
      supervisorFilter,
      status,
      absenceType,
    ],
  );

  const isInitialLoading = attendanceQuery.isLoading && attendanceQuery.data === undefined;
  const present = filteredData.filter((item) => item.status === "Present").length;
  const absent = filteredData.filter((item) => item.status === "Absent").length;
  const excused = filteredData.filter((item) => item.absenceType === "Excused").length;
  const unexcused = filteredData.filter((item) => item.absenceType === "Unexcused").length;

  function updateRecord(
    id: string,
    patch: Partial<Pick<StudentAttendance, "status" | "absenceType">>,
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
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            classroomFilter={classroomFilter}
            setClassroomFilter={setClassroomFilter}
            supervisorFilter={supervisorFilter}
            setSupervisorFilter={setSupervisorFilter}
            status={status}
            setStatus={setStatus}
            absenceType={absenceType}
            setAbsenceType={setAbsenceType}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border/45 bg-muted/[0.12] px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
              <CalendarCheck2 className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-foreground">Daily attendance date</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Choose the working date, apply it, then save attendance changes.
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
              className="h-11 rounded-[13px] border-primary/20 bg-card px-4 text-primary hover:bg-primary/[0.06]"
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
          Attendance changes saved at {savedAt}.
        </p>
      ) : null}

      <AttendanceStats
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <AttendanceTable
        data={filteredData}
        isLoading={isInitialLoading}
        onUpdate={updateRecord}
      />
    </section>
  );
}
