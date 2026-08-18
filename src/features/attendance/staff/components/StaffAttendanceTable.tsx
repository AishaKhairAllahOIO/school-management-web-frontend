import { Eye, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Button } from "@/shared/ui/button"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { StaffDailyRosterRecord } from "../types/staffAttendance.types"; 
 
type PaginationInfo = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
};

type Props = { 
  data: StaffDailyRosterRecord[]; 
  teacherSchedule?: any; 
  currentDay?: string;
  isLoading?: boolean; 
  pendingEdits: Record<number, any>; 
  onUpdateLocal: (staffId: number, field: string, value: any) => void; 
  onViewDetails: (staff: StaffDailyRosterRecord) => void;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}; 

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "present":
      return "text-emerald-700 font-medium bg-emerald-50/60 border border-emerald-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    case "absent":
      return "text-rose-700 font-medium bg-rose-50/60 border border-rose-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    case "partial_absence":
      return "text-violet-700 font-medium bg-violet-50/60 border border-violet-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    case "on_leave":
      return "text-amber-700 font-medium bg-amber-50/60 border border-amber-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    default:
      return "text-slate-700 font-medium bg-slate-50/60 border border-slate-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
  }
};

const getAbsenceBadgeStyles = (type: string) => {
  switch (type) {
    case "excused":
      return "text-sky-700 font-medium bg-sky-50/60 border border-sky-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    case "unexcused":
      return "text-amber-700 font-medium bg-amber-50/60 border border-amber-200/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
    default:
      return "text-muted-foreground bg-background border border-border/50 rounded-[10px] shadow-none focus:ring-0 focus:outline-none";
  }
};
 
export function StaffAttendanceTable({ 
  data = [], 
  teacherSchedule, 
  currentDay,
  isLoading = false, 
  pendingEdits, 
  onUpdateLocal, 
  onViewDetails,
  pagination,
  onPageChange 
}: Props) { 
  const safeData = Array.isArray(data) ? data : [];

  return ( 
    <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm"> 
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4"> 
        <div>
          <h3 className="text-[15px] font-bold tracking-tight text-foreground">Staff attendance</h3> 
          <p className="mt-0.5 text-[12px] font-medium text-muted-foreground"> 
            {isLoading ? "Loading records..." : `Showing ${pagination.total > 0 ? pagination.from : 0} to ${pagination.to} of ${pagination.total} staff members`} 
          </p> 
        </div>
      </div> 
 
      <div className="w-full overflow-x-auto"> 
        <table className="w-full min-w-[760px] table-fixed"> 
          <colgroup> 
            <col className="w-[30%]" /> 
            <col className="w-[20%]" /> 
            <col className="w-[20%]" /> 
            <col className="w-[20%]" /> 
            <col className="w-[10%]" /> 
          </colgroup> 
 
          <thead className="bg-muted/40"> 
            <tr className="text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground"> 
              <th className="h-12 px-6 text-start">Staff Member</th> 
              <th className="h-12 px-4 text-start">Attendance</th> 
              <th className="h-12 px-4 text-start">Absence Type</th> 
              <th className="h-12 px-4 text-start">Periods</th> 
              <th className="h-12 px-6 text-center">Actions</th> 
            </tr> 
          </thead> 
 
          <tbody className="divide-y divide-border/50"> 
            {isLoading 
              ? Array.from({ length: 5 }).map((_, index) => ( 
                  <tr key={index} className="border-t border-border/50"> 
                    <td colSpan={5} className="px-6 py-4"> 
                      <div className="h-10 animate-pulse rounded-[12px] bg-muted/50" /> 
                    </td> 
                  </tr> 
                )) 
              : safeData.map((item, index) => {
                  const currentStatus = pendingEdits[item.id]?.status ?? (item?.attendance?.status || "present");
                  const currentAbsenceType = pendingEdits[item.id]?.absence_type ?? item?.attendance?.absence_type ?? "excused";
                  const currentPeriods = pendingEdits[item.id]?.missing_periods ?? item?.attendance?.missing_periods ?? [];
              
                  const roleString = String(item.role || "Staff").replace("_", " ");
                  const isTeacher = roleString.toLowerCase().includes('teach') || roleString.includes('معلم');

                  const highlightEdit = pendingEdits[item.id] ? 'bg-warning/[0.03]' : '';
                  const teacherScheduleEntries = teacherSchedule?.[item.user_id]?.[currentDay || ''] || [];
                  
                  // 🌟 تم إضافة on_leave إلى الحالات الثابتة
                  const standardStatuses = ["present", "absent", "partial_absence", "on_leave"];

                  return (
                  <tr key={item?.id || index} className={`border-t border-border/50 text-[13px] transition-colors hover:bg-muted/30 group ${highlightEdit}`}> 
                    <td className="px-6 py-3.5"> 
                      <div className="flex items-center gap-3 min-w-0"> 
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-violet-600/10 text-[13px] font-bold text-violet-700 border border-violet-600/20 uppercase"> 
                          {item?.user?.first_name?.charAt(0) || index + 1} 
                        </span> 
                        <div className="min-w-0"> 
                          <p className="truncate font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 transition-colors text-[12.5px]">
                            {item?.user?.first_name} {item?.user?.last_name}
                          </p> 
                          <p className="truncate text-[11px] font-medium text-muted-foreground capitalize mt-0.5">
                            {roleString}
                          </p>
                        </div> 
                      </div> 
                    </td> 
 
                    <td className="px-4 py-3.5"> 
                      <Select 
                        value={currentStatus} 
                        onValueChange={(value) => {
                          onUpdateLocal(item.id, 'status', value);
                          // 🌟 تصفير الحصص والأعذار في حال الحضور أو الإجازة
                          if (value === 'present' || value === 'on_leave') {
                            onUpdateLocal(item.id, 'absence_type', null);
                            onUpdateLocal(item.id, 'missing_periods', []);
                          } else if (value === 'partial_absence' && currentPeriods.length === 0) {
                            onUpdateLocal(item.id, 'missing_periods', []);
                          }
                        }} 
                      > 
                        <SelectTrigger className={`h-8 w-[120px] text-[11.5px] px-3 transition-all ${getStatusBadgeStyles(currentStatus)}`}>
                          <SelectValue />
                        </SelectTrigger> 
                        <SelectContent> 
                          <SelectItem value="present" className="font-medium text-emerald-700 focus:text-emerald-800">Present</SelectItem> 
                          <SelectItem value="absent" className="font-medium text-rose-700 focus:text-rose-800">Absent</SelectItem> 
                          {isTeacher && <SelectItem value="partial_absence" className="font-medium text-violet-700 focus:text-violet-800">Partial Absence</SelectItem>}
                          
                          {/* 🌟 خيار الـ On Leave */}
                          <SelectItem value="on_leave" className="font-medium text-amber-700 focus:text-amber-800">On Leave</SelectItem>
                          
                          {!standardStatuses.includes(currentStatus) && (
                            <SelectItem value={currentStatus} disabled className="font-medium text-amber-700 capitalize">
                              {currentStatus.replace('_', ' ')}
                            </SelectItem>
                          )}
                        </SelectContent> 
                      </Select> 
                    </td> 
 
                    <td className="px-4 py-3.5"> 
                      {currentStatus === "absent" || currentStatus === "partial_absence" ? ( 
                        <Select 
                          value={currentAbsenceType} 
                          onValueChange={(value) => onUpdateLocal(item.id, 'absence_type', value)} 
                        > 
                          <SelectTrigger className={`h-8 w-[110px] text-[11.5px] px-3 transition-all ${getAbsenceBadgeStyles(currentAbsenceType)}`}>
                            <SelectValue />
                          </SelectTrigger> 
                          <SelectContent> 
                            <SelectItem value="excused" className="font-medium text-sky-700 focus:text-sky-800">Excused</SelectItem> 
                            <SelectItem value="unexcused" className="font-medium text-amber-700 focus:text-amber-800">Unexcused</SelectItem> 
                          </SelectContent> 
                        </Select> 
                      ) : ( 
                        <span className="text-muted-foreground font-medium">—</span> 
                      )} 
                    </td> 

                    <td className="px-4 py-3.5"> 
                      {isTeacher ? (
                        currentStatus === "partial_absence" ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-8 px-2.5 rounded-[10px] border-violet-200 bg-violet-50/50 text-violet-700 text-[11px] font-semibold hover:bg-violet-100/50 transition-colors">
                                {currentPeriods.length > 0 ? `P: ${currentPeriods.length} selected` : "Select Periods"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-3 rounded-[16px]" align="start">
                              <div className="mb-2 px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Scheduled Periods</div>
                              
                              {teacherScheduleEntries.length > 0 ? (
                                <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto">
                                  {teacherScheduleEntries.map((period: any) => {
                                    const periodId = period.entry_id;
                                    const isSelected = currentPeriods.includes(periodId);
                                    
                                    return (
                                      <button
                                        key={periodId}
                                        type="button"
                                        onClick={() => {
                                          const newPeriods = isSelected 
                                            ? currentPeriods.filter((id: any) => id !== periodId) 
                                            : [...currentPeriods, periodId];
                                          onUpdateLocal(item.id, 'missing_periods', newPeriods);
                                        }}
                                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-[11.5px] font-semibold transition-all ${
                                          isSelected ? "bg-violet-600 text-white shadow-sm" : "bg-muted/50 text-foreground hover:bg-muted"
                                        }`}
                                      >
                                        <span>Period {period.period_index || ''}</span>
                                        {period.subject_name && <span className="text-[10px] opacity-80">{period.subject_name}</span>}
                                        <span>{period.start_time}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-[11px] text-muted-foreground text-center py-2">No periods found for this teacher today.</p>
                              )}
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-muted-foreground font-medium">—</span> 
                        )
                      ) : (
                        <span className="text-muted-foreground/50 text-[11px] font-medium uppercase tracking-wider">N/A</span>
                      )}
                    </td>
 
                    <td className="px-6 py-3.5 text-center"> 
                      <div className="flex items-center justify-center gap-1.5">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon" 
                          onClick={() => onViewDetails(item)}
                          className="h-8 w-8 rounded-[10px] border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
                          title="Quick Summary"
                        > 
                          <Eye className="h-4 w-4" /> 
                        </Button> 
                      </div>
                    </td> 
                  </tr> 
                )})} 
            {!isLoading && safeData.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground">No records match the selected filters.</td></tr>
            )}
          </tbody> 
        </table> 
      </div> 

      {pagination.lastPage >= 1 && (
        <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
          <p className="text-[12px] font-medium text-muted-foreground">
            Page {pagination.currentPage} of {pagination.lastPage}
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(pagination.currentPage - 1)} 
              disabled={pagination.currentPage <= 1 || isLoading} 
              className="h-8 rounded-[10px] text-[12px]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(pagination.currentPage + 1)} 
              disabled={pagination.currentPage >= pagination.lastPage || isLoading} 
              className="h-8 rounded-[10px] text-[12px]"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div> 
  ); 
}