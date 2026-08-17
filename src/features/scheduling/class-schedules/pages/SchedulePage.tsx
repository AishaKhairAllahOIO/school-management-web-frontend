import {
  AlertCircle,
  CalendarDays,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGradeSubjects } from "@/features/academics/grade-subjects/hooks/useGradeSubjects";
import { useStaffByRole } from "@/features/users/staff/hooks/useStaff";
import { useTeacherAssignments } from "@/features/academics/teacher-assignments/hooks/useTeacherAssignments";

import { ScheduleViolations } from "../components/ScheduleViolations";
import { GenerateScheduleDialog } from "../components/GenerateScheduleDialog";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { ScheduleEntryDialog } from "../components/ScheduleEntryDialog";
import { SchedulePageSkeleton } from "../components/SchedulePageSkeleton";

import {
  useAdminSchedule,
  useAddScheduleEntry,
  useGenerateSchedule,
  useRegenerateSchedule,
  useUpdateScheduleEntry,
} from "../hooks/useSchedule";

import type {
  ScheduleClass,
  ScheduleDay,
  SchedulePeriod,
} from "../types/schedule.types";

export function ClassSchedulesPage() {
  const academicSettingsQuery = useAcademicSettings();

  const classroomsQuery = useClassrooms();

  const gradeSubjectsQuery = useGradeSubjects();

  const teachersQuery = useStaffByRole(
    "teacher",
    1,
    1000,
  );

  const settings = academicSettingsQuery.data;

  const generateMutation = useGenerateSchedule();

  const regenerateMutation = useRegenerateSchedule();

  const addMutation = useAddScheduleEntry();

  const updateMutation = useUpdateScheduleEntry();

  const [dialogMode, setDialogMode] = useState<
    "generate" | "regenerate"
  >("generate");

  const [generationDialogOpen, setGenerationDialogOpen] =
    useState(false);

  const [entryDialogOpen, setEntryDialogOpen] =
    useState(false);

  const [entryMode, setEntryMode] =
    useState<"add" | "edit">("add");

  const [selectedClass, setSelectedClass] =
    useState<ScheduleClass | null>(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState<SchedulePeriod | undefined>(
      undefined,
    );

  const [selectedDay, setSelectedDay] =
    useState<ScheduleDay | undefined>(
      undefined,
    );

  const currentAcademicYear =
    settings?.academicYears.find(
      (year) =>
        year.id ===
        settings.settings.currentAcademicYearId,
    );

  const currentTerm =
    settings?.academicTerms.find(
      (term) =>
        term.id ===
        settings.settings.currentSemesterId,
    );

  const academicYearId = currentAcademicYear
    ? Number(currentAcademicYear.id)
    : null;

  const semesterId = currentTerm
    ? Number(currentTerm.id)
    : null;

  const scheduleQuery = useAdminSchedule(
    academicYearId,
    semesterId,
  );

  const schedule = scheduleQuery.data;

  const teachers =
    teachersQuery.data?.data ?? [];

  /*
   * We need assignment records for all teachers.
   */
  const teacherIds = useMemo(
    () =>
      teachers.map((teacher) =>
        String(teacher.id),
      ),
    [teachers],
  );

  const assignmentsQuery =
    useTeacherAssignments(teacherIds);

  const assignments =
    assignmentsQuery.data ?? [];

  const isInitialLoading =
    academicSettingsQuery.isLoading ||
    scheduleQuery.isLoading ||
    classroomsQuery.isLoading ||
    gradeSubjectsQuery.isLoading ||
    teachersQuery.isLoading ||
    assignmentsQuery.isLoading;

  const isAnyMutationPending =
    generateMutation.isPending ||
    regenerateMutation.isPending ||
    addMutation.isPending ||
    updateMutation.isPending;

  function openGenerate() {
    setDialogMode("generate");
    setGenerationDialogOpen(true);
  }

  function openRegenerate() {
    setDialogMode("regenerate");
    setGenerationDialogOpen(true);
  }

  function handleGeneration() {
    if (
      academicYearId === null ||
      semesterId === null
    ) {
      return;
    }

    const payload = {
      academic_year_id: academicYearId,
      semester_id: semesterId,
    };

    if (dialogMode === "generate") {
      generateMutation.mutate(payload, {
        onSuccess: () => {
          setGenerationDialogOpen(false);
          void scheduleQuery.refetch();
        },
      });

      return;
    }

    regenerateMutation.mutate(payload, {
      onSuccess: () => {
        setGenerationDialogOpen(false);
        void scheduleQuery.refetch();
      },
    });
  }

  /**
   * Add lesson from an empty cell.
   *
   * IMPORTANT:
   * We intentionally do NOT receive periodIndex here.
   * The backend decides which period to use.
   *
   * The selected day is still important because the backend
   * requires it.
   */
  function openAddDialog({
    classItem,
    day,
  }: {
    classItem: ScheduleClass;
    day: ScheduleDay;
    periodIndex?: number;
  }) {
    setSelectedClass(classItem);

    setSelectedPeriod(undefined);

    setSelectedDay(day);

    setEntryMode("add");
    setEntryDialogOpen(true);
  }

  /**
   * Add lesson from the table-level "Add Lesson" button.
   *
   * Since there is no selected cell, the dialog will ask
   * the user to select the day.
   */
  function openTableAddDialog(
    classItem: ScheduleClass,
  ) {
    setSelectedClass(classItem);
    setSelectedPeriod(undefined);
    setSelectedDay(undefined);
    setEntryMode("add");
    setEntryDialogOpen(true);
  }

  function openEditDialog({
    classItem,
    period,
    day,
  }: {
    classItem: ScheduleClass;
    period: SchedulePeriod;
    day: ScheduleDay;
  }) {
    setSelectedClass(classItem);

    setSelectedPeriod(period);

    setSelectedDay(day);

    setEntryMode("edit");

    setEntryDialogOpen(true);
  }

  /*
   * Resolve classroom from the visible class.
   */
  const selectedClassroom = useMemo(() => {
    if (!selectedClass) {
      return null;
    }

    const className =
      selectedClass.class_room_name
        .trim()
        .toLowerCase();

    return (
      classroomsQuery.data?.find(
        (classroom) =>
          classroom.name
            .trim()
            .toLowerCase() === className,
      ) ?? null
    );
  }, [
    selectedClass,
    classroomsQuery.data,
  ]);

  /*
   * Resolve grade subjects for the selected classroom.
   */
  const selectedGradeSubjects = useMemo(() => {
    if (!selectedClassroom) {
      return [];
    }

    return (
      gradeSubjectsQuery.data?.filter(
        (subject) =>
          String(subject.gradeId) ===
          String(selectedClassroom.gradeId),
      ) ?? []
    );
  }, [
    selectedClassroom,
    gradeSubjectsQuery.data,
  ]);

  /*
   * For the selected classroom we only need assignments
   * belonging to that classroom.
   */
  const selectedAssignments = useMemo(() => {
    if (!selectedClassroom) {
      return [];
    }

    return assignments.filter(
      (assignment) =>
        String(assignment.classroomId) ===
        String(selectedClassroom.id),
    );
  }, [
    assignments,
    selectedClassroom,
  ]);

  /**
   * ADD
   *
   * Backend decides the period.
   *
   * Therefore periodIndex is deliberately NOT sent.
   */
  function handleAddEntry(payload: {
    gradeSubjectId: number;
    teacherId: number;
    teacherAssignmentId: number;
    day: ScheduleDay;
  }) {
    if (
      !schedule?.id ||
      !selectedClassroom
    ) {
      return;
    }

    addMutation.mutate(
      {
        schedule_id: Number(schedule.id),

        class_room_id: Number(
          selectedClassroom.id,
        ),

        teacher_id: payload.teacherId,

        teacher_assignment_id:
          payload.teacherAssignmentId,

        grade_subject_id:
          payload.gradeSubjectId,

        day: payload.day,
      },
      {
        onSuccess: () => {
          setEntryDialogOpen(false);

          void scheduleQuery.refetch();
        },
      },
    );
  }

  /**
   * EDIT
   *
   * Only teacher and subject can be changed.
   *
   * IMPORTANT:
   * day and periodIndex are intentionally NOT sent.
   */
  function handleEditEntry(payload: {
    entryId: number | string;
    gradeSubjectId: number;
    teacherId: number;
  }) {
    updateMutation.mutate(
      {
        entryId: payload.entryId,

        payload: {
          teacher_id: payload.teacherId,
          grade_subject_id:
            payload.gradeSubjectId,
        },
      },
      {
        onSuccess: () => {
          setEntryDialogOpen(false);

          void scheduleQuery.refetch();
        },
      },
    );
  }

  if (isInitialLoading) {
    return <SchedulePageSkeleton />;
  }

  if (academicSettingsQuery.isError) {
    return (
      <ErrorState
        title="Academic settings could not be loaded."
        message={
          academicSettingsQuery.error?.message
        }
        onRetry={() =>
          void academicSettingsQuery.refetch()
        }
      />
    );
  }

  if (!settings) {
    return (
      <ErrorState
        title="Academic settings are unavailable."
        message="The current academic year and semester could not be resolved."
        onRetry={() =>
          void academicSettingsQuery.refetch()
        }
      />
    );
  }

  if (
    !currentAcademicYear ||
    !currentTerm ||
    academicYearId === null ||
    semesterId === null
  ) {
    return (
      <section className="rounded-[26px] border border-amber-200/60 bg-amber-50/60 p-8 text-center">
        <AlertCircle
          className="mx-auto text-amber-600"
          size={24}
        />

        <h2 className="mt-3 text-sm font-semibold">
          No active academic period
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          Set the current academic year and
          current semester from Academic Settings
          before managing schedules.
        </p>
      </section>
    );
  }

  if (
    scheduleQuery.isError &&
    !schedule
  ) {
    return (
      <div className="space-y-5">
        <PageHeader
          academicYear={
            currentAcademicYear.name
          }
          semester={
            currentTerm.semesterName
          }
          onGenerate={openGenerate}
          canGenerate
          isGenerating={
            isAnyMutationPending
          }
        />

        <EmptyScheduleState
          error={
            scheduleQuery.error?.message
          }
          onGenerate={openGenerate}
          isGenerating={
            isAnyMutationPending
          }
        />

        <GenerateScheduleDialog
          open={generationDialogOpen}
          mode={dialogMode}
          isPending={
            isAnyMutationPending
          }
          onClose={() =>
            setGenerationDialogOpen(false)
          }
          onConfirm={
            handleGeneration
          }
        />
      </div>
    );
  }

  const totalEntries =
    schedule?.quality_report.statistics
      .entries ?? 0;

  const teacherConflicts =
    schedule?.quality_report.statistics
      .teacher_conflicts ?? 0;

  const classConflicts =
    schedule?.quality_report.statistics
      .class_conflicts ?? 0;

  const classes =
    schedule?.classes ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        academicYear={
          currentAcademicYear.name
        }
        semester={
          currentTerm.semesterName
        }
        onGenerate={
          schedule
            ? openRegenerate
            : openGenerate
        }
        canGenerate
        isGenerating={
          isAnyMutationPending
        }
        hasSchedule={
          Boolean(schedule)
        }
        totalEntries={
          totalEntries
        }
        teacherConflicts={
          teacherConflicts
        }
        classConflicts={
          classConflicts
        }
        isPerfect={
          schedule?.is_perfect
        }
      />

      {!schedule && (
        <EmptyScheduleState
          onGenerate={openGenerate}
          isGenerating={
            isAnyMutationPending
          }
        />
      )}

      {schedule && (
        <section className="space-y-3">
          {classes.map(
            (classItem, index) => {
              const colorIndex =
                index % 5;

              const cardColors =
                colorIndex === 0
                  ? {
                      border:
                        "border-violet-200/60",
                      bg:
                        "bg-violet-50/45",
                      icon:
                        "bg-violet-100 text-violet-600",
                      button:
                        "border-violet-200/70 bg-violet-100/80 text-violet-700 hover:bg-violet-100",
                    }
                  : colorIndex === 1
                    ? {
                        border:
                          "border-sky-200/60",
                        bg:
                          "bg-sky-50/45",
                        icon:
                          "bg-sky-100 text-sky-600",
                        button:
                          "border-sky-200/70 bg-sky-100/80 text-sky-700 hover:bg-sky-100",
                      }
                    : colorIndex === 2
                      ? {
                          border:
                            "border-emerald-200/60",
                          bg:
                            "bg-emerald-50/45",
                          icon:
                            "bg-emerald-100 text-emerald-600",
                          button:
                            "border-emerald-200/70 bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100",
                        }
                      : colorIndex === 3
                        ? {
                            border:
                              "border-amber-200/60",
                            bg:
                              "bg-amber-50/45",
                            icon:
                              "bg-amber-100 text-amber-600",
                            button:
                              "border-amber-200/70 bg-amber-100/80 text-amber-700 hover:bg-amber-100",
                          }
                        : {
                            border:
                              "border-rose-200/60",
                            bg:
                              "bg-rose-50/45",
                            icon:
                              "bg-rose-100 text-rose-600",
                            button:
                              "border-rose-200/70 bg-rose-100/80 text-rose-700 hover:bg-rose-100",
                          };

              return (
                <section
                  key={`${classItem.grade_name}-${classItem.class_room_name}`}
                  className={[
                    "overflow-hidden rounded-[26px] border bg-card",
                    "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
                    "transition-all duration-300",
                    "hover:-translate-y-[1px]",
                    cardColors.border,
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
                      cardColors.bg,
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
                          cardColors.icon,
                        ].join(" ")}
                      >
                        <CalendarDays size={18} />
                      </span>

                      <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-medium">
                          {
                            classItem.grade_name
                          }{" "}
                          ·{" "}
                          {
                            classItem.class_room_name
                          }
                        </h2>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Weekly class timetable
                        </p>
                      </div>
                    </div>

                    {/* Table-level Add Lesson */}
                    <button
                      type="button"
                      onClick={() =>
                        openTableAddDialog(
                          classItem,
                        )
                      }
                      disabled={
                        isAnyMutationPending
                      }
                      className={[
                        "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border px-4",
                        "text-[12px] font-medium shadow-sm",
                        "transition-all duration-200",
                        "hover:-translate-y-[1px]",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
                        cardColors.button,
                      ].join(" ")}
                    >
                      <Plus size={14} />
                      Add Lesson
                    </button>
                  </div>

                  <div className="border-t border-border/40 p-3 sm:p-4">
                    <ScheduleGrid
                      classes={[
                        classItem,
                      ]}
                      settings={
                        settings.settings
                          .scheduleSettings
                      }
                      onAdd={
                        openAddDialog
                      }
                      onEdit={
                        openEditDialog
                      }
                    />
                  </div>
                </section>
              );
            },
          )}
        </section>
      )}

      {schedule && (
        <ScheduleViolations
          violations={
            schedule.quality_report
              .violations
          }
        />
      )}

      <GenerateScheduleDialog
        open={generationDialogOpen}
        mode={dialogMode}
        isPending={
          isAnyMutationPending
        }
        onClose={() =>
          setGenerationDialogOpen(false)
        }
        onConfirm={
          handleGeneration
        }
      />

      <ScheduleEntryDialog
        open={entryDialogOpen}
        mode={entryMode}
        period={
          selectedPeriod
        }
        initialDay={
          selectedDay
        }
        classroom={
          selectedClassroom
        }
        gradeSubjects={
          selectedGradeSubjects
        }
        assignments={
          selectedAssignments
        }
        teachers={teachers}
        isPending={
          addMutation.isPending ||
          updateMutation.isPending
        }
        onClose={() =>
          setEntryDialogOpen(false)
        }
        onAdd={
          handleAddEntry
        }
        onEdit={
          handleEditEntry
        }
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function PageHeader({
  academicYear,
  semester,
  onGenerate,
  canGenerate,
  isGenerating,
  hasSchedule,
  totalEntries,
  teacherConflicts,
  classConflicts,
  isPerfect,
}: {
  academicYear: string;
  semester: string;
  onGenerate: () => void;
  canGenerate: boolean;
  isGenerating: boolean;
  hasSchedule?: boolean;
  totalEntries?: number;
  teacherConflicts?: number;
  classConflicts?: number;
  isPerfect?: boolean;
}) {
  return (
    <section className="rounded-[24px] border border-border/45 bg-card px-4 py-3.5 shadow-[0_8px_30px_rgba(30,20,70,0.035)] sm:px-4.5 sm:py-4">
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        {/* ---------------------------------------------------------------- */}
        {/* Page identity                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.09] text-primary">
            <CalendarDays size={19} />
          </span>

          <div className="min-w-0">
            <h1 className="text-[16px] font-semibold tracking-[-0.02em]">
              Class Schedules
            </h1>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {academicYear} · {semester}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Actions + statistics                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-0">
          {/* -------------------------------------------------------------- */}
          {/* Statistics                                                     */}
          {/* -------------------------------------------------------------- */}

          {hasSchedule && (
            <div className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4 lg:flex lg:w-auto lg:flex-wrap lg:items-center">
              <MetricCard
                label="Lessons"
                value={totalEntries ?? 0}
                className="border-violet-200/50 bg-violet-50/55 text-violet-700"
              />

              <MetricCard
                label="Teacher Conflicts"
                value={teacherConflicts ?? 0}
                className={
                  teacherConflicts
                    ? "border-rose-200/50 bg-rose-50/55 text-rose-700"
                    : "border-sky-200/50 bg-sky-50/55 text-sky-700"
                }
              />

              <MetricCard
                label="Class Conflicts"
                value={classConflicts ?? 0}
                className={
                  classConflicts
                    ? "border-amber-200/50 bg-amber-50/55 text-amber-700"
                    : "border-emerald-200/50 bg-emerald-50/55 text-emerald-700"
                }
              />

              <MetricCard
                label="Status"
                value={
                  isPerfect
                    ? "Perfect"
                    : "Review"
                }
                className={
                  isPerfect
                    ? "border-emerald-200/50 bg-emerald-50/55 text-emerald-700"
                    : "border-amber-200/50 bg-amber-50/55 text-amber-700"
                }
              />
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Regenerate / Generate                                           */}
          {/* -------------------------------------------------------------- */}

          <div className="w-full lg:ml-5 lg:w-auto">
            <button
              type="button"
              onClick={onGenerate}
              disabled={
                !canGenerate ||
                isGenerating
              }
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
            >
              {isGenerating ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : hasSchedule ? (
                <RefreshCw size={14} />
              ) : (
                <Plus size={14} />
              )}

              {isGenerating
                ? hasSchedule
                  ? "Regenerating..."
                  : "Generating..."
                : hasSchedule
                  ? "Regenerate"
                  : "Generate Schedule"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric Card                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className: string;
}) {
  return (
    <article
      className={[
        "flex h-8 min-w-[78px] items-center justify-center",
        "rounded-[10px] border px-2.5",
        "transition-all duration-200",
        "hover:-translate-y-[1px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <p className="text-[9px] font-medium leading-none tracking-[-0.01em]">
          {label}
        </p>

        <p className="text-[10px] font-medium leading-none opacity-70">
          {value}
        </p>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty Schedule State                                                       */
/* -------------------------------------------------------------------------- */

function EmptyScheduleState({
  error,
  onGenerate,
  isGenerating,
}: {
  error?: string;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="rounded-[26px] border border-dashed border-border/60 bg-card p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.08] text-primary">
        <CalendarDays size={21} />
      </span>

      <h2 className="mt-4 text-[15px] font-semibold">
        No schedule available
      </h2>

      <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
        {error ??
          "There is no generated schedule for the current academic year and semester."}
      </p>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground disabled:opacity-50"
      >
        {isGenerating ? (
          <Loader2
            size={14}
            className="animate-spin"
          />
        ) : (
          <Plus size={14} />
        )}

        Generate Schedule
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-destructive/15 bg-card p-8 text-center">
      <AlertCircle
        className="mx-auto text-destructive"
        size={24}
      />

      <h2 className="mt-3 text-sm font-semibold">
        {title}
      </h2>

      {message && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground"
      >
        Try again
      </button>
    </section>
  );
}