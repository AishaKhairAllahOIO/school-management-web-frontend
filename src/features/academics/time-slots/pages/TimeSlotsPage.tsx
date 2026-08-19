import {
  CalendarDays,
  Clock3,
  GraduationCap,
  UserRound,
} from "lucide-react";

import {
  useCurrentAcademicPeriod,
  useTeacherSchedule,
} from "@/features/scheduling/class-schedules/hooks/useSchedule";

import { BackToAcademicsOverview } from "../../shared/components/CrudPage";
import { useAcademicTheme } from "../../shared/hooks/useAcademicTheme";

const days = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
] as const;

type ScheduleEntryType = {
  period_index: number;
  subject_name?: string | null;
  grade_name?: string | null;
  class_room_name?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};

type TeacherSchedule = Record<
  string,
  Record<string, ScheduleEntryType[]>
>;

type TeacherScheduleItem = {
  teacher_name: string;
  schedule: Record<string, ScheduleEntryType[]>;
};

export function TimeSlotsPage() {
  const {
    academicYearId,
    semesterId,
    isReady,
    isLoading: isPeriodLoading,
  } = useCurrentAcademicPeriod();

  const academicTheme = useAcademicTheme();

  const {
    data: teacherSchedule,
    isLoading: isScheduleLoading,
    isError,
  } = useTeacherSchedule(academicYearId, semesterId);

  const isLoading = isPeriodLoading || isScheduleLoading;

  if (isLoading) {
    return (
      <div className="space-y-4" style={academicTheme.style}>
        <BackToAcademicsOverview />

        {/* Header */}
        <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_34px_rgba(31,24,74,0.055)] dark:shadow-black/10">
          <header className="relative overflow-hidden px-6 py-5 sm:px-7">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--academic-accent)]" />

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--academic-soft)] opacity-60 blur-3xl dark:opacity-30" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
                  <CalendarDays size={25} strokeWidth={1.75} />
                </span>

                <div className="min-w-0">
                  <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-foreground">
                    Teacher Schedule
                  </h1>

                  <p className="mt-1 text-sm font-normal text-[var(--academic-accent)]">
                    Academic Schedule
                  </p>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Weekly timetable for teachers in the current academic
                    period.
                  </p>
                </div>
              </div>

              <div className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--academic-soft)] px-5 text-sm font-medium text-[var(--academic-accent)] sm:w-auto">
                <Clock3 size={16} strokeWidth={1.8} />
                Current Schedule
              </div>
            </div>
          </header>
        </section>

        {/* Skeleton */}
        <div className="space-y-4">
          {[1, 2].map((teacher) => (
            <section
              key={teacher}
              className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_10px_30px_rgba(31,24,74,0.045)] dark:shadow-black/10"
            >
              <div className="border-b border-border/65 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-[14px] bg-muted" />

                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded-md bg-muted/70" />
                  </div>
                </div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/65 bg-muted/20 dark:bg-muted/10">
                    <div className="h-10 animate-pulse bg-muted/30" />

                    {days.map((day) => (
                      <div
                        key={day.key}
                        className="border-l border-border/60 px-4 py-3"
                      >
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      </div>
                    ))}
                  </div>

                  {[1, 2, 3, 4].map((period) => (
                    <div
                      key={period}
                      className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/60 last:border-b-0"
                    >
                      <div className="space-y-2 bg-muted/15 px-4 py-4">
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-muted/70" />
                      </div>

                      {days.map((day) => (
                        <div
                          key={day.key}
                          className="border-l border-border/60 p-2"
                        >
                          <div className="min-h-[88px] animate-pulse rounded-[16px] bg-muted/40 p-3">
                            <div className="h-3.5 w-3/4 rounded bg-muted" />
                            <div className="mt-3 h-2.5 w-1/2 rounded bg-muted/70" />
                            <div className="mt-3 h-2.5 w-1/3 rounded bg-muted/60" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {days.map((day) => (
                  <div
                    key={day.key}
                    className="overflow-hidden rounded-[18px] border border-border/65"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 bg-[var(--academic-soft)] px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      <div className="h-2.5 w-12 animate-pulse rounded bg-muted/60" />
                    </div>

                    <div className="divide-y divide-border/60">
                      {[1, 2].map((entry) => (
                        <div key={entry} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                              <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/70" />
                            </div>

                            <div className="h-5 w-12 shrink-0 animate-pulse rounded-full bg-muted/60" />
                          </div>

                          <div className="mt-3 h-2.5 w-24 animate-pulse rounded bg-muted/60" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="space-y-4" style={academicTheme.style}>
        <BackToAcademicsOverview />

        <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_34px_rgba(31,24,74,0.055)] dark:shadow-black/10">
          <header className="relative overflow-hidden px-6 py-8 sm:px-7">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--academic-accent)]" />

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--academic-soft)] opacity-60 blur-3xl dark:opacity-30" />

            <div className="relative flex flex-col items-center justify-center py-8 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
                <CalendarDays size={25} strokeWidth={1.75} />
              </span>

              <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-foreground">
                Teacher Schedule
              </h1>

              <p className="mt-1 text-sm font-normal text-[var(--academic-accent)]">
                Academic Schedule
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Please configure the current academic year and semester to
                view the teacher schedule.
              </p>
            </div>
          </header>
        </section>
      </div>
    );
  }

  if (isError || !teacherSchedule) {
    return (
      <div className="space-y-4" style={academicTheme.style}>
        <BackToAcademicsOverview />

        <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_34px_rgba(31,24,74,0.055)] dark:shadow-black/10">
          <header className="relative overflow-hidden px-6 py-8 sm:px-7">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--academic-accent)]" />

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--academic-soft)] opacity-60 blur-3xl dark:opacity-30" />

            <div className="relative flex flex-col items-center justify-center py-8 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
                <CalendarDays size={25} strokeWidth={1.75} />
              </span>

              <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-foreground">
                Unable to load schedule
              </h1>

              <p className="mt-1 text-sm font-normal text-[var(--academic-accent)]">
                Academic Schedule
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                No teacher schedule is available for the current academic year
                and semester.
              </p>
            </div>
          </header>
        </section>
      </div>
    );
  }

  const teachers: TeacherScheduleItem[] = Object.entries(
    teacherSchedule as TeacherSchedule,
  ).map(([teacher_name, schedule]) => ({
    teacher_name,
    schedule,
  }));

  return (
    <div className="space-y-4" style={academicTheme.style}>
      <BackToAcademicsOverview />

      {/* Main Header */}
      <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_34px_rgba(31,24,74,0.055)] dark:shadow-black/10">
        <header className="relative overflow-hidden px-6 py-5 sm:px-7">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--academic-accent)]" />

          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--academic-soft)] opacity-60 blur-3xl dark:opacity-30" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
                <CalendarDays size={25} strokeWidth={1.75} />
              </span>

              <div className="min-w-0">
                <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-foreground">
                  Teacher Schedule
                </h1>

                <p className="mt-1 text-sm font-normal text-[var(--academic-accent)]">
                  Academic Schedule
                </p>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Weekly timetable for teachers in the current academic period.
                </p>
              </div>
            </div>

            <div className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--academic-soft)] px-5 text-sm font-medium text-[var(--academic-accent)] sm:w-auto">
              <Clock3 size={16} strokeWidth={1.8} />
              Current Schedule
            </div>
          </div>
        </header>
      </section>

      {/* Teacher schedules */}
      {teachers.length === 0 ? (
        <section className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_10px_30px_rgba(31,24,74,0.045)] dark:shadow-black/10">
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
              <UserRound size={24} strokeWidth={1.7} />
            </span>

            <h2 className="mt-4 text-base font-medium text-foreground">
              No teacher schedule found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
              There are no scheduled entries for the current academic period.
            </p>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <TeacherScheduleCard
              key={teacher.teacher_name}
              teacher={teacher}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherScheduleCard({
  teacher,
}: {
  teacher: TeacherScheduleItem;
}) {
  return (
    <section className="group overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_10px_30px_rgba(31,24,74,0.045)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--academic-border)] hover:shadow-[var(--shadow-floating)] dark:shadow-black/10">
      {/* Teacher header */}
      <header className="relative overflow-hidden border-b border-border/65 px-5 py-4 sm:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--academic-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-40" />

        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[var(--academic-soft)] opacity-50 blur-3xl dark:opacity-25" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
            <GraduationCap size={20} strokeWidth={1.75} />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-foreground sm:text-base">
              {teacher.teacher_name}
            </h2>

            <p className="mt-0.5 text-xs text-[var(--academic-accent)]">
              Weekly Schedule
            </p>
          </div>
        </div>
      </header>

      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/65 bg-muted/20 dark:bg-muted/10">
            <div className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
              Time
            </div>

            {days.map((day) => (
              <div
                key={day.key}
                className="border-l border-border/60 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70"
              >
                {day.label}
              </div>
            ))}
          </div>

          <TeacherDesktopGrid teacher={teacher} />
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 p-4 md:hidden">
        {days.map((day) => {
          const entries = teacher.schedule?.[day.key] ?? [];

          return (
            <div
              key={day.key}
              className="overflow-hidden rounded-[18px] border border-border/65 bg-card"
            >
              <div className="flex items-center justify-between border-b border-border/60 bg-[var(--academic-soft)] px-4 py-3">
                <span className="text-xs font-medium text-[var(--academic-accent)]">
                  {day.label}
                </span>

                <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/65">
                  {entries.length}{" "}
                  {entries.length === 1 ? "class" : "classes"}
                </span>
              </div>

              {entries.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No classes
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {entries.map((entry) => (
                    <ScheduleEntry
                      key={`${day.key}-${entry.period_index}`}
                      entry={entry}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TeacherDesktopGrid({
  teacher,
}: {
  teacher: TeacherScheduleItem;
}) {
  const maxPeriods = Math.max(
    0,
    ...days.map(
      (day) => (teacher.schedule?.[day.key] ?? []).length,
    ),
  );

  return (
    <>
      {Array.from({ length: maxPeriods }).map((_, index) => {
        const period = index + 1;

        const referenceEntry = days
          .map((day) => teacher.schedule?.[day.key] ?? [])
          .flat()
          .find((entry) => entry.period_index === period);

        return (
          <div
            key={period}
            className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/60 last:border-b-0"
          >
            <div className="flex flex-col justify-center bg-muted/15 px-4 py-3 dark:bg-muted/10">
              <span className="text-xs font-medium text-foreground">
                Period {period}
              </span>

              {referenceEntry && (
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {referenceEntry.start_time} -{" "}
                  {referenceEntry.end_time}
                </span>
              )}
            </div>

            {days.map((day) => {
              const entry = (
                teacher.schedule?.[day.key] ?? []
              ).find(
                (item) => item.period_index === period,
              );

              return (
                <div
                  key={day.key}
                  className="border-l border-border/60 p-2"
                >
                  {entry ? (
                    <ScheduleCell entry={entry} />
                  ) : (
                    <div className="flex h-full min-h-[88px] items-center justify-center rounded-[16px] bg-muted/15 text-[11px] text-muted-foreground dark:bg-muted/10">
                      Free
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function ScheduleEntry({
  entry,
}: {
  entry: ScheduleEntryType;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {entry.subject_name || "Untitled subject"}
          </p>

          {entry.class_room_name && (
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.grade_name || "—"}{" "}
              <span className="text-muted-foreground/50">
                •
              </span>{" "}
              {entry.class_room_name}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-full bg-[var(--academic-soft)] px-3 py-1 text-[10px] font-medium text-[var(--academic-accent)]">
          {entry.start_time || "—"}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        {entry.start_time || "—"} -{" "}
        {entry.end_time || "—"}
      </p>
    </div>
  );
}

function ScheduleCell({
  entry,
}: {
  entry: ScheduleEntryType;
}) {
  return (
    <div
      className="
        min-h-[88px]
        rounded-[16px]
        border
        border-[var(--academic-border)]
        bg-[var(--academic-soft)]/45
        p-3
        transition-[background-color,transform]
        duration-200
        hover:-translate-y-0.5
        hover:bg-[var(--academic-soft)]

        dark:bg-[var(--academic-soft)]/20
        dark:hover:bg-[var(--academic-soft)]/30
      "
    >
      <p className="text-sm font-medium leading-5 text-foreground">
        {entry.subject_name || "Untitled subject"}
      </p>

      {entry.class_room_name && (
        <p className="mt-2 text-xs text-muted-foreground">
          {entry.grade_name || "—"}{" "}
          <span className="text-muted-foreground/50">
            •
          </span>{" "}
          {entry.class_room_name}
        </p>
      )}

      <p className="mt-2 text-[10px] font-medium text-[var(--academic-accent)]">
        {entry.start_time || "—"} -{" "}
        {entry.end_time || "—"}
      </p>
    </div>
  );
}