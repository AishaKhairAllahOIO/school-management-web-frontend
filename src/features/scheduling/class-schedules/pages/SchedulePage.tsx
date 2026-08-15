import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { ScheduleViolations } from "../components/ScheduleViolations";
import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";

import {
  useAdminSchedule,
  useGenerateSchedule,
  useRegenerateSchedule,
} from "../hooks/useSchedule";

import { GenerateScheduleDialog } from "../components/GenerateScheduleDialog";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { SchedulePageSkeleton } from "../components/SchedulePageSkeleton";

export function ClassSchedulesPage() {
  const academicSettingsQuery = useAcademicSettings();

  const settings = academicSettingsQuery.data;

  const generateMutation = useGenerateSchedule();
  const regenerateMutation = useRegenerateSchedule();

  const [dialogMode, setDialogMode] = useState<
    "generate" | "regenerate"
  >("generate");

  const [dialogOpen, setDialogOpen] = useState(false);

  const currentAcademicYear = settings?.academicYears.find(
    (year) =>
      year.id === settings.settings.currentAcademicYearId,
  );

  const currentTerm = settings?.academicTerms.find(
    (term) =>
      term.id === settings.settings.currentSemesterId,
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

  const isInitialLoading =
    academicSettingsQuery.isLoading ||
    scheduleQuery.isLoading;

  const isAnyMutationPending =
    generateMutation.isPending ||
    regenerateMutation.isPending;

  function openGenerate() {
    setDialogMode("generate");
    setDialogOpen(true);
  }

  function openRegenerate() {
    setDialogMode("regenerate");
    setDialogOpen(true);
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
          setDialogOpen(false);

          void scheduleQuery.refetch();
        },
      });

      return;
    }

    regenerateMutation.mutate(payload, {
      onSuccess: () => {
        setDialogOpen(false);

        void scheduleQuery.refetch();
      },
    });
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

        <h2 className="mt-3 text-sm font-semibold text-foreground">
          No active academic period
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          Set the current academic year and current
          semester from Academic Settings before
          managing schedules.
        </p>
      </section>
    );
  }

  if (scheduleQuery.isError && !schedule) {
    return (
      <div className="space-y-5">
        <PageHeader
          academicYear={currentAcademicYear.name}
          semester={currentTerm.semesterName}
          onGenerate={openGenerate}
          canGenerate
          isGenerating={isAnyMutationPending}
        />

        <EmptyScheduleState
          error={scheduleQuery.error?.message}
          onGenerate={openGenerate}
          isGenerating={isAnyMutationPending}
        />

        <GenerateScheduleDialog
          open={dialogOpen}
          mode={dialogMode}
          isPending={isAnyMutationPending}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleGeneration}
        />
      </div>
    );
  }

  const totalEntries =
    schedule?.quality_report.statistics.entries ?? 0;

  const teacherConflicts =
    schedule?.quality_report.statistics.teacher_conflicts ??
    0;

  const classConflicts =
    schedule?.quality_report.statistics.class_conflicts ??
    0;

  const classes = schedule?.classes ?? [];

  return (
    <div className="space-y-5">
      {/* Header + Statistics */}
      <PageHeader
        academicYear={currentAcademicYear.name}
        semester={currentTerm.semesterName}
        onGenerate={
          schedule
            ? openRegenerate
            : openGenerate
        }
        canGenerate
        isGenerating={isAnyMutationPending}
        hasSchedule={Boolean(schedule)}
        totalEntries={totalEntries}
        teacherConflicts={teacherConflicts}
        classConflicts={classConflicts}
        isPerfect={schedule?.is_perfect}
      />

      {/* Empty */}
      {!schedule && (
        <EmptyScheduleState
          onGenerate={openGenerate}
          isGenerating={isAnyMutationPending}
        />
      )}

      {/* Schedules */}
      {schedule && (
        <section className="space-y-3">
          {classes.map((classItem, index) => (
            <section
              key={`${classItem.grade_name}-${classItem.class_room_name}`}
              className={[
                "overflow-hidden rounded-[26px] border bg-card",
                "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
                "transition-all duration-300",
                "hover:-translate-y-[1px]",
                index % 5 === 0
                  ? "border-violet-200/60"
                  : index % 5 === 1
                    ? "border-sky-200/60"
                    : index % 5 === 2
                      ? "border-emerald-200/60"
                      : index % 5 === 3
                        ? "border-amber-200/60"
                        : "border-rose-200/60",
              ].join(" ")}
            >
              <div
                className={[
                  "flex items-center gap-3 px-4 py-4 sm:px-5",
                  index % 5 === 0
                    ? "bg-violet-50/45"
                    : index % 5 === 1
                      ? "bg-sky-50/45"
                      : index % 5 === 2
                        ? "bg-emerald-50/45"
                        : index % 5 === 3
                          ? "bg-amber-50/45"
                          : "bg-rose-50/45",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
                    index % 5 === 0
                      ? "bg-violet-100 text-violet-600"
                      : index % 5 === 1
                        ? "bg-sky-100 text-sky-600"
                        : index % 5 === 2
                          ? "bg-emerald-100 text-emerald-600"
                          : index % 5 === 3
                            ? "bg-amber-100 text-amber-600"
                            : "bg-rose-100 text-rose-600",
                  ].join(" ")}
                >
                  <CalendarDays size={18} />
                </span>

                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-medium">
                    {classItem.grade_name} ·{" "}
                    {classItem.class_room_name}
                  </h2>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Weekly class timetable
                  </p>
                </div>
              </div>

              <div className="border-t border-border/40 p-3 sm:p-4">
                <ScheduleGrid
                  classes={[classItem]}
                  settings={
                    settings.settings.scheduleSettings
                  }
                />
              </div>
            </section>
          ))}
        </section>
      )}

      {/* Warnings — intentionally placed BELOW all schedules */}
      {schedule && (
        <ScheduleViolations
          violations={
            schedule.quality_report.violations
          }
        />
      )}

      <GenerateScheduleDialog
        open={dialogOpen}
        mode={dialogMode}
        isPending={isAnyMutationPending}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleGeneration}
      />
    </div>
  );
}

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
  hasSchedule: boolean;
  totalEntries: number;
  teacherConflicts: number;
  classConflicts: number;
  isPerfect?: boolean;
}) {
  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
            <CalendarDays size={20} />
          </span>

          <div>
            <h1 className="text-[17px] font-semibold tracking-[-0.02em]">
              Class Schedules
            </h1>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {academicYear} · {semester}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasSchedule && (
            <>
              <MetricCard
                label="Lessons"
                value={totalEntries}
                className="border-violet-200/60 bg-violet-50/70 text-violet-700"
              />

              <MetricCard
                label="Teacher Conflicts"
                value={teacherConflicts}
                className={
                  teacherConflicts
                    ? "border-rose-200/60 bg-rose-50/70 text-rose-700"
                    : "border-sky-200/60 bg-sky-50/70 text-sky-700"
                }
              />

              <MetricCard
                label="Class Conflicts"
                value={classConflicts}
                className={
                  classConflicts
                    ? "border-amber-200/60 bg-amber-50/70 text-amber-700"
                    : "border-emerald-200/60 bg-emerald-50/70 text-emerald-700"
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
                    ? "border-emerald-200/60 bg-emerald-50/70 text-emerald-700"
                    : "border-amber-200/60 bg-amber-50/70 text-amber-700"
                }
              />
            </>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={
              !canGenerate ||
              isGenerating
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
    </section>
  );
}

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
      className={`flex h-9 min-w-[82px] items-center gap-2 rounded-[13px] border px-3 ${className}`}
    >
      <div>
        <p className="text-[8px] font-medium uppercase tracking-[0.04em] opacity-65">
          {label}
        </p>

        <p className="text-[13px] font-semibold leading-none">
          {value}
        </p>
      </div>
    </article>
  );
}

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