import { Save, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { StaffDetailsDialog } from "../components/StaffDetailsDialog";
import {
  useStaffAttendanceList,
  useCreateStaffAttendance,
  useUpdateStaffAttendance,
  useDeleteStaffAttendance,
} from "../hooks/useStaffAttendance";
import {
  useTeacherSchedule,
  useCurrentAcademicPeriod,
} from "@/features/scheduling/class-schedules/hooks/useSchedule";

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
  const { data: teacherSchedule } = useTeacherSchedule(
    academicYearId,
    semesterId
  );

  const getDayName = (dateStr: string) =>
    new Date(dateStr)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

  const currentDay = getDayName(selectedDate);

  const { data: rosterResult, isLoading: isRosterLoading } =
    useStaffAttendanceList(selectedDate, page);

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

  const handleUpdateLocal = (
    staffId: number,
    field: string,
    value: any
  ) => {
    setPendingEdits((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value,
      },
    }));
  };

  const handleApplyDate = () => {
    setSelectedDate(dateInput);
    setPage(1);
  };

  const handleBulkSave = async () => {
    const promises = Object.entries(pendingEdits).map(
      async ([staffIdStr, edit]) => {
        const staffId = Number(staffIdStr);
        const existingRecord = safeRosterData.find(
          (s: any) => s.id === staffId
        );
        const recordId = existingRecord?.attendance?.id;

        // 🌟 تجهيز القيم النهائية للطلب
        const finalStatus =
          edit.status ??
          (existingRecord?.attendance?.status || "present");

        const finalAbsenceType =
          edit.absence_type ??
          (existingRecord?.attendance?.absence_type || "excused");

        // 🌟 تنظيف وتجهيز الحصص لتكون دائماً مصفوفة أرقام (IDs)
        const rawPeriods = edit.missing_periods ?? existingRecord?.attendance?.missing_periods ?? [];
        const finalMissingPeriods = rawPeriods.map((p: any) => 
          typeof p === 'object' && p !== null ? p.schedule_entry_id : p
        );

        const isAbsentOrPartial = finalStatus === "absent" || finalStatus === "partial_absence";

        if (finalStatus === "present" && recordId) {
          await deleteMutation.mutateAsync(recordId);
        } else if (recordId) {
          await updateMutation.mutateAsync({
            id: recordId,
            payload: {
              status: finalStatus,
              // إرسال الـ absence_type في حالتي الغياب والغياب الجزئي
              absence_type: isAbsentOrPartial ? finalAbsenceType : null,
              // 🌟 إرسال الحصص المفقودة في حالة الـ partial_absence فقط
              missing_periods: finalStatus === "partial_absence" ? finalMissingPeriods : [],
            },
          });
        } else {
          await createMutation.mutateAsync({
            staff_id: staffId,
            attendance_date: selectedDate,
            status: finalStatus,
            absence_type: isAbsentOrPartial ? finalAbsenceType : null,
            missing_periods: finalStatus === "partial_absence" ? finalMissingPeriods : [],
          });
        }
      }
    );

    try {
      await Promise.all(promises);
      setPendingEdits({});
    } catch (e) {
      console.error(e);
    }
  };

  const hasUnsavedChanges = Object.keys(pendingEdits).length > 0;

  return (
    <section className="space-y-6 pt-5 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 rounded-[24px] border border-border/70 bg-card p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-foreground">
            Staff Attendance
          </h2>

          <p className="mt-1 text-[12px] font-semibold text-muted-foreground">
            Manage daily staff rosters and attendance records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/attendance/staff-leaves")}
            className="h-10 rounded-[12px] border-border/70 bg-background px-4 text-[13px] text-foreground hover:bg-muted/50"
          >
            <FileText className="mr-2 h-4 w-4 text-primary" />
            Manage Leaves
          </Button>

          <DatePicker
            value={dateInput}
            onChange={setDateInput}
            className="w-full sm:w-[220px]"
          />

          <Button
            onClick={handleApplyDate}
            className="h-10 rounded-[12px] bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Apply
          </Button>

          <Button
            onClick={handleBulkSave}
            disabled={
              !hasUnsavedChanges ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            className={`h-10 rounded-[12px] bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:bg-primary/90 ${
              !hasUnsavedChanges
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
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

      <StaffDetailsDialog
        open={!!selectedStaff}
        onOpenChange={(open) => !open && setSelectedStaff(null)}
        staff={selectedStaff}
      />
    </section>
  );
}