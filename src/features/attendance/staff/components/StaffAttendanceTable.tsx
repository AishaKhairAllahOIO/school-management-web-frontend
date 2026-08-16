import { Eye, ChevronDown } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import { Button } from "@/shared/ui/button"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { StaffAbsenceType, StaffDailyRosterRecord, StaffAttendanceStatus } from "../types/staffAttendance.types"; 
 
type Props = { 
  data: StaffDailyRosterRecord[]; 
  isLoading?: boolean; 
  onUpdate: ( 
    staffId: number, 
    patch: { status: StaffAttendanceStatus; absence_type?: StaffAbsenceType | null; missing_periods?: number[] }, 
  ) => void; 
}; 
 
const inlineControlClass = "h-9 w-full rounded-[11px] border-border/55 bg-background/80 text-[12px] shadow-none"; 
const PERIODS = [1, 2, 3, 4, 5, 6, 7]; 
 
const extractStaffRole = (item: any): string => {

  const directRole = item.role || item.user?.role || item.position || item.job_title;
  if (directRole) {
    if (Array.isArray(directRole)) return String(directRole[0] || "Staff");
    if (typeof directRole === 'object') return String(directRole.name || directRole.title || "Staff");
    return String(directRole);
  }

  // 2. فحص علاقة الـ roles (شائعة جداً في Laravel Spatie مثل user.roles أو item.roles)
  const rolesArr = item.roles || item.user?.roles;
  if (Array.isArray(rolesArr) && rolesArr.length > 0) {
    const first = rolesArr[0];
    if (typeof first === 'object') return String(first.name || first.title || "Staff");
    return String(first);
  }

  return "Staff";
};

export function StaffAttendanceTable({ data, isLoading = false, onUpdate }: Props) { 
  return ( 
    <div className="w-full overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]"> 
      <div className="border-b border-border/50 px-5 py-4"> 
        <h3 className="text-[15px] font-semibold text-foreground">Staff attendance</h3> 
        <p className="mt-0.5 text-[12px] text-muted-foreground"> 
          {isLoading ? "Loading records" : `${data.length} staff members for the selected date`} 
        </p> 
      </div> 
 
      <div className="w-full overflow-x-auto"> 
        <table className="w-full min-w-[780px] table-fixed border-collapse"> 
          <colgroup> 
            <col className="w-[24%]" /> 
            <col className="w-[14%]" /> 
            <col className="w-[18%]" /> 
            <col className="w-[18%]" /> 
            <col className="w-[18%]" /> 
            <col className="w-[8%]" /> 
          </colgroup> 
 
          <thead className="bg-muted/[0.28]"> 
            <tr className="text-[10px] font-semibold uppercase tracking-[0.075em] text-muted-foreground"> 
              <th className="h-11 px-4 text-start">Staff Member</th> 
              <th className="h-11 px-3 text-start">Date</th> 
              <th className="h-11 px-3 text-start">Status</th> 
              <th className="h-11 px-3 text-start">Absence Type</th> 
              <th className="h-11 px-3 text-start">Missing Periods</th> 
              <th className="h-11 px-2 text-center">Actions</th> 
            </tr> 
          </thead> 
 
          <tbody className="divide-y divide-border/40"> 
            {isLoading 
              ? Array.from({ length: 5 }).map((_, index) => ( 
                  <tr key={index}> 
                    <td colSpan={6} className="px-4 py-3.5"> 
                      <div className="h-10 w-full animate-pulse rounded-[10px] bg-muted/45" /> 
                    </td> 
                  </tr> 
                )) 
              : data.map((item, index) => {
                  const isPresent = item.attendance?.id === null || item.attendance?.status === "present";
                  const currentStatus = isPresent ? "present" : (item.attendance?.status || "present");
                  const currentPeriods = item.attendance?.missing_periods || [];

                  // استخراج الرول الحقيقي عبر الدالة الذكية
                  const roleString = extractStaffRole(item);
                  const isTeacher = roleString.toLowerCase().includes('teach') || roleString.includes('معلم');

                  return (
                  <tr key={item.id} className="text-[12px] text-foreground transition-colors hover:bg-muted/[0.22]"> 
                    <td className="px-4 py-3.5"> 
                      <div className="flex items-center gap-2.5 min-w-0"> 
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-info/[0.09] text-[11px] font-semibold text-info"> 
                          {index + 1} 
                        </span> 
                        <div className="min-w-0 truncate"> 
                          <p className="truncate font-medium text-foreground">
                            {item.user?.first_name} {item.user?.last_name}
                          </p> 
                          <p className="truncate text-[10px] text-muted-foreground capitalize">
                            {roleString}
                          </p>
                        </div> 
                      </div> 
                    </td> 
 
                    <td className="px-3 py-3.5 text-muted-foreground truncate">
                      {item.attendance?.attendance_date || "—"}
                    </td> 
 
                    <td className="px-3 py-3.5"> 
                      <Select 
                        value={currentStatus} 
                        onValueChange={(value) => {
                          if (value === "partial_absence") {
                            onUpdate(item.id, { 
                              status: "partial_absence", 
                              absence_type: item.attendance?.absence_type ?? "excused",
                              missing_periods: currentPeriods.length > 0 ? currentPeriods : [1] 
                            });
                          } else {
                            onUpdate(item.id, { 
                              status: value as StaffAttendanceStatus, 
                              absence_type: value === "present" ? null : (item.attendance?.absence_type ?? "excused"),
                              missing_periods: []
                            });
                          }
                        }} 
                      > 
                        <SelectTrigger className={inlineControlClass}><SelectValue /></SelectTrigger> 
                        <SelectContent> 
                          <SelectItem value="present">Present</SelectItem> 
                          <SelectItem value="absent">Absent</SelectItem> 
                          {isTeacher && <SelectItem value="partial_absence">Partial Absence</SelectItem>}
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent> 
                      </Select> 
                    </td> 
 
                    <td className="px-3 py-3.5"> 
                      {currentStatus === "absent" || currentStatus === "partial_absence" ? ( 
                        <Select 
                          value={item.attendance?.absence_type ?? "excused"} 
                          onValueChange={(value) => onUpdate(item.id, { 
                            status: currentStatus as StaffAttendanceStatus,
                            absence_type: value as StaffAbsenceType,
                            missing_periods: currentPeriods
                          })} 
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

                    <td className="px-3 py-3.5">
                      {currentStatus === "partial_absence" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={`${inlineControlClass} justify-between font-normal hover:bg-background/90`}>
                              <span className="truncate">
                                {currentPeriods.length > 0 ? `P: ${[...currentPeriods].sort().join(", ")}` : "Select..."}
                              </span>
                              <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ms-1" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[170px] p-2.5" align="start">
                            <div className="grid grid-cols-4 gap-1.5">
                              {PERIODS.map(p => {
                                const isSelected = currentPeriods.includes(p);
                                return (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                      const newPeriods = isSelected ? currentPeriods.filter(x => x !== p) : [...currentPeriods, p];
                                      if (newPeriods.length === 0) return; 

                                      onUpdate(item.id, { 
                                        status: "partial_absence", 
                                        absence_type: item.attendance?.absence_type ?? "excused",
                                        missing_periods: newPeriods 
                                      });
                                    }}
                                    className={`flex h-7 items-center justify-center rounded-md text-[11px] font-semibold transition-colors ${
                                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-foreground/10"
                                    }`}
                                  >
                                    {p}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="mt-2 text-center text-[10px] text-muted-foreground">Click to toggle</p>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
 
                    <td className="px-2 py-3.5 text-center"> 
                      <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full border-info/15 text-info hover:bg-info/[0.06]"> 
                        <Link to={`/attendance/staff/${item.id}`} aria-label={`View history`}> 
                          <Eye className="h-3.5 w-3.5" /> 
                        </Link> 
                      </Button> 
                    </td> 
                  </tr> 
                )})} 
          </tbody> 
        </table> 
      </div> 
    </div> 
  ); 
}