import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { LeaveTypeOption } from "./AddLeaveDialog"; // استيراد النوع

type Props = {
  search: string;
  setSearch: (value: string) => void;
  leaveType: string;
  setLeaveType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  leaveTypes: LeaveTypeOption[]; // 👈 تم إضافة الأنواع الحقيقية هنا
  compact?: boolean;
};

export function LeaveFilters({ search, setSearch, leaveType, setLeaveType, status, setStatus, leaveTypes = [], compact = false }: Props) {
  const triggerClass = "h-9 rounded-[12px] border-border/60 bg-background/80 text-[11px] shadow-none";

  return (
    <div className={compact ? "grid gap-2" : "grid gap-2.5 md:grid-cols-[minmax(220px,1fr)_170px_150px]"}>
      <div className="relative min-w-0">
        <Search className="absolute start-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
        <Input 
          value={search} 
          onChange={(event) => setSearch(event.target.value)} 
          placeholder="Search by staff ID or type..." 
          className={[triggerClass, "ps-8"].join(" ")} 
        />
      </div>

      <div className={compact ? "grid grid-cols-2 gap-2" : "contents"}>
        <Select value={leaveType} onValueChange={setLeaveType}>
          <SelectTrigger className={triggerClass}><SelectValue placeholder="Leave type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {leaveTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={triggerClass}><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}