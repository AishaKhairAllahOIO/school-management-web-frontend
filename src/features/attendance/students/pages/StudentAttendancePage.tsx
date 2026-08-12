import { CalendarCheck2, CalendarDays, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { StudentAttendance, AttendanceStatus, AbsenceType } from "../types/attendance.types";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { useCreateAttendance } from "../hooks/useCreateAttendance";
import { useUpdateAttendance } from "../hooks/useUpdateAttendance";
import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";
import { useStudentAttendance } from "../hooks/useStudentAttendance";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

export function StudentAttendancePage() {
  const queryClient = useQueryClient();
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());

  // حالة الصف النشط حالياً (يُفترض أن تأتي من قائمة اختيار الصفوف في تطبيقك)
  const [activeClassroom, ] = useState(1);

  const attendanceQuery = useStudentAttendance(selectedDate, activeClassroom);

  const [records, setRecords] = useState<StudentAttendance[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");

  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {

    if (attendanceQuery.data?.data) {
      setRecords(attendanceQuery.data.data); 
    }
  }, [attendanceQuery.data]);

  const filteredData = useMemo(() => {
    return records.filter((student) => {
      const normalizedSearch = search.trim().toLowerCase();
      const currentStatus = student.attendance?.status ?? "unmarked";
      const currentAbsenceType = student.attendance?.absence_type ?? "none";

      return (
        (!normalizedSearch || student.full_name.toLowerCase().includes(normalizedSearch)) &&
        // نضيف الفلترة حسب الصف إذا توفرت بياناته في الـ API مستقبلاً
        (status === "all" || currentStatus === status) &&
        (status !== "absent" || absenceType === "all" || currentAbsenceType === absenceType)
      );
    });
  }, [records, search, gradeFilter, classroomFilter, status, absenceType]);

  const isInitialLoading = attendanceQuery.isLoading;

  const present = filteredData.filter((item) => item.attendance?.status === "present").length;
  const absent = filteredData.filter((item) => item.attendance?.status === "absent").length;
  const excused = filteredData.filter((item) => item.attendance?.absence_type === "excused").length;
  const unexcused = filteredData.filter((item) => item.attendance?.absence_type === "unexcused").length;

  function updateRecord(student: StudentAttendance, patch: { status: AttendanceStatus; absence_type?: AbsenceType | null }) {
    setRecords((current) =>
      current.map((record) => {
        if (record.enrollment_id !== student.enrollment_id) return record;

        return {
          ...record,
          attendance: {
            ...(record.attendance || { id: 0, attendance_date: selectedDate }),
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

  const updateMutation = useUpdateAttendance();
  const createMutation = useCreateAttendance();

  async function saveAttendance() {
    if (dirtyIds.size === 0) return;

    const dirtyRecords = records.filter((r) => dirtyIds.has(r.enrollment_id));

    const promises = dirtyRecords.map((record) => {
      const payload = {
        status: record.attendance!.status,
        absence_type: record.attendance!.absence_type,
        attendance_date: selectedDate,
      };

      // إذا كان لدى الطالب id حضور حقيقي، نقوم بتحديثه PUT، وإلا نرسل POST
      if (record.attendance && record.attendance.id !== 0) {
        return updateMutation.mutateAsync({ id: record.attendance.id, payload });
      } else {
        return createMutation.mutateAsync({ enrollment_id: record.enrollment_id, ...payload });
      }
    });

    try {
      await Promise.all(promises);
      setDirtyIds(new Set());
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
    } catch (error) {
      console.error("Failed to save attendance", error);
    }
  }

  return (
    <section className="space-y-4 pt-5">
      <AttendanceStats
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <div className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_10px_30px_rgba(30,20,70,0.045)]">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-primary/10 bg-primary/[0.075] text-primary">
              <CalendarCheck2 className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-foreground">
                  Daily attendance date
                </h2>
                <span className="rounded-full bg-primary/[0.065] px-2 py-0.5 text-[10px] font-medium text-primary">
                  One date for the table
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Select the working day, apply it to the student directory, then save edited attendance rows.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:items-end">
            <DatePicker
              value={draftDate}
              onChange={setDraftDate}
              label="Attendance date"
              className="w-full sm:w-[228px]"
            />

            <Button
              type="button"
              variant="outline"
              onClick={applyDate}
              disabled={!draftDate || draftDate === selectedDate}
              className="h-11 rounded-[13px] border-primary/20 bg-transparent px-4 text-primary hover:bg-primary/[0.055]"
            >
              <CalendarDays className="h-4 w-4" />
              Apply
            </Button>

            <Button
              type="button"
              onClick={saveAttendance}
              disabled={dirtyIds.size === 0 || updateMutation.isPending || createMutation.isPending}
              className="h-11 rounded-[13px] px-5"
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending || createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/45 bg-muted/[0.10] p-4">
          <AttendanceFilters
            data={records}
            search={search}
            setSearch={setSearch}
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            classroomFilter={classroomFilter}
            setClassroomFilter={setClassroomFilter}
            status={status}
            setStatus={setStatus}
            absenceType={absenceType}
            setAbsenceType={setAbsenceType}
            grades={[]} // يمكنك تمرير قائمة الـ Grades الحقيقية هنا
            classrooms={[]} // يمكنك تمرير قائمة الصفوف هنا
          />
        </div>
      </div>

      {savedAt ? (
        <p className="-mt-1 text-end text-[11px] font-medium text-success">
          Attendance changes saved at {savedAt}.
        </p>
      ) : null}

      <AttendanceTable
        data={filteredData}
        isLoading={isInitialLoading}
        onUpdate={updateRecord as any}
      />
    </section>
  );
}