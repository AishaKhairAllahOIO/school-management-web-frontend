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

  const [dialogMode, setDialogMode] = useState<"generate" | "regenerate">(
    "generate",
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const currentAcademicYear = settings?.academicYears.find(
    (year) => year.id === settings.settings.currentAcademicYearId,
  );

  const currentTerm = settings?.academicTerms.find(
    (term) => term.id === settings.settings.currentSemesterId,
  );

  const academicYearId = currentAcademicYear
    ? Number(currentAcademicYear.id)
    : null;

  const semesterId = currentTerm ? Number(currentTerm.id) : null;

  const scheduleQuery = useAdminSchedule(academicYearId, semesterId);

  const schedule = scheduleQuery.data;

  const isInitialLoading =
    academicSettingsQuery.isLoading || scheduleQuery.isLoading;

  const isAnyMutationPending =
    generateMutation.isPending || regenerateMutation.isPending;

  function openGenerate() {
    setDialogMode("generate");
    setDialogOpen(true);
  }

  function openRegenerate() {
    setDialogMode("regenerate");
    setDialogOpen(true);
  }

  function handleGeneration() {
    if (academicYearId === null || semesterId === null) {
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
        message={academicSettingsQuery.error?.message}
        onRetry={() => void academicSettingsQuery.refetch()}
      />
    );
  }

  if (!settings) {
    return (
      <ErrorState
        title="Academic settings are unavailable."
        message="The current academic year and semester could not be resolved."
        onRetry={() => void academicSettingsQuery.refetch()}
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
        <AlertCircle className="mx-auto text-amber-600" size={24} />

        <h2 className="mt-3 text-sm font-semibold text-foreground">
          No active academic period
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          Set the current academic year and current semester from Academic
          Settings before managing schedules.
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

  const totalEntries = schedule?.quality_report.statistics.entries ?? 0;

  const teacherConflicts =
    schedule?.quality_report.statistics.teacher_conflicts ?? 0;

  const classConflicts =
    schedule?.quality_report.statistics.class_conflicts ?? 0;

  const classes = schedule?.classes ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        academicYear={currentAcademicYear.name}
        semester={currentTerm.semesterName}
        onGenerate={openGenerate}
        canGenerate={!schedule}
        isGenerating={isAnyMutationPending}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Lessons"
          value={totalEntries}
          className="border-violet-200/60 bg-violet-50/65 text-violet-700"
        />

        <MetricCard
          label="Teacher Conflicts"
          value={teacherConflicts}
          className={
            teacherConflicts
              ? "border-rose-200/60 bg-rose-50/65 text-rose-700"
              : "border-sky-200/60 bg-sky-50/65 text-sky-700"
          }
        />

        <MetricCard
          label="Class Conflicts"
          value={classConflicts}
          className={
            classConflicts
              ? "border-amber-200/60 bg-amber-50/65 text-amber-700"
              : "border-emerald-200/60 bg-emerald-50/65 text-emerald-700"
          }
        />

        <MetricCard
          label="Status"
          value={schedule?.is_perfect ? "Perfect" : "Needs review"}
          className={
            schedule?.is_perfect
              ? "border-emerald-200/60 bg-emerald-50/65 text-emerald-700"
              : "border-amber-200/60 bg-amber-50/65 text-amber-700"
          }
        />
      </section>

      {schedule && (
        <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.09] text-primary">
                {schedule.is_perfect ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
              </span>

              <div>
                <h2 className="text-[14px] font-semibold">
                  {schedule.is_perfect
                    ? "Schedule generated successfully"
                    : "Schedule generated with warnings"}
                </h2>

                <p className="mt-1 text-[12px] text-muted-foreground">
                  {totalEntries} lessons across {classes.length} classrooms.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openRegenerate}
              disabled={isAnyMutationPending}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={regenerateMutation.isPending ? "animate-spin" : ""}
              />
              Regenerate
            </button>
          </div>
        </section>
      )}
      {schedule && (
  <ScheduleViolations
    violations={schedule.quality_report.violations}
  />
)}

      {!schedule && (
        <EmptyScheduleState
          onGenerate={openGenerate}
          isGenerating={isAnyMutationPending}
        />
      )}

      {schedule && (
        <section className="space-y-4">
          {classes.map((classItem) => (
            <section
              key={`${classItem.grade_name}-${classItem.class_room_name}`}
              className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.09] text-primary">
                  <CalendarDays size={18} />
                </span>

                <div>
                  <h2 className="text-[15px] font-medium">
                    {classItem.grade_name} · {classItem.class_room_name}
                  </h2>

                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Weekly class timetable
                  </p>
                </div>
              </div>

              <ScheduleGrid
                classes={[classItem]}
                settings={settings.settings.scheduleSettings}
              />
            </section>
          ))}
        </section>
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
}: {
  academicYear: string;
  semester: string;
  onGenerate: () => void;
  canGenerate: boolean;
  isGenerating: boolean;
}) {
  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
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

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}

          {isGenerating ? "Generating..." : "Generate Schedule"}
        </button>
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
    <article className={`rounded-[22px] border p-4 ${className}`}>
      <p className="text-[11px] font-medium opacity-75">{label}</p>

      <p className="mt-2 text-[23px] font-semibold tracking-[-0.03em]">
        {value}
      </p>
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

      <h2 className="mt-4 text-[15px] font-semibold">No schedule available</h2>

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
          <Loader2 size={14} className="animate-spin" />
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
      <AlertCircle className="mx-auto text-destructive" size={24} />

      <h2 className="mt-3 text-sm font-semibold">{title}</h2>

      {message && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{message}</p>
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
