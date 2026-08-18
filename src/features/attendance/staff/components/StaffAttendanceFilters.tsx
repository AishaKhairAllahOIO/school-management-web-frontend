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
  role: string;
  setRole: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  absenceType: string;
  setAbsenceType: (value: string) => void;
};

export function AttendanceFilters({
  search,
  setSearch,
  role,
  setRole,
  status,
  setStatus,
  absenceType,
  setAbsenceType,
}: Props) {
  const controlClass = "h-11 rounded-[13px] border-border/60 bg-background/80 text-[12px] shadow-none";
  const absenceTypeEnabled = status === "Absent";

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(210px,1fr)_150px_145px_160px]">
      <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
        <Search
          className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.8}
        />
        <Input
          placeholder="Staff name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={[controlClass, "ps-9"].join(" ")}
        />
      </div>

      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className={controlClass}>
          <SelectValue placeholder="Staff type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All staff types</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          if (value !== "Absent") setAbsenceType("all");
        }}
      >
        <SelectTrigger className={controlClass}>
          <SelectValue placeholder="Attendance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All attendance</SelectItem>
          <SelectItem value="Present">Present</SelectItem>
          <SelectItem value="Absent">Absent</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={absenceTypeEnabled ? absenceType : "all"}
        onValueChange={setAbsenceType}
        disabled={!absenceTypeEnabled}
      >
        <SelectTrigger
          className={[
            controlClass,
            !absenceTypeEnabled ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
        >
          <SelectValue placeholder="Absence type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All absence types</SelectItem>
          <SelectItem value="Excused">Excused</SelectItem>
          <SelectItem value="Unexcused">Unexcused</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}