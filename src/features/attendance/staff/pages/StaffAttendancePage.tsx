import {Save, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { StaffDetailsDialog } from "../components/StaffDetailsDialog";
import { useStaffAttendanceList, useCreateStaffAttendance, useUpdateStaffAttendance, useDeleteStaffAttendance } from "../hooks/useStaffAttendance";
import { useTeacherSchedule, useCurrentAcademicPeriod } from "@/features/scheduling/class-schedules/hooks/useSchedule";

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

  const getDayName = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
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
    setPendingEdits(prev => ({ ...prev, [staffId]: { ...prev[staffId], [field]: value } }));
  };

  const handleApplyDate = () => { setSelectedDate(dateInput); setPage(1); };

  const handleBulkSave = async () => {
    const promises = Object.entries(pendingEdits).map(async ([staffIdStr, edit]) => {
      const staffId = Number(staffIdStr);
      const existingRecord = safeRosterData.find((s: any) => s.id === staffId);
      const recordId = existingRecord?.attendance?.id;
      const finalStatus = edit.status ?? (existingRecord?.attendance?.status || "present");
      
      if (finalStatus === "present" && recordId) await deleteMutation.mutateAsync(recordId);
      else if (recordId) await updateMutation.mutateAsync({ id: recordId, payload: { status: finalStatus, absence_type: finalStatus === "absent" ? edit.absence_type : null } });
      else await createMutation.mutateAsync({ staff_id: staffId, attendance_date: selectedDate, status: finalStatus, absence_type: finalStatus === "absent" ? edit.absence_type : null });
    });
    try { await Promise.all(promises); setPendingEdits({}); } catch (e) { console.error(e); }
  };

  const hasUnsavedChanges = Object.keys(pendingEdits).length > 0;

  return (
    <section className="space-y-6 pt-5 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between rounded-[24px] border border-border/70 bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-[17px] font-extrabold text-foreground">Staff Attendance</h2>
          <p className="text-[12px] text-muted-foreground font-medium mt-1">Manage daily staff rosters and attendance records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/attendance/staff-leaves')} className="h-10 px-4 rounded-[12px] border-border/70 bg-background text-foreground hover:bg-muted/50 text-[13px]">
            <FileText className="w-4 h-4 mr-2 text-primary" /> Manage Leaves
          </Button>
          <DatePicker value={dateInput} onChange={setDateInput} className="w-[160px] h-10 rounded-[12px]" />
          <Button onClick={handleApplyDate} className="h-10 px-4 rounded-[12px] bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" /> Apply
          </Button>
          
          {/* 🌟 تم تعديل الزر هنا ليستخدم لون الثيم (Primary) بدلاً من الأخضر */}
          <Button 
            onClick={handleBulkSave} 
            disabled={!hasUnsavedChanges || createMutation.isPending || updateMutation.isPending} 
            className={`h-10 px-5 rounded-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[13px] shadow-sm transition-opacity ${!hasUnsavedChanges ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

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

      <StaffDetailsDialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)} staff={selectedStaff} />
    </section>
  );
}