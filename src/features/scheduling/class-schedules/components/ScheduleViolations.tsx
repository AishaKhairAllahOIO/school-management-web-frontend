import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { useState } from "react";

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
  const [openViolations, setOpenViolations] = useState<
    Record<number, boolean>
  >({});

  const [expanded, setExpanded] = useState(false);

  if (!violations.length) {
    return (
      <section className="overflow-hidden rounded-[26px] border border-emerald-200/60 bg-emerald-50/45 shadow-[0_10px_35px_rgba(30,20,70,0.025)]">
        <div className="flex items-center gap-3 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-emerald-100 text-emerald-600">
            <AlertTriangle size={18} />
          </span>

          <div>
            <h2 className="text-[14px] font-semibold text-emerald-800">
              No schedule violations
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-emerald-700/75">
              The generated schedule satisfies all detected
              scheduling constraints.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visibleViolations = expanded
    ? violations
    : violations.slice(0, 3);

  function toggleViolation(index: number) {
    setOpenViolations((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  return (
    <section className="overflow-hidden rounded-[26px] border border-amber-200/60 bg-card shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/45 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
            <AlertTriangle size={18} />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold">
                Schedule violations
              </h2>

              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                {violations.length}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Review detected scheduling conflicts.
            </p>
          </div>
        </div>

        {violations.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="shrink-0 rounded-full border border-border/60 bg-background px-3 py-1.5 text-[10px] font-medium text-foreground/70 transition hover:bg-muted/50"
          >
            {expanded ? "Show less" : `Show all (${violations.length})`}
          </button>
        )}
      </div>

      {/* Violations */}
      <div className="space-y-2 p-3 sm:p-4">
        {visibleViolations.map((violation, index) => {
          const isOpen = openViolations[index] ?? false;
          const dayLabel = getDayLabel(violation.day);

          return (
            <article
              key={getViolationKey(violation, index)}
              className={[
                "overflow-hidden rounded-[17px] border transition-all duration-200",
                isOpen
                  ? "border-amber-200/80 bg-amber-50/35"
                  : "border-border/50 bg-background hover:border-amber-200/70 hover:bg-amber-50/20",
              ].join(" ")}
            >
              {/* Compact row */}
              <button
                type="button"
                onClick={() => toggleViolation(index)}
                className="flex w-full items-center gap-3 p-3 text-left sm:p-3.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-amber-100 text-amber-600">
                  <AlertTriangle size={14} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-[12px] font-semibold text-foreground">
                      {getViolationTitle(violation.type)}
                    </h3>

                    {violation.class_room_name && (
                      <span className="max-w-[180px] truncate rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {violation.class_room_name}
                      </span>
                    )}

                    {dayLabel && (
                      <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {dayLabel}
                      </span>
                    )}
                  </div>

                  {!isOpen && (
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {getViolationDescription(violation)}
                    </p>
                  )}
                </div>

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground">
                  {isOpen ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </span>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-amber-200/50 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
                  <p className="text-[10px] leading-4 text-muted-foreground">
                    {getViolationDescription(violation)}
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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