import {
  Search,
} from "lucide-react";

import {
  Input,
} from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  StudentAttendance,
} from "../types/attendance.types";

type Props = {
  data: StudentAttendance[];

  search: string;
  setSearch: (value: string) => void;

  gradeFilter: string;
  setGradeFilter: (value: string) => void;

  classroomFilter: string;
  setClassroomFilter: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  absenceType: string;
  setAbsenceType: (value: string) => void;
};

export function AttendanceFilters({
  data,
  search,
  setSearch,
  gradeFilter,
  setGradeFilter,
  classroomFilter,
  setClassroomFilter,
  status,
  setStatus,
  absenceType,
  setAbsenceType,
}: Props) {
  const gradeMap = new Map(
    data
      .filter((item) => item.gradeId)
      .map((item) => [
        item.gradeId,
        item.gradeName,
      ]),
  );

  const grades = Array.from(
    gradeMap.entries(),
  ).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );

  const classroomMap = new Map(
    data
      .filter(
        (item) =>
          item.classroomId &&
          (gradeFilter === "all" ||
            item.gradeId === gradeFilter),
      )
      .map((item) => [
        item.classroomId!,
        item.classroomName ?? "Classroom",
      ]),
  );

  const classrooms = Array.from(
    classroomMap.entries(),
  ).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );

  const triggerClass =
    "h-11 rounded-[13px] border-border/60 bg-background/80 text-[12px] shadow-none";

  const absenceTypeEnabled =
    status === "Absent";

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.35fr)_155px_165px_155px_170px]">
      <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
        <Search className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search student name"
          className={[
            triggerClass,
            "ps-9",
          ].join(" ")}
        />
      </div>

      <Select
        value={gradeFilter}
        onValueChange={(value) => {
          setGradeFilter(value);
          setClassroomFilter("all");
        }}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Grade" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All grades
          </SelectItem>

          {grades.map(
            ([gradeId, gradeName]) => (
              <SelectItem
                key={gradeId}
                value={gradeId || "all"}
              >
                {gradeName}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        value={classroomFilter}
        onValueChange={setClassroomFilter}
        disabled={gradeFilter === "all"}
      >
        <SelectTrigger
          className={[
            triggerClass,
            gradeFilter === "all"
              ? "cursor-not-allowed opacity-55"
              : "",
          ].join(" ")}
        >
          <SelectValue
            placeholder="Classroom"
          />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All classrooms
          </SelectItem>

          {classrooms.map(
            ([
              classroomId,
              classroomName,
            ]) => (
              <SelectItem
                key={classroomId}
                value={classroomId}
              >
                {classroomName}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);

          if (value !== "Absent") {
            setAbsenceType("all");
          }
        }}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Attendance" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All attendance
          </SelectItem>
          <SelectItem value="Present">
            Present
          </SelectItem>
          <SelectItem value="Absent">
            Absent
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          absenceTypeEnabled
            ? absenceType
            : "all"
        }
        onValueChange={setAbsenceType}
        disabled={!absenceTypeEnabled}
      >
        <SelectTrigger
          className={[
            triggerClass,
            !absenceTypeEnabled
              ? "cursor-not-allowed opacity-50"
              : "",
          ].join(" ")}
        >
          <SelectValue placeholder="Absence type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All absence types
          </SelectItem>
          <SelectItem value="Excused">
            Excused
          </SelectItem>
          <SelectItem value="Unexcused">
            Unexcused
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
