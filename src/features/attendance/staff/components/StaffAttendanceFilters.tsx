import { CalendarDays, Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type { StaffAttendance } from "../types/staffAttendance.types";

type Props = {
  data: StaffAttendance[];
  search: string;
  setSearch: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  absenceType: string;
  setAbsenceType: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
};

export function AttendanceFilters({
  data,
  search,
  setSearch,
  role,
  setRole,
  status,
  setStatus,
  absenceType,
  setAbsenceType,
  date,
  setDate,
}: Props) {
  const controlClass =
    "h-10 rounded-[13px] border-border/60 bg-background/80 text-[11px] shadow-none";
  const roles = [...new Set(data.map((item) => item.role))];

  return (
    <div className="grid gap-2.5 lg:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_120px_120px_135px_145px]">
      <div className="relative min-w-0 lg:col-span-2 xl:col-span-1">
        <Search className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
        <Input
          placeholder="Search staff member..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={[controlClass, "ps-9"].join(" ")}
        />
      </div>

      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className={controlClass}><SelectValue placeholder="Staff type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All staff types</SelectItem>
          {roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className={controlClass}><SelectValue placeholder="Attendance" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All attendance</SelectItem>
          <SelectItem value="Present">Present</SelectItem>
          <SelectItem value="Absent">Absent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={absenceType} onValueChange={setAbsenceType}>
        <SelectTrigger className={controlClass}><SelectValue placeholder="Absence type" /></SelectTrigger>
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
          className={[controlClass, "ps-9"].join(" ")}
          aria-label="Staff attendance date"
        />
      </div>
    </div>
  );
}
