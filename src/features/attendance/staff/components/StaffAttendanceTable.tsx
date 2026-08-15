import { Eye } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import { Button } from "@/shared/ui/button"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"; 
import type { StaffAbsenceType, StaffDailyRosterRecord, StaffAttendanceStatus } from "../types/staffAttendance.types"; 
 
type Props = { 
  data: StaffDailyRosterRecord[]; 
  isLoading?: boolean; 
  onUpdate: ( 
    staffId: number, 
    patch: Partial<Pick<StaffDailyRosterRecord["attendance"], "status" | "absence_type">>, 
  ) => void; 
}; 
 
const inlineControlClass = "h-9 rounded-[11px] border-border/55 bg-background/80 text-[12px] shadow-none"; 
 
export function StaffAttendanceTable({ data, isLoading = false, onUpdate }: Props) { 
  return ( 
    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]"> 
      <div className="border-b border-border/50 px-5 py-4"> 
        <h3 className="text-[15px] font-semibold text-foreground">Staff attendance</h3> 
        <p className="mt-0.5 text-[12px] text-muted-foreground"> 
          {isLoading ? "Loading records" : `${data.length} staff members for the selected date`} 
        </p> 
      </div> 
 
      <div className="overflow-x-auto"> 
        <table className="w-full table-fixed min-w-[700px]"> 
          <colgroup> 
            <col className="w-[25%]" /> 
            <col className="w-[20%]" /> 
            <col className="w-[25%]" /> 
            <col className="w-[20%]" /> 
            <col className="w-[10%]" /> 
          </colgroup> 
 
          <thead className="bg-muted/[0.28]"> 
            <tr className="text-[10px] font-semibold uppercase tracking-[0.075em] text-muted-foreground"> 
              <th className="h-11 px-4 text-start">Staff Member</th> 
              <th className="h-11 px-4 text-start">Date</th> 
              <th className="h-11 px-4 text-start">Attendance Status</th> 
              <th className="h-11 px-4 text-start">Absence Type</th> 
              <th className="h-11 px-3 text-center">Actions</th> 
            </tr> 
          </thead> 
 
          <tbody> 
            {isLoading 
              ? Array.from({ length: 5 }).map((_, index) => ( 
                  <tr key={index} className="border-t border-border/45"> 
                    <td colSpan={5} className="px-4 py-3.5"> 
                      <div className="h-10 animate-pulse rounded-[10px] bg-muted/45" /> 
                    </td> 
                  </tr> 
                )) 
              : data.map((item) => ( 
                  <tr key={item.id} className="border-t border-border/45 text-[12px] text-foreground transition-colors hover:bg-muted/[0.22]"> 
                    <td className="px-4 py-3.5"> 
                      <div className="flex min-w-0 items-center gap-3"> 
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.09] text-[12px] font-semibold text-info"> 
                          {item.id} 
                        </span> 
                        <div className="min-w-0"> 
                          <p className="truncate font-medium text-foreground">
                            {item.user?.first_name} {item.user?.last_name}
                          </p> 
                          <p className="truncate text-[10px] text-muted-foreground">Staff #{item.id}</p> 
                        </div> 
                      </div> 
                    </td> 
 
                    <td className="px-4 py-3.5 text-muted-foreground">{item.attendance?.attendance_date}</td> 
 
                    <td className="px-4 py-3.5"> 
                      <Select 
                        value={item.attendance?.status || "present"} 
                        onValueChange={(value) => 
                          onUpdate(item.id, { 
                            status: value as StaffAttendanceStatus, 
                            absence_type: value === "present" ? null : (item.attendance?.absence_type ?? "excused"), 
                          }) 
                        } 
                      > 
                        <SelectTrigger className={inlineControlClass}><SelectValue /></SelectTrigger> 
                        <SelectContent> 
                          <SelectItem value="present">Present</SelectItem> 
                          <SelectItem value="absent">Absent</SelectItem> 
                          <SelectItem value="partial_absence">Partial Absence</SelectItem> 
                        </SelectContent> 
                      </Select> 
                    </td> 
 
                    <td className="px-4 py-3.5"> 
                      {(item.attendance?.status || "present") !== "present" ? ( 
                        <Select 
                          value={item.attendance?.absence_type ?? "excused"} 
                          onValueChange={(value) => onUpdate(item.id, { absence_type: value as StaffAbsenceType })} 
                        > 
                          <SelectTrigger className={inlineControlClass}><SelectValue /></SelectTrigger> 
                          <SelectContent> 
                            <SelectItem value="excused">Excused</SelectItem> 
                            <SelectItem value="unexcused">Unexcused</SelectItem> 
                          </SelectContent> 
                        </Select> 
                      ) : ( 
                        <span className="text-muted-foreground">—</span> 
                      )} 
                    </td> 
 
                    <td className="px-3 py-3.5 text-center"> 
                      <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full border-info/15 text-info hover:bg-info/[0.06]"> 
                        <Link to={`/attendance/staff/${item.id}`} aria-label={`View history`}> 
                          <Eye className="h-4 w-4" /> 
                        </Link> 
                      </Button> 
                    </td> 
                  </tr> 
                ))} 
          </tbody> 
        </table> 
      </div> 
    </div> 
  ); 
}