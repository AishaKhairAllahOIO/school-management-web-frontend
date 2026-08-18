import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Props = {
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
  grades?: { id: string | number; name: string }[];
  classrooms?: { id: string | number; name: string }[];
};

export function AttendanceFilters({
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
  grades = [],
  classrooms = [],
}: Props) {
  const triggerClass = "h-11 rounded-[13px] border-border/60 bg-background/80 text-[12px] text-foreground shadow-none";
  const absenceTypeEnabled = status === "absent";

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.35fr)_155px_165px_155px_170px]">
      <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
        <Search className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search student name"
          className={[triggerClass, "ps-9 text-foreground placeholder:text-muted-foreground"].join(" ")}
        />
      </div>

      <Select
        value={gradeFilter}
        onValueChange={(value) => {
          setGradeFilter(value);
          setClassroomFilter(""); 
        }}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Select Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All grades</SelectItem>
          {grades.map((grade) => (
            <SelectItem key={String(grade.id)} value={String(grade.id)}>
              {grade.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={classroomFilter}
        onValueChange={setClassroomFilter}
        disabled={gradeFilter === "all" || classrooms.length === 0}
      >
        <SelectTrigger
          className={[
            triggerClass,
            gradeFilter === "all" || classrooms.length === 0 ? "cursor-not-allowed opacity-55" : "",
          ].join(" ")}
        >
          <SelectValue placeholder={classrooms.length === 0 ? "No Classrooms" : "Select Classroom"} />
        </SelectTrigger>
        <SelectContent>
          {classrooms.map((classroom) => (
            <SelectItem key={String(classroom.id)} value={String(classroom.id)}>
              {classroom.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          if (value !== "absent") setAbsenceType("all");
        }}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Attendance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All attendance</SelectItem>
          <SelectItem value="present">Present</SelectItem>
          <SelectItem value="absent">Absent</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={absenceTypeEnabled ? absenceType : "all"}
        onValueChange={setAbsenceType}
        disabled={!absenceTypeEnabled}
      >
        <SelectTrigger
          className={[
            triggerClass,
            !absenceTypeEnabled ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
        >
          <SelectValue placeholder="Absence type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All absence types</SelectItem>
          <SelectItem value="excused">Excused</SelectItem>
          <SelectItem value="unexcused">Unexcused</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}