import { CalendarCheck2, CalendarDays, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // إضافة React Query

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";

import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { updateSingleAttendance, createBulkAttendance } from "../api/attendance.api";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

// نوع محلي ليتوافق مع مكونات الـ UI الخاصة بك
export interface UIStudentAttendance {
  id: string; // يستخدم للواجهة
  apiAttendanceId?: number; // يستخدم لمعرفة هل نرسل PUT أو POST للباك إند
  enrollmentId: number;
  studentId: string;
  studentName: string;
  gradeId: string;
  gradeName: string;
  classroomId: string;
  classroomName: string;
  status?: "Present" | "Absent";
  absenceType?: "Excused" | "Unexcused";
}

export function StudentAttendancePage() {
  const queryClient = useQueryClient();
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());
  

  const [activeClassroom, setActiveClassroom] = useState(1); 
  

  const attendanceQuery = useStudentAttendance(selectedDate, activeClassroom);


  const [records, setRecords] = useState<UIStudentAttendance[]>([]);

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");

  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);


  useEffect(() => {
    if (attendanceQuery.data?.data?.data) {
      const apiRecords = attendanceQuery.data.data.data;
      const mappedRecords: UIStudentAttendance[] = apiRecords.map((item) => {

        const hasAttendance = item.attendance !== null; 
        
        return {
          id: hasAttendance ? String(item.attendance!.id) : `draft-${item.enrollment_id}`,
          apiAttendanceId: hasAttendance ? item.attendance!.id : undefined,
          enrollmentId: item.enrollment_id,
          studentId: String(item.student_id),
          studentName: item.full_name,
          gradeId: "1",  
          gradeName: "Grade 7",  
          classroomId: String(activeClassroom),
          classroomName: "A",

          status: item.attendance?.status === "absent" ? "Absent" : item.attendance?.status === "present" ? "Present" : undefined,
          absenceType: item.attendance?.absence_type === "unexcused" ? "Unexcused" : item.attendance?.absence_type === "excused" ? "Excused" : undefined,
        };
      });
      setRecords(mappedRecords);
    }
  }, [attendanceQuery.data, activeClassroom]);

  const filteredData = useMemo(() => {
      return records.filter((student) => {
        const normalizedSearch = search.trim().toLowerCase();
        return (
          (!normalizedSearch || student.studentName.toLowerCase().includes(normalizedSearch)) &&
          (gradeFilter === "all" || student.gradeId === gradeFilter) &&
          (classroomFilter === "all" || student.classroomId === classroomFilter) &&
          (status === "all" || student.status === status) &&
          (status !== "Absent" || absenceType === "all" || student.absenceType === absenceType)
        );
      });
    }, [records, search, gradeFilter, classroomFilter, status, absenceType]);

  const isInitialLoading = attendanceQuery.isLoading && attendanceQuery.data === undefined;

  const present = filteredData.filter((item) => item.status === "Present").length;
  const absent = filteredData.filter((item) => item.status === "Absent").length;
  const excused = filteredData.filter((item) => item.absenceType === "Excused").length;
  const unexcused = filteredData.filter((item) => item.absenceType === "Unexcused").length;

function updateRecord(id: string, patch: any) {
      setRecords((current) =>
      current.map((record) => {
        if (record.id !== id) return record;

        const next = { ...record, ...patch };

        if (patch.status === "Present") {
          delete next.absenceType;
        }

        if (patch.status === "Absent") {
          next.absenceType = next.absenceType ?? "Excused";
        }
        return next;
      }),
    );
    setDirtyIds((current) => new Set(current).add(id));
    setSavedAt(null);
  }

  function applyDate() {
    if (!draftDate) return;
    setSelectedDate(draftDate);
    setDirtyIds(new Set());
    setSavedAt(null);
  }


  const updateMutation = useMutation({ mutationFn: updateSingleAttendance });
  const createMutation = useMutation({ mutationFn: createBulkAttendance });


  async function saveAttendance() {
    if (dirtyIds.size === 0) return;

    const dirtyRecords = records.filter(r => dirtyIds.has(r.id));
    

    const promises = dirtyRecords.map(record => {
      const payload = {
        status: record.status === "Absent" ? "absent" : "present" as any,
        absence_type: record.absenceType === "Unexcused" ? "unexcused" : (record.absenceType === "Excused" ? "excused" : null) as any,
        attendance_date: selectedDate
      };


      if (record.apiAttendanceId) {
        return updateMutation.mutateAsync({ id: record.apiAttendanceId, payload });
      } 

      else {
        return createMutation.mutateAsync({ enrollment_id: record.enrollmentId, ...payload });
      }
    });

    try {
      await Promise.all(promises);
      

      setDirtyIds(new Set());
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      
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
            data={records as any} 
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
          />
        </div>
      </div>

      {savedAt ? (
        <p className="-mt-1 text-end text-[11px] font-medium text-success">
          Attendance changes saved at {savedAt}.
        </p>
      ) : null}

     <AttendanceTable
        data={filteredData as any}
        isLoading={isInitialLoading}
        onUpdate={updateRecord as any}
      />
    </section>
  );
}