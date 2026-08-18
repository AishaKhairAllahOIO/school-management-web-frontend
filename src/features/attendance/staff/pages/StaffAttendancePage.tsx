import { CalendarDays, Save, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";

import { 
  useStaffAttendanceList,
  useCreateStaffAttendance, 
  useUpdateStaffAttendance, 
  useDeleteStaffAttendance
} from "../hooks/useStaffAttendance";

import { useTeacherSchedule, useCurrentAcademicPeriod } from "@/features/scheduling/class-schedules/hooks/useSchedule";

import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { StaffDetailsDialog } from "../components/StaffDetailsDialog";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

export function StaffAttendancePage() {
  const navigate = useNavigate();
  const [dateInput, setDateInput] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());
  const [page, setPage] = useState(1);
  const [pendingEdits, setPendingEdits] = useState<Record<number, any>>({});
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const { academicYearId, semesterId } = useCurrentAcademicPeriod();
  const { data: teacherSchedule } = useTeacherSchedule(academicYearId, semesterId);

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };
  const currentDay = getDayName(selectedDate);

  const { data: rosterResult, isLoading: isRosterLoading } = useStaffAttendanceList(selectedDate, page);
  
  const safeRosterData = rosterResult?.data || [];
  const paginationInfo = {
    currentPage: rosterResult?.currentPage || 1,
    lastPage: rosterResult?.lastPage || 1,
    total: rosterResult?.total || 0,
    from: rosterResult?.from || 0,
    to: rosterResult?.to || 0,
  };

  const createMutation = useCreateStaffAttendance();
  const updateMutation = useUpdateStaffAttendance();
  const deleteMutation = useDeleteStaffAttendance();

  const handleUpdateLocal = (staffId: number, field: string, value: any) => {
    setPendingEdits(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value
      }
    }));
  };

  const handleApplyDate = () => {
    setSelectedDate(dateInput);
    setPage(1);
  };

  const handleBulkSave = async () => {
    const promises = Object.entries(pendingEdits).map(async ([staffIdStr, edit]) => {
      const staffId = Number(staffIdStr);
      const existingRecord = safeRosterData.find((s: any) => s.id === staffId);
      const recordId = existingRecord?.attendance?.id;

      const finalStatus = edit.status ?? (existingRecord?.attendance?.status || "present");
      const finalAbsenceType = edit.absence_type ?? existingRecord?.attendance?.absence_type;
      const finalPeriods = edit.missing_periods ?? existingRecord?.attendance?.missing_periods;

      if (finalStatus === "present") {
        if (recordId) await deleteMutation.mutateAsync(recordId);
        return; 
      }

      const cleanMissingPeriods = finalStatus === "partial_absence" ? finalPeriods : undefined;

      if (recordId) {
        await updateMutation.mutateAsync({
          id: recordId,
          payload: { 
            status: finalStatus, 
            absence_type: finalStatus === "absent" ? finalAbsenceType : null, 
            missing_periods: cleanMissingPeriods 
          },
        });
      } else {
        await createMutation.mutateAsync({
          staff_id: staffId,
          attendance_date: selectedDate,
          status: finalStatus,
          absence_type: finalStatus === "absent" ? (finalAbsenceType || "excused") : null,
          missing_periods: cleanMissingPeriods,
        });
      }
    });

    try {
      await Promise.all(promises);
      setPendingEdits({});
    } catch (error) {
      console.error("Failed to save some attendances");
    }
  };

  const hasUnsavedChanges = Object.keys(pendingEdits).length > 0;

  return (
    <section className="space-y-5 pt-5 animate-in fade-in duration-300">
      
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between rounded-[22px] border border-border/70 bg-card p-5 shadow-sm">
        
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-violet-600/10 text-violet-700 border border-violet-600/25 shrink-0">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-[16px] font-extrabold tracking-tight text-foreground">Staff attendance</h2>
            <p className="text-[12px] text-muted-foreground font-medium mt-0.5">Select date, apply, then save changes.</p>
          </div>
        </div>

        {/* 🌟 محاذاة أفقية متطابقة تماماً لكل الأزرار */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/attendance/staff-leaves')}            
            className="h-10 px-4 rounded-[12px] border-border/70 text-foreground bg-background hover:bg-muted/50 font-semibold text-[13px]"
          >
            <FileText className="w-4 h-4 mr-1.5 text-primary" />
            Manage Leaves
          </Button>

          <DatePicker 
            value={dateInput} 
            onChange={setDateInput} 
            className="w-[160px] h-10 rounded-[12px]" 
          />

          <Button 
            variant="outline" 
            onClick={handleApplyDate}
            className="h-10 px-4 rounded-[12px] border-violet-600/30 text-violet-700 bg-violet-600/[0.04] hover:bg-violet-600/[0.1] font-semibold text-[13px]"
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            Apply
          </Button>

          <Button 
            onClick={handleBulkSave} 
            disabled={createMutation.isPending || updateMutation.isPending || !hasUpdatableChanges(hasUnsavedChanges)} 
            className={`h-10 px-5 rounded-[12px] bg-violet-600 hover:bg-violet-700 text-white font-bold text-[13px] shadow-sm transition-opacity ${!hasUnsavedChanges ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="flex items-center justify-between rounded-[18px] bg-warning/15 border border-warning/30 p-4 animate-in slide-in-from-top-2">
          <p className="text-sm font-semibold text-warning-foreground">You have unsaved changes in the table.</p>
          <Button variant="outline" size="sm" onClick={() => setPendingEdits({})} className="border-warning/50 hover:bg-warning/20">
            Discard
          </Button>
        </div>
      )}

      <StaffAttendanceTable 
        data={safeRosterData} 
        teacherSchedule={teacherSchedule}
        currentDay={currentDay}
        isLoading={isRosterLoading} 
        pendingEdits={pendingEdits}
        onUpdateLocal={handleUpdateLocal} 
        onViewDetails={setSelectedStaff}
        pagination={paginationInfo}
        onPageChange={setPage}
      />

      <StaffDetailsDialog 
        open={!!selectedStaff} 
        onOpenChange={(open) => !open && setSelectedStaff(null)} 
        staff={selectedStaff}
      />
    </section>
  );
}

function hasUpdatableChanges(val: boolean) {
  return val;
}