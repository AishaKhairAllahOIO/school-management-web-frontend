import { CalendarCheck2, CalendarDays, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/services/axios/axiosClient";

import type {
  StudentAttendance,
  AttendanceStatus,
  AbsenceType,
} from "../types/attendance.types";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";

import { AttendanceFilters } from "../components/AttendanceFilters";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceTable } from "../components/AttendanceTable";

import {
  useBulkAttendance,
  useStudentAttendance,
} from "../hooks/useStudentAttendance";

import { studentAttendanceService } from "../api/studentAttendance.service";
import { useAcademicSettings } from "../../../settings/academic/hooks/useAcademicSettings";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Shared soft UI classes
 * الهدف: واجهة أنعم وأهدأ بدون تغيير الـ components.
 */

export function StudentAttendancePage() {
  const queryClient = useQueryClient();

  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());

  const { data: academicData } = useAcademicSettings();

  const activeSemester =
    academicData?.settings?.currentSemesterId || null;

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [classroomFilter, setClassroomFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");
  const [page, setPage] = useState(1);

  // --------------------------------------------------
  // Reset page when filters change
  // --------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [
    search,
    status,
    absenceType,
    classroomFilter,
    selectedDate,
    gradeFilter,
  ]);

  // --------------------------------------------------
  // Grades
  // --------------------------------------------------

  const { data: gradesData = [] } = useQuery({
    queryKey: ["real-grades"],
    queryFn: async () => {
      const response = await axiosClient.get(
        "/admin/settings/grades"
      );

      return response.data.data || [];
    },
  });

  // --------------------------------------------------
  // Classrooms
  // --------------------------------------------------

  const { data: classroomsData = [] } = useQuery({
    queryKey: ["real-classrooms"],
    queryFn: async () => {
      const response = await axiosClient.get(
        "/admin/settings/classrooms"
      );

      return response.data.data || [];
    },
  });

  // --------------------------------------------------
  // Filter classrooms by grade
  // --------------------------------------------------

  const filteredClassrooms = useMemo(() => {
    if (gradeFilter === "all") {
      return classroomsData;
    }

    return classroomsData.filter(
      (classroom: any) =>
        String(
          classroom.gradeId ||
            classroom.grade_id
        ) === gradeFilter
    );
  }, [classroomsData, gradeFilter]);

  // --------------------------------------------------
  // Smart classroom selection
  // --------------------------------------------------

  useEffect(() => {
    if (gradeFilter === "all") {
      setClassroomFilter("all");
      return;
    }

    if (
      filteredClassrooms.length > 0 &&
      classroomFilter === "all"
    ) {
      setClassroomFilter(
        String(filteredClassrooms[0].id)
      );
    }
  }, [
    gradeFilter,
    filteredClassrooms,
    classroomFilter,
  ]);

  // --------------------------------------------------
  // Active classroom / grade
  // --------------------------------------------------

  const activeClassroom = classroomsData.find(
    (classroom: any) =>
      String(classroom.id) === classroomFilter
  );

  const activeClassName =
    classroomFilter === "all"
      ? "All classrooms"
      : activeClassroom?.name || "N/A";

  const activeGrade = gradesData.find(
    (grade: any) =>
      String(grade.id) === gradeFilter
  );

  const activeGradeName =
    gradeFilter === "all"
      ? "All grades"
      : activeGrade?.name || "N/A";

  // --------------------------------------------------
  // Attendance query
  // --------------------------------------------------

  const attendanceQuery = useStudentAttendance({
    date: selectedDate,
    gradeId: gradeFilter,
    classroomId: classroomFilter,
    page,
    search,
    status,
    absenceType,
    semesterId: activeSemester
      ? Number(activeSemester)
      : null,
  });

  const bulkAttendanceMutation =
    useBulkAttendance();

  // --------------------------------------------------
  // Local records
  // --------------------------------------------------

  const [originalRecords, setOriginalRecords] =
    useState<StudentAttendance[]>([]);

  const [records, setRecords] =
    useState<StudentAttendance[]>([]);

  const [dirtyIds, setDirtyIds] =
    useState<Set<number>>(new Set());

  const [savedAt, setSavedAt] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  // --------------------------------------------------
  // Sync API records
  // --------------------------------------------------

  useEffect(() => {
    const apiData =
      attendanceQuery.data?.data || [];

    setOriginalRecords(
      JSON.parse(JSON.stringify(apiData))
    );

    setRecords(apiData);
    setDirtyIds(new Set());
  }, [attendanceQuery.data]);

  const isInitialLoading =
    attendanceQuery.isLoading;

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const present = records.filter(
    (item) =>
      (item.attendance?.status ||
        (item.attendance?.id
          ? "absent"
          : "present")) === "present"
  ).length;

  const absent = records.filter(
    (item) =>
      (item.attendance?.status ||
        (item.attendance?.id
          ? "absent"
          : "present")) === "absent"
  ).length;

  const excused = records.filter(
    (item) =>
      item.attendance?.absence_type
        ?.toLowerCase() === "excused"
  ).length;

  const unexcused = records.filter(
    (item) =>
      item.attendance?.absence_type
        ?.toLowerCase() === "unexcused"
  ).length;

  // --------------------------------------------------
  // Local update
  // --------------------------------------------------

  function updateRecord(
    student: StudentAttendance,
    patch: {
      status: AttendanceStatus;
      absence_type?: AbsenceType | null;
    }
  ) {
    setRecords((current) =>
      current.map((record) => {
        if (
          record.enrollment_id !==
          student.enrollment_id
        ) {
          return record;
        }

        return {
          ...record,
          attendance: {
            ...(record.attendance || {
              id: null,
              attendance_date: selectedDate,
            }),
            status: patch.status,
            absence_type:
              patch.absence_type ?? null,
          } as any,
        };
      })
    );

    setDirtyIds(
      (current) =>
        new Set(current).add(
          student.enrollment_id
        )
    );

    setSavedAt(null);
  }

  // --------------------------------------------------
  // Apply date
  // --------------------------------------------------

  function applyDate() {
    if (!draftDate) return;

    setSelectedDate(draftDate);
    setDirtyIds(new Set());
    setSavedAt(null);
  }

  // --------------------------------------------------
  // Save attendance
  // --------------------------------------------------

  async function saveAttendance() {
    if (dirtyIds.size === 0) return;

    setIsSaving(true);

    try {
      const newAbsencesToBulk: Array<{
        enrollment_id: number;
        attendance_date: string;
        status: "present" | "absent";
        absence_type:
          | "excused"
          | "unexcused"
          | null;
      }> = [];

      const updatePromises = [];
      const deletePromises = [];

      for (const studentId of dirtyIds) {
        const draft = records.find(
          (record) =>
            record.enrollment_id === studentId
        );

        const original = originalRecords.find(
          (record) =>
            record.enrollment_id === studentId
        );

        if (!draft || !original) continue;

        const originalId =
          original.attendance?.id;

        const draftStatus =
          draft.attendance?.status ||
          "present";

        const draftAbsenceType =
          draftStatus === "absent"
            ? ((draft.attendance
                ?.absence_type as
                | "excused"
                | "unexcused") ??
              "excused")
            : null;

        // New absence
        if (
          !originalId &&
          draftStatus === "absent"
        ) {
          newAbsencesToBulk.push({
            enrollment_id:
              draft.enrollment_id,
            attendance_date:
              selectedDate,
            status: "absent",
            absence_type:
              draftAbsenceType,
          });
        }

        // Delete existing attendance
        else if (
          originalId &&
          draftStatus === "present"
        ) {
          deletePromises.push(
            studentAttendanceService.deleteRecord(
              originalId
            )
          );
        }

        // Update existing attendance
        else if (
          originalId &&
          draftStatus === "absent"
        ) {
          updatePromises.push(
            studentAttendanceService.updateRecord(
              originalId,
              {
                status: "absent",
                absence_type:
                  draftAbsenceType,
                attendance_date:
                  selectedDate,
              }
            )
          );
        }
      }

      // Bulk create
      if (newAbsencesToBulk.length > 0) {
        await bulkAttendanceMutation.mutateAsync({
          semester_id: Number(
            activeSemester || 1
          ),
          class_room_id: Number(
            classroomFilter
          ),
          attendance_date: selectedDate,
          attendances:
            newAbsencesToBulk,
        });
      }

      // Delete
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }

      // Update
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }

      setDirtyIds(new Set());

      setSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["student-attendance"],
      });
    } catch (error) {
      console.error(
        "Failed to save",
        error
      );
    } finally {
      setIsSaving(false);
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <section
      className="
        space-y-5
        pt-5
        animate-in
        fade-in
        duration-300
      "
    >
      {/* ================================================= */}
      {/* Stats */}
      {/* ================================================= */}

      <AttendanceStats
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      {/* ================================================= */}
      {/* Header + Controls + Filters */}
      {/* ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-[22px]
          border
          border-border/50
          bg-card
          shadow-[0_1px_3px_rgba(0,0,0,0.03)]
          transition-shadow
          duration-200
        "
      >
        {/* ------------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------------- */}

        <div
          className="
            flex
            flex-col
            gap-4
            bg-card
            px-6
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Title */}
          <div className="flex min-w-0 items-center gap-3.5">
            <span
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[14px]
                border
                border-primary/15
                bg-primary/[0.06]
                text-primary
                transition-colors
                duration-200
              "
            >
              <CalendarCheck2
                className="h-[21px] w-[21px]"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <h2
                className="
                  text-[15px]
                  font-medium
                  tracking-normal
                  text-foreground
                "
              >
                Student attendance
              </h2>

              <p
                className="
                  mt-1
                  text-[12px]
                  font-normal
                  leading-5
                  text-muted-foreground
                "
              >
                Select date, apply, then save
                changes.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-2.5
              sm:flex-row
              lg:w-auto
              lg:items-end
            "
          >
            {/* Date */}
            <DatePicker
              value={draftDate}
              onChange={setDraftDate}
              className="
                w-full
                sm:w-[228px]
              "
            />

            {/* Apply */}
            <Button
              type="button"
              variant="outline"
              onClick={applyDate}
              disabled={
                !draftDate ||
                draftDate === selectedDate
              }
              className="
                h-11
                rounded-[14px]
                border-primary/25
                bg-transparent
                px-5
                text-[13px]
                font-medium
                text-primary
                shadow-none
                transition-all
                duration-200
                hover:bg-primary/[0.06]
                hover:border-primary/35
                active:scale-[0.98]
                disabled:opacity-45
              "
            >
              <CalendarDays
                className="mr-2 h-4 w-4"
                strokeWidth={1.8}
              />

              Apply
            </Button>

            {/* Save */}
            <Button
              type="button"
              onClick={saveAttendance}
              disabled={
                dirtyIds.size === 0 ||
                isSaving ||
                classroomFilter === "all"
              }
              className="
                h-11
                rounded-[14px]
                bg-primary
                px-6
                text-[13px]
                font-medium
                text-primary-foreground
                shadow-none
                transition-all
                duration-200
                hover:bg-primary/90
                active:scale-[0.98]
                disabled:opacity-45
              "
            >
              <Save
                className="mr-2 h-4 w-4"
                strokeWidth={1.8}
              />

              {isSaving
                ? "Saving..."
                : classroomFilter ===
                      "all" &&
                    dirtyIds.size > 0
                  ? "Select class to save"
                  : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* ------------------------------------------------- */}
        {/* Filters */}
        {/* ------------------------------------------------- */}

        <div
          className="
            border-t
            border-border/40
            bg-muted/[0.16]
            p-5
          "
        >
          <AttendanceFilters
            search={search}
            setSearch={setSearch}
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            classroomFilter={
              classroomFilter
            }
            setClassroomFilter={
              setClassroomFilter
            }
            status={status}
            setStatus={setStatus}
            absenceType={absenceType}
            setAbsenceType={
              setAbsenceType
            }
            grades={gradesData}
            classrooms={
              filteredClassrooms
            }
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* Saved message */}
      {/* ================================================= */}

      {savedAt && (
        <div
          className="
            -mt-1
            flex
            justify-end
            px-1
            animate-in
            fade-in
            slide-in-from-top-1
            duration-200
          "
        >
          <p
            className="
              text-[11.5px]
              font-normal
              tracking-normal
              text-success
            "
          >
            <span className="mr-1 opacity-80">
              ✓
            </span>

            Changes saved at {savedAt}.
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* Attendance Table */}
      {/* ================================================= */}

      <AttendanceTable
        data={records}
        isLoading={isInitialLoading}
        onUpdate={updateRecord}
        pagination={
          attendanceQuery.data
        }
        currentPage={page}
        onPageChange={setPage}
        gradeName={activeGradeName}
        className={activeClassName}
      />
    </section>
  );
}