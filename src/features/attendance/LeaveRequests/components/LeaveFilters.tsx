import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { LeaveTypeOption } from "./AddLeaveDialog"; 

type Props = {
  search: string;
  setSearch: (value: string) => void;
  leaveType: string;
  setLeaveType: (value: string) => void;
  leaveTypes: LeaveTypeOption[]; 
  compact?: boolean;
};

export function LeaveFilters({ search, setSearch, leaveType, setLeaveType, leaveTypes = [], compact = false }: Props) {
  const triggerClass = "h-11 rounded-[13px] border-border/60 bg-background text-foreground text-[12px] shadow-none";

  return (
    <div className={compact ? "grid gap-2" : "grid gap-2.5 md:grid-cols-[minmax(220px,1fr)_170px]"}>
      <div className="relative min-w-0">
        <Search className="absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
        <Input 
          value={search} 
          onChange={(event) => setSearch(event.target.value)} 
          placeholder="Search by staff ID or type..." 
          className={[triggerClass, "ps-9 placeholder:text-muted-foreground"].join(" ")} 
        />
      </div>

      <Select value={leaveType} onValueChange={setLeaveType}>
        <SelectTrigger className={triggerClass}><SelectValue placeholder="Leave type" /></SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground border-border">
          <SelectItem value="all">All types</SelectItem>
          {leaveTypes.map((type) => (
            <SelectItem key={type.id} value={String(type.id)}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}