import { CalendarCheck2, CalendarDays, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import type { StudentAttendance, AttendanceStatus, AbsenceType } from "../types/attendance.types";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";
import { useBulkAttendance, useStudentAttendance } from "../hooks/useStudentAttendance";
import { studentAttendanceService } from "../api/studentAttendance.service";
import { useAcademicSettings } from "../../../settings/academic/hooks/useAcademicSettings"; 

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

export function StudentAttendancePage() {
  const queryClient = useQueryClient();
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());
  
  const { data: academicData } = useAcademicSettings();
  const activeSemester = academicData?.settings?.currentSemesterId || null; 
  
  // 🌟 القيمة الافتراضية للفلاتر هي "all"
  const [classroomFilter, setClassroomFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, status, absenceType, classroomFilter, selectedDate, gradeFilter]);

  const { data: gradesData = [] } = useQuery({
    queryKey: ['real-grades'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/settings/grades');
      return response.data.data || [];
    }
  });

  const { data: classroomsData = [] } = useQuery({
    queryKey: ['real-classrooms'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/settings/classrooms');
      return response.data.data || [];
    }
  });

  const filteredClassrooms = useMemo(() => {
    if (gradeFilter === "all") return classroomsData;
    return classroomsData.filter((c: any) => String(c.gradeId || c.grade_id) === gradeFilter);
  }, [classroomsData, gradeFilter]);

  // 🌟 منطق ذكي: إذا اختار مرحلة محددة، نختار أول شعبة لنسهل عليه أخذ التفقد
  useEffect(() => {
    if (gradeFilter === "all") {
      setClassroomFilter("all");
    } else if (filteredClassrooms.length > 0 && classroomFilter === "all") {
      setClassroomFilter(String(filteredClassrooms[0].id));
    }
  }, [gradeFilter, filteredClassrooms]);

  const activeClassroom = classroomsData.find((c: any) => String(c.id) === classroomFilter);
  const activeClassName = classroomFilter === "all" ? "All classrooms" : (activeClassroom?.name || "N/A");
  
  const activeGrade = gradesData.find((g: any) => String(g.id) === gradeFilter);
  const activeGradeName = gradeFilter === "all" ? "All grades" : (activeGrade?.name || "N/A");

  // 🌟 إرسال `gradeId` مع الدالة لكي تفلتر بناءً عليها إذا لم يتم اختيار شعبة محددة
  const attendanceQuery = useStudentAttendance({
    date: selectedDate,
    gradeId: gradeFilter,
    classroomId: classroomFilter,
    page,
    search,
    status,
    absenceType,
    semesterId: activeSemester ? Number(activeSemester) : null,
  });

  const bulkAttendanceMutation = useBulkAttendance();

  const [originalRecords, setOriginalRecords] = useState<StudentAttendance[]>([]);
  const [records, setRecords] = useState<StudentAttendance[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const apiData = attendanceQuery.data?.data || [];
    setOriginalRecords(JSON.parse(JSON.stringify(apiData)));
    setRecords(apiData);
    setDirtyIds(new Set());
  }, [attendanceQuery.data]);

  const isInitialLoading = attendanceQuery.isLoading;
  const present = records.filter((item) => (item.attendance?.status || (item.attendance?.id ? "absent" : "present")) === "present").length;
  const absent = records.filter((item) => (item.attendance?.status || (item.attendance?.id ? "absent" : "present")) === "absent").length;
  const excused = records.filter((item) => item.attendance?.absence_type?.toLowerCase() === "excused").length;
  const unexcused = records.filter((item) => item.attendance?.absence_type?.toLowerCase() === "unexcused").length;

  function updateRecord(student: StudentAttendance, patch: { status: AttendanceStatus; absence_type?: AbsenceType | null }) {
    setRecords((current) =>
      current.map((record) => {
        if (record.enrollment_id !== student.enrollment_id) return record;
        return {
          ...record,
          attendance: {
            ...(record.attendance || { id: null, attendance_date: selectedDate }),
            status: patch.status,
            absence_type: patch.absence_type ?? null,
          } as any,
        };
      })
    );
    setDirtyIds((current) => new Set(current).add(student.enrollment_id));
    setSavedAt(null);
  }

  function applyDate() {
    if (!draftDate) return;
    setSelectedDate(draftDate);
    setDirtyIds(new Set());
    setSavedAt(null);
  }

  async function saveAttendance() {
    if (dirtyIds.size === 0) return;
    setIsSaving(true);

    try {
      const newAbsencesToBulk: Array<{ enrollment_id: number; attendance_date: string; status: "present" | "absent"; absence_type: "excused" | "unexcused" | null; }> = [];
      const updatePromises = [];
      const deletePromises = [];

      for (const studentId of dirtyIds) {
        const draft = records.find((r) => r.enrollment_id === studentId);
        const original = originalRecords.find((r) => r.enrollment_id === studentId);
        if (!draft || !original) continue;

        const originalId = original.attendance?.id; 
        const draftStatus = draft.attendance?.status || "present";
        const draftAbsenceType = draftStatus === "absent" ? (draft.attendance?.absence_type as "excused" | "unexcused" ?? "excused") : null;

        if (!originalId && draftStatus === "absent") {
          newAbsencesToBulk.push({ enrollment_id: draft.enrollment_id, attendance_date: selectedDate, status: "absent", absence_type: draftAbsenceType });
        } else if (originalId && draftStatus === "present") {
          deletePromises.push(studentAttendanceService.deleteRecord(originalId));
        } else if (originalId && draftStatus === "absent") {
          updatePromises.push(studentAttendanceService.updateRecord(originalId, { status: "absent", absence_type: draftAbsenceType, attendance_date: selectedDate }));
        }
      }

      if (newAbsencesToBulk.length > 0) {
        await bulkAttendanceMutation.mutateAsync({
          semester_id: Number(activeSemester || 1), 
          class_room_id: Number(classroomFilter),
          attendance_date: selectedDate,
          attendances: newAbsencesToBulk,
        });
      }

      if (deletePromises.length > 0) await Promise.all(deletePromises);
      if (updatePromises.length > 0) await Promise.all(updatePromises);

      setDirtyIds(new Set());
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      queryClient.invalidateQueries({ queryKey: ["student-attendance"] }); 
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-5 pt-5 animate-in fade-in duration-300">
      <AttendanceStats present={present} absent={absent} excused={excused} unexcused={unexcused} isLoading={isInitialLoading} />

      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between bg-card">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/20 bg-primary/[0.08] text-primary shadow-xs">
              <CalendarCheck2 className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[16px] font-extrabold tracking-tight text-foreground">Daily attendance</h2>
              </div>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">Select date, apply, then save changes.</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-end">
            <DatePicker value={draftDate} onChange={setDraftDate} label="Attendance date" className="w-full sm:w-[228px]" />
            <Button type="button" variant="outline" onClick={applyDate} disabled={!draftDate || draftDate === selectedDate} className="h-11 rounded-[14px] border-primary/30 bg-transparent px-5 text-[13px] font-semibold text-primary hover:bg-primary/10 transition-colors shadow-2xs">
              <CalendarDays className="h-4 w-4 mr-2" /> Apply
            </Button>
            {/* 🌟 تعطيل زر الحفظ إذا كان يعرض كل الشعب، لأن الباك إند يحتاج class_room_id للحفظ الجماعي */}
            <Button type="button" onClick={saveAttendance} disabled={dirtyIds.size === 0 || isSaving || classroomFilter === "all"} className="h-11 rounded-[14px] px-6 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all disabled:opacity-50">
              <Save className="h-4 w-4 mr-2" /> 
              {isSaving ? "Saving..." : classroomFilter === "all" && dirtyIds.size > 0 ? "Select class to save" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/60 bg-muted/20 p-5">
          <AttendanceFilters
            search={search} setSearch={setSearch} gradeFilter={gradeFilter} setGradeFilter={setGradeFilter}
            classroomFilter={classroomFilter} setClassroomFilter={setClassroomFilter} status={status} setStatus={setStatus}
            absenceType={absenceType} setAbsenceType={setAbsenceType} grades={gradesData} classrooms={filteredClassrooms} 
          />
        </div>
      </div>

      {savedAt && (
        <p className="-mt-1 text-end text-[11.5px] font-bold text-success">✓ Changes saved at {savedAt}.</p>
      )}

      <AttendanceTable 
        data={records} 
        isLoading={isInitialLoading} 
        onUpdate={updateRecord}
        pagination={attendanceQuery.data}
        currentPage={page}
        onPageChange={setPage}
        gradeName={activeGradeName}
        className={activeClassName}
      />
    </section>
  );
}