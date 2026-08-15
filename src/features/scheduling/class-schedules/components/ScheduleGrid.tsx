import {
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useState } from "react";

import type {
  SchoolDay,
  SchoolDayConfiguration,
  SchoolScheduleSettings,
} from "@/features/settings/academic/types/academic-settings.types";

import type {
  ScheduleClass,
  ScheduleDay,
  SchedulePeriod,
} from "../types/schedule.types";

import { ScheduleClassCard } from "./ScheduleClassCard";

const dayColors = [
  "bg-violet-50/55",
  "bg-sky-50/55",
  "bg-emerald-50/55",
  "bg-amber-50/55",
  "bg-rose-50/55",
];

const dayOrder: SchoolDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const dayLabels: Record<SchoolDay, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

type Props = {
  classes: ScheduleClass[];
  settings: SchoolScheduleSettings;

  defaultOpen?: boolean;

  onAdd?: (args: {
    classItem: ScheduleClass;
    day: ScheduleDay;
    periodIndex: number;
  }) => void;

  onEdit?: (args: {
    classItem: ScheduleClass;
    period: SchedulePeriod;
    day: ScheduleDay;
  }) => void;
};

export function ScheduleGrid({
  classes,
  settings,
  defaultOpen = true,
  onAdd,
  onEdit,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const workingDays = settings.workingDays
    .filter((day) => day.periodsCount > 0)
    .sort(
      (a, b) =>
        dayOrder.indexOf(a.day) -
        dayOrder.indexOf(b.day),
    );

  const periodsCount = Math.max(
    ...workingDays.map(
      (day) => day.periodsCount,
    ),
    0,
  );

  if (!workingDays.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-border/60 p-6 text-center sm:p-10">
        <p className="text-sm font-medium">
          No working days configured.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Configure the school schedule settings first.
        </p>
      </div>
    );
  }

  const gridTemplateColumns = `110px repeat(${workingDays.length}, minmax(150px, 1fr))`;

  return (
    <div className="space-y-3">
      {/* Schedule toggle */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((value) => !value)
        }
        className={[
          "flex w-full items-center justify-between gap-3 rounded-[17px] border px-3.5 py-3 text-left transition-all duration-200",
          isOpen
            ? "border-primary/15 bg-primary/[0.035]"
            : "border-border/50 bg-background hover:border-primary/15 hover:bg-muted/[0.22]",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/[0.08] text-primary">
            {isOpen ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </span>

          <div>
            <p className="text-[11px] font-semibold text-foreground">
              Weekly timetable
            </p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {workingDays.length} working days ·{" "}
              {periodsCount} periods
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[9px] font-medium text-muted-foreground">
          {isOpen
            ? "Hide timetable"
            : "View timetable"}
        </span>
      </button>

      {isOpen && (
        <div
          className="
            w-full min-w-0 overflow-x-auto overflow-y-hidden
            rounded-[20px] border border-border/55
            overscroll-x-contain
            [scrollbar-width:thin]
          "
        >
          <div
            className="min-w-max"
            style={{
              minWidth: `${110 + workingDays.length * 150}px`,
            }}
          >
            {/* Header */}
            <div
              className="grid bg-muted/[0.18]"
              style={{
                gridTemplateColumns,
              }}
            >
              <div
                className="
                  sticky left-0 z-20
                  border-r border-border/45
                  bg-muted/[0.18]
                  px-2 py-2.5
                  text-[10px] font-medium
                  uppercase tracking-[0.08em]
                  text-muted-foreground
                  sm:px-3 sm:py-3 sm:text-[11px]
                "
              >
                Period
              </div>

              {workingDays.map(
                (day, index) => (
                  <div
                    key={day.day}
                    className={[
                      `
                        border-r border-border/45
                        px-2 py-2.5
                        text-center
                        text-[11px] font-medium
                        last:border-r-0
                        sm:px-3 sm:py-3 sm:text-[12px]
                      `,
                      dayColors[
                        index % dayColors.length
                      ],
                    ].join(" ")}
                  >
                    {dayLabels[day.day]}
                  </div>
                ),
              )}
            </div>

            {/* Period rows */}
            {Array.from(
              {
                length: periodsCount,
              },
              (_, index) => {
                const periodIndex =
                  index + 1;

                return (
                  <div
                    key={periodIndex}
                    className="grid border-t border-border/45"
                    style={{
                      gridTemplateColumns,
                    }}
                  >
                    <div
                      className="
                        sticky left-0 z-10
                        flex min-h-[92px]
                        flex-col justify-center
                        border-r border-border/45
                        bg-muted/[0.10]
                        px-2 py-2
                        sm:min-h-[112px]
                        sm:px-3 sm:py-3
                      "
                    >
                      <span className="text-[11px] font-medium sm:text-[12px]">
                        Period {periodIndex}
                      </span>
                    </div>

                    {workingDays.map(
                      (day) => (
                        <ScheduleCell
                          key={day.day}
                          day={day}
                          periodIndex={
                            periodIndex
                          }
                          classes={classes}
                          onAdd={onAdd}
                          onEdit={onEdit}
                        />
                      ),
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleCell({
  day,
  periodIndex,
  classes,
  onAdd,
  onEdit,
}: {
  day: SchoolDayConfiguration;
  periodIndex: number;
  classes: ScheduleClass[];

  onAdd?: Props["onAdd"];
  onEdit?: Props["onEdit"];
}) {
  const lessons = classes.flatMap(
    (classItem) => {
      const periods =
        classItem.schedule[
          day.day as ScheduleDay
        ] ?? [];

      return periods
        .filter(
          (period) =>
            period.period_index ===
            periodIndex,
        )
        .map((period) => ({
          classItem,
          period,
        }));
    },
  );

  return (
    <div
      className="
        min-h-[92px]
        border-r border-border/45
        p-1.5
        last:border-r-0
        sm:min-h-[112px]
        sm:p-2
      "
    >
      {lessons.length === 0 ? (
        <button
          type="button"
          onClick={() =>
            onAdd?.({
              classItem: classes[0],
              day:
                day.day as ScheduleDay,
              periodIndex,
            })
          }
          className="
            group
            flex h-full min-h-[78px] w-full
            flex-col items-center justify-center
            rounded-[12px]
            border border-dashed border-border/45
            px-2
            text-center
            text-[10px]
            text-muted-foreground
            transition-all duration-200
            hover:border-primary/30
            hover:bg-primary/[0.035]
            hover:text-primary
            sm:min-h-[96px]
            sm:rounded-[15px]
          "
        >
          <span
            className="
              flex h-7 w-7 items-center justify-center
              rounded-full
              bg-muted/50
              transition-all
              group-hover:bg-primary/10
            "
          >
            <Plus size={13} />
          </span>

          <span className="mt-1">
            Add lesson
          </span>
        </button>
      ) : (
        <div className="space-y-1.5">
          {lessons.map(
            ({ classItem, period }) => (
              <ScheduleClassCard
                key={String(
                  period.entry_id,
                )}
                period={period}
                onEdit={() =>
                  onEdit?.({
                    classItem,
                    period,
                    day:
                      day.day as ScheduleDay,
                  })
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}