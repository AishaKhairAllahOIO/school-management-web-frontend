import {
  CalendarDays,
  Clock3,
  GraduationCap,
  Loader2,
  UserRound,
} from "lucide-react";

import {
  useCurrentAcademicPeriod,
  useTeacherSchedule,
} from "@/features/scheduling/class-schedules/hooks/useSchedule";

const days = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
] as const;

export function TimeSlotsPage() {
  const {
    academicYearId,
    semesterId,
    isReady,
    isLoading: isPeriodLoading,
  } = useCurrentAcademicPeriod();

  const {
    data: teacherSchedule,
    isLoading: isScheduleLoading,
    isError,
  } = useTeacherSchedule(academicYearId, semesterId);

  const isLoading = isPeriodLoading || isScheduleLoading;

  if (isLoading) {
    return (
      <section className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-success" />
            <p className="text-sm">Loading teacher schedule...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isReady) {
    return (
      <section className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CalendarDays size={25} strokeWidth={1.8} />
          </span>

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Teacher Schedule
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Please configure the current academic year and semester to view
            the teacher schedule.
          </p>
        </div>
      </section>
    );
  }

  if (isError || !teacherSchedule) {
    return (
      <section className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <CalendarDays size={25} strokeWidth={1.8} />
          </span>

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Unable to load schedule
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            No teacher schedule is available for the current academic year
            and semester.
          </p>
        </div>
      </section>
    );
  }

  /*
   * The API returns the teacher schedule grouped by teacher.
   * We flatten the entries here only for presentation.
   */
const teachers = Object.entries(teacherSchedule).map(
  ([teacher_name, schedule]) => ({
    teacher_name,
    schedule,
  }),
);
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_12px_35px_rgba(38,24,84,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CalendarDays size={22} strokeWidth={1.8} />
            </span>

            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Teacher Schedule
              </h1>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Weekly timetable for teachers in the current academic period.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
            <Clock3 size={16} />
            Current Schedule
          </div>
        </div>
      </div>

      {/* Teacher schedules */}
      {teachers.length === 0 ? (
        <div className="rounded-[24px] border border-border/70 bg-card p-10 text-center shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
          <UserRound className="mx-auto h-8 w-8 text-success" />

          <h2 className="mt-3 font-semibold text-foreground">
            No teacher schedule found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            There are no scheduled entries for the current academic period.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {teachers.map((teacher) => (
            <TeacherScheduleCard
              key={teacher.teacher_name}
              teacher={teacher}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TeacherScheduleCard({ teacher }: { teacher: any }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
      {/* Teacher header */}
      <div className="flex items-center gap-3 border-b border-border/70 bg-success/[0.06] px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
          <GraduationCap size={19} strokeWidth={1.8} />
        </span>

        <div>
          <h2 className="font-semibold text-foreground">
            {teacher.teacher_name}
          </h2>

          <p className="text-xs text-muted-foreground">
            Weekly Schedule
          </p>
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/70 bg-muted/30">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Time
            </div>

            {days.map((day) => (
              <div
                key={day.key}
                className="border-l border-border/60 px-4 py-3 text-sm font-semibold text-foreground"
              >
                {day.label}
              </div>
            ))}
          </div>

          <TeacherDesktopGrid teacher={teacher} />
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-4 p-4 md:hidden">
        {days.map((day) => {
          const entries = teacher.schedule?.[day.key] ?? [];

          return (
            <div
              key={day.key}
              className="overflow-hidden rounded-2xl border border-border/70"
            >
              <div className="bg-success/10 px-4 py-3 text-sm font-semibold text-success">
                {day.label}
              </div>

              {entries.length === 0 ? (
                <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                  No classes
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {entries.map((entry: any) => (
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

function TeacherDesktopGrid({ teacher }: { teacher: any }) {
  const maxPeriods = Math.max(
    0,
    ...days.map(
      (day) =>
        (teacher.schedule?.[day.key] ?? []).length,
    ),
  );

  return (
    <>
      {Array.from({ length: maxPeriods }).map((_, index) => {
        const period = index + 1;

        const referenceEntry = days
          .map((day) => teacher.schedule?.[day.key] ?? [])
          .flat()
          .find((entry: any) => entry.period_index === period);

        return (
          <div
            key={period}
            className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-border/60 last:border-b-0"
          >
            <div className="flex flex-col justify-center bg-muted/20 px-4 py-3">
              <span className="text-xs font-semibold text-foreground">
                Period {period}
              </span>

              {referenceEntry && (
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {referenceEntry.start_time} - {referenceEntry.end_time}
                </span>
              )}
            </div>

            {days.map((day) => {
              const entry = (
                teacher.schedule?.[day.key] ?? []
              ).find(
                (item: any) => item.period_index === period,
              );

              return (
                <div
                  key={day.key}
                  className="border-l border-border/60 p-2"
                >
                  {entry ? (
                    <ScheduleCell entry={entry} />
                  ) : (
                    <div className="flex h-full min-h-[90px] items-center justify-center rounded-xl bg-muted/20 text-xs text-muted-foreground">
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

function ScheduleEntry({ entry }: { entry: any }) {
  return (
    <div className="p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {entry.subject_name}
          </p>

          {entry.class_room_name && (
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.grade_name} • {entry.class_room_name}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-lg bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
          {entry.start_time}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {entry.start_time} - {entry.end_time}
      </p>
    </div>
  );
}

function ScheduleCell({ entry }: { entry: any }) {
  return (
    <div className="min-h-[90px] rounded-xl border border-success/15 bg-success/[0.06] p-3 transition-colors hover:bg-success/10">
      <p className="text-sm font-semibold leading-5 text-foreground">
        {entry.subject_name}
      </p>

      {entry.class_room_name && (
        <p className="mt-2 text-xs text-muted-foreground">
          {entry.grade_name} • {entry.class_room_name}
        </p>
      )}

      <p className="mt-2 text-[11px] text-success">
        {entry.start_time} - {entry.end_time}
      </p>
    </div>
  );
}