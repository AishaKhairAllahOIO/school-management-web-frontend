import {
  AlertTriangle,
  CalendarDays,
  BookOpen,
  Users,
} from "lucide-react";

import type {
  ScheduleDay,
  ScheduleViolation,
} from "../types/schedule.types";

type Props = {
  violations: ScheduleViolation[];
};

const dayLabels: Record<ScheduleDay, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

function getViolationTitle(type: string) {
  switch (type) {
    case "daily_subject_limit":
      return "Daily subject limit";

    case "teacher_conflict":
      return "Teacher conflict";

    case "class_conflict":
      return "Class conflict";

    default:
      return type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function getViolationDescription(
  violation: ScheduleViolation,
) {
  switch (violation.type) {
    case "daily_subject_limit":
      return "The same subject exceeds the allowed number of periods on this day.";

    case "teacher_conflict":
      return "A teacher has conflicting lessons at the same time.";

    case "class_conflict":
      return "A class has conflicting lessons at the same time.";

    default:
      return "The schedule contains a constraint violation that needs review.";
  }
}

function getDayLabel(day?: ScheduleDay) {
  if (!day) {
    return null;
  }

  return dayLabels[day] ?? day;
}

function getViolationKey(
  violation: ScheduleViolation,
  index: number,
) {
  return [
    violation.type,
    violation.class_room_id,
    violation.class_room_name,
    violation.day,
    violation.subject,
    index,
  ].join("-");
}

export function ScheduleViolations({
  violations,
}: Props) {
  if (!violations.length) {
    return (
      <section className="rounded-[26px] border border-emerald-200/60 bg-emerald-50/50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-emerald-100 text-emerald-600">
            <AlertTriangle size={18} />
          </span>

          <div>
            <h2 className="text-[14px] font-semibold text-emerald-800">
              No schedule violations
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-emerald-700/75">
              The generated schedule satisfies all detected scheduling
              constraints.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-amber-200/60 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
          <AlertTriangle size={18} />
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[14px] font-semibold">
              Schedule violations
            </h2>

            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              {violations.length}
            </span>
          </div>

          <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
            The generated schedule contains constraints that need review.
          </p>
        </div>
      </div>

      {/* Violations */}
      <div className="mt-4 space-y-3">
        {violations.map((violation, index) => {
          const dayLabel = getDayLabel(violation.day);

          return (
            <article
              key={getViolationKey(violation, index)}
              className="rounded-[18px] border border-amber-200/60 bg-amber-50/45 p-4"
            >
              {/* Violation title */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-amber-100 text-amber-600">
                    <AlertTriangle size={15} />
                  </span>

                  <div>
                    <h3 className="text-[12px] font-semibold text-foreground">
                      {getViolationTitle(violation.type)}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      {getViolationDescription(violation)}
                    </p>
                  </div>
                </div>

                <span className="self-start rounded-full border border-amber-200/70 bg-background px-2.5 py-1 text-[10px] font-medium text-amber-700">
                  {violation.type}
                </span>
              </div>

              {/* Context */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {violation.grade_name && (
                  <InfoItem
                    label="Grade"
                    value={violation.grade_name}
                  />
                )}

                {violation.class_room_name && (
                  <InfoItem
                    label="Classroom"
                    value={violation.class_room_name}
                    icon={<Users size={11} />}
                  />
                )}

                {dayLabel && (
                  <InfoItem
                    label="Day"
                    value={dayLabel}
                    icon={<CalendarDays size={11} />}
                  />
                )}

                {violation.subject !== undefined && (
                  <InfoItem
                    label="Subject ID"
                    value={String(violation.subject)}
                    icon={<BookOpen size={11} />}
                  />
                )}
              </div>

              {/* Limit information */}
              {(violation.count !== undefined ||
                violation.limit !== undefined) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {violation.count !== undefined && (
                    <div className="rounded-[12px] border border-rose-200/60 bg-rose-50 px-3 py-2">
                      <p className="text-[9px] font-medium text-rose-600/70">
                        Scheduled
                      </p>

                      <p className="mt-0.5 text-[14px] font-semibold text-rose-700">
                        {violation.count}
                      </p>
                    </div>
                  )}

                  {violation.limit !== undefined && (
                    <div className="rounded-[12px] border border-emerald-200/60 bg-emerald-50 px-3 py-2">
                      <p className="text-[9px] font-medium text-emerald-600/70">
                        Allowed
                      </p>

                      <p className="mt-0.5 text-[14px] font-semibold text-emerald-700">
                        {violation.limit}
                      </p>
                    </div>
                  )}

                  {violation.count !== undefined &&
                    violation.limit !== undefined && (
                      <div className="flex items-center rounded-[12px] border border-amber-200/60 bg-background px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">
                          Exceeds limit by{" "}
                          <span className="font-semibold text-amber-700">
                            {Math.max(
                              violation.count -
                                violation.limit,
                              0,
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[13px] border border-border/50 bg-background/70 px-3 py-2.5">
      <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-1.5">
        {icon && (
          <span className="text-muted-foreground">
            {icon}
          </span>
        )}

        <p className="truncate text-[11px] font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}