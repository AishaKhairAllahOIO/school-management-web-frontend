import { useEffect, useMemo, useState } from "react";

import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import type { StudentAttendance } from "../types/attendance.types";

export function StudentAttendancePage() {
  const attendanceQuery = useStudentAttendance();
  const [records, setRecords] = useState<StudentAttendance[]>([]);

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [advisorFilter, setAdvisorFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (attendanceQuery.data) setRecords(attendanceQuery.data);
  }, [attendanceQuery.data]);

  const filteredData = useMemo(
    () =>
      records.filter((student) => {
        const normalizedSearch = search.trim().toLowerCase();
        return (
          (!normalizedSearch || student.studentName.toLowerCase().includes(normalizedSearch)) &&
          (gradeFilter === "all" || student.className === gradeFilter) &&
          (classroomFilter === "all" || student.section === classroomFilter) &&
          (advisorFilter === "all" || student.advisorName === advisorFilter) &&
          (status === "all" || student.status === status) &&
          (absenceType === "all" || student.absenceType === absenceType) &&
          (!date || student.date === date)
        );
      }),
    [records, search, gradeFilter, classroomFilter, advisorFilter, status, absenceType, date],
  );

  const isInitialLoading = attendanceQuery.isLoading && attendanceQuery.data === undefined;
  const present = filteredData.filter((item) => item.status === "Present").length;
  const absent = filteredData.filter((item) => item.status === "Absent").length;
  const excused = filteredData.filter((item) => item.absenceType === "Excused").length;
  const unexcused = filteredData.filter((item) => item.absenceType === "Unexcused").length;

  function updateRecord(
    id: string,
    patch: Partial<Pick<StudentAttendance, "status" | "absenceType" | "date">>,
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
        total={filteredData.length}
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <div className="rounded-[18px] border border-border/60 bg-card p-3.5 shadow-[0_7px_24px_rgba(30,20,70,0.04)]">
        <AttendanceFilters
          data={records}
          search={search}
          setSearch={setSearch}
          gradeFilter={gradeFilter}
          setGradeFilter={setGradeFilter}
          classroomFilter={classroomFilter}
          setClassroomFilter={setClassroomFilter}
          advisorFilter={advisorFilter}
          setAdvisorFilter={setAdvisorFilter}
          status={status}
          setStatus={setStatus}
          absenceType={absenceType}
          setAbsenceType={setAbsenceType}
          date={date}
          setDate={setDate}
        />
      </div>

      <AttendanceTable data={filteredData} isLoading={isInitialLoading} onUpdate={updateRecord} />
    </section>
  );
}
