import { useNavigate } from "react-router-dom";
import { CalendarDays, User, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useStaffAttendanceHistory } from "../hooks/useStaffAttendance";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any; 
}

export const StaffDetailsDialog = ({ open, onOpenChange, staff }: Props) => {
  const navigate = useNavigate();
  
  const staffId = staff?.id;
  const { data: historyRecords = [], isLoading } = useStaffAttendanceHistory(staffId);

  if (!staff) return null;

  const roleString = String(staff.role || "Staff").replace("_", " ");
  const attendance = staff.attendance || {};
  const currentStatus = attendance.status || "present";
  
  const fullName = `${staff.user?.first_name || ""} ${staff.user?.last_name || ""}`.trim() || "Unknown Staff";
  const initials = fullName.substring(0, 2).toUpperCase();

  const totalAbsences = historyRecords.filter((r: any) => r.status === 'absent' || r.status === 'partial_absence').length;
  const unexcusedAbsences = historyRecords.filter((r: any) => r.absence_type === 'unexcused').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-[24px] border-border/70 bg-card text-card-foreground shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[17px] font-extrabold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Daily Summary & Stats
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* بطاقة الموظف */}
            <div className="flex items-center gap-4 rounded-[18px] border border-border/60 bg-muted/30 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-[16px] font-bold text-primary border border-primary/25">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-[14.5px] font-bold text-foreground truncate">{fullName}</h2>
                <p className="text-[11.5px] font-medium text-muted-foreground capitalize mt-0.5">{roleString}</p>
              </div>
            </div>

            {/* حالة اليوم */}
            <div className="rounded-[18px] border border-border/60 bg-muted/20 p-4 shadow-xs">
              <h4 className="font-bold text-[11.5px] text-muted-foreground mb-3 uppercase tracking-wider">Today's Status</h4>
              
              <div className={`flex items-center justify-between ${currentStatus !== 'present' ? 'border-b border-border/50 pb-3 mb-3' : ''} text-[13px]`}>
                <span className="font-semibold text-foreground">Attendance</span>
                <span className={`font-bold capitalize px-2.5 py-0.5 rounded-[8px] ${
                  currentStatus === 'present' ? 'text-success bg-success/15 border border-success/30' : 
                  currentStatus === 'absent' ? 'text-destructive bg-destructive/15 border border-destructive/30' : 
                  currentStatus === 'on_leave' ? 'text-warning bg-warning/15 border border-warning/30' : 
                  'text-primary bg-primary/15 border border-primary/30'
                }`}>
                  {currentStatus.replace('_', ' ')}
                </span>
              </div>

              {(currentStatus === 'absent' || currentStatus === 'partial_absence') && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-foreground">Absence Details</span>
                  <span className="font-bold capitalize text-foreground">
                    {attendance.absence_type || "N/A"}
                  </span>
                </div>
              )}
            </div>

            {/* الإحصائيات المستخرجة من سجلات الموظف */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[16px] bg-destructive/[0.08] border border-destructive/20 p-3.5 text-center">
                  <span className="block text-[11px] font-semibold text-destructive uppercase tracking-wider">Total Absences</span>
                  <span className="text-[20px] font-extrabold text-destructive mt-1 block">{totalAbsences}</span>
                </div>
                <div className="rounded-[16px] bg-warning/[0.08] border border-warning/20 p-3.5 text-center">
                  <span className="block text-[11px] font-semibold text-warning uppercase tracking-wider">Unexcused</span>
                  <span className="text-[20px] font-extrabold text-warning mt-1 block">{unexcusedAbsences}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="bg-muted/40 p-4 border-t border-border/60 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-9 rounded-[10px] text-[12.5px] font-semibold text-muted-foreground hover:text-foreground">
            Close
          </Button>
          <Button 
            onClick={() => {
              onOpenChange(false);
              navigate(`/attendance/staff/${staff.id}`);
            }} 
            className="h-9 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 shadow-sm text-[12.5px]"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Full History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};