import { CalendarDays, Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type { StudentAttendance } from "../types/attendance.types";

type Props = {
  data: StudentAttendance[];
  search: string;
  setSearch: (value: string) => void;
  gradeFilter: string;
  setGradeFilter: (value: string) => void;
  classroomFilter: string;
  setClassroomFilter: (value: string) => void;
  advisorFilter: string;
  setAdvisorFilter: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  absenceType: string;
  setAbsenceType: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
};

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function AttendanceFilters({
  data,
  search,
  setSearch,
  gradeFilter,
  setGradeFilter,
  classroomFilter,
  setClassroomFilter,
  advisorFilter,
  setAdvisorFilter,
  status,
  setStatus,
  absenceType,
  setAbsenceType,
  date,
  setDate,
}: Props) {
  const grades = unique(data.map((item) => item.className));
  const classrooms = unique(data.map((item) => item.section));
  const advisors = unique(data.map((item) => item.advisorName));
  const triggerClass =
    "h-10 rounded-[13px] border-border/60 bg-background/80 text-[11px] shadow-none";

  return (
    <div className="grid gap-2.5 lg:grid-cols-2 2xl:grid-cols-[minmax(220px,1fr)_120px_130px_145px_130px_145px_150px]">
      <div className="relative min-w-0 lg:col-span-2 2xl:col-span-1">
        <Search className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search student..."
          className={[triggerClass, "ps-9"].join(" ")}
        />
      </div>

      <Select value={gradeFilter} onValueChange={setGradeFilter}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All grades</SelectItem>
          {grades.map((grade) => (
            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={classroomFilter} onValueChange={setClassroomFilter}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Classroom" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All classrooms</SelectItem>
          {classrooms.map((classroom) => (
            <SelectItem key={classroom} value={classroom}>Classroom {classroom}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={advisorFilter} onValueChange={setAdvisorFilter}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Advisor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All advisors</SelectItem>
          {advisors.map((advisor) => (
            <SelectItem key={advisor} value={advisor}>{advisor}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Attendance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All attendance</SelectItem>
          <SelectItem value="Present">Present</SelectItem>
          <SelectItem value="Absent">Absent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={absenceType} onValueChange={setAbsenceType}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Absence type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All absence types</SelectItem>
          <SelectItem value="Excused">Excused</SelectItem>
          <SelectItem value="Unexcused">Unexcused</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative min-w-0">
        <CalendarDays className="pointer-events-none absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={[triggerClass, "ps-9"].join(" ")}
          aria-label="Attendance date"
        />
      </div>
    </div>
  );
}
