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

export type ScheduleGridTheme = {
  border: string;
  bg: string;
  icon: string;
};

type Props = {
  classes: ScheduleClass[];
  settings: SchoolScheduleSettings;

  defaultOpen?: boolean;

  theme?: ScheduleGridTheme;

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
  defaultOpen = false,
  theme,
  onAdd,
  onEdit,
}: Props) {
  const [isOpen, setIsOpen] =
    useState(defaultOpen);

  const workingDays = settings.workingDays
    .filter(
      (day) => day.periodsCount > 0,
    )
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
      <div
        className="
          rounded-[22px]
          border border-dashed border-border/60
          bg-card
          p-6 text-center
          sm:p-10
        "
      >
        <p className="text-sm font-medium text-foreground">
          No working days configured.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Configure the school schedule settings first.
        </p>
      </div>
    );
  }

  const gridTemplateColumns = `110px repeat(${workingDays.length}, minmax(150px, 1fr))`;

  const toggleTheme = theme ?? {
    border: "border-border/55",
    bg: "bg-card",
    icon: "bg-card text-muted-foreground",
  };

  return (
    <div className="space-y-3">
      {/* Schedule toggle */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((value) => !value)
        }
        className={[
          "flex w-full items-center justify-between gap-3",
          "rounded-[17px] border px-3.5 py-3 text-left",
          "bg-card",
          "transition-all duration-200",
          toggleTheme.border,
          "hover:bg-muted/30",
          "dark:hover:bg-muted/20",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-[10px]
              bg-muted/40
              text-muted-foreground
              dark:bg-muted/50
            "
          >
            {isOpen ? (
              <ChevronUp
                size={15}
                strokeWidth={1.8}
              />
            ) : (
              <ChevronDown
                size={15}
                strokeWidth={1.8}
              />
            )}
          </span>

          <div>
            <p className="text-[11px] font-medium text-foreground">
              Weekly timetable
            </p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {workingDays.length} working days ·{" "}
              {periodsCount} periods
            </p>
          </div>
        </div>

        <span
          className={[
            "rounded-full border px-2.5 py-1",
            "bg-muted/30",
            "text-[9px] font-medium",
            toggleTheme.border,
            "text-muted-foreground",
            "dark:bg-muted/40",
          ].join(" ")}
        >
          {isOpen
            ? "Hide timetable"
            : "View timetable"}
        </span>
      </button>

      {isOpen && (
        <div
          className="
            w-full min-w-0
            overflow-x-auto
            overflow-y-hidden
            rounded-[20px]
            border border-border/55
            bg-card
            overscroll-x-contain
            [scrollbar-width:thin]
          "
        >
          <div
            className="
              min-w-max
              bg-card
            "
            style={{
              minWidth: `${110 + workingDays.length * 150}px`,
            }}
          >
            {/* Header */}
            <div
              className="
                grid
                bg-muted/[0.025]
                dark:bg-muted/[0.08]
              "
              style={{
                gridTemplateColumns,
              }}
            >
              {/* Period header */}
              <div
                className="
                  sticky left-0 z-20
                  border-r border-border/45
                  bg-card
                  px-2 py-2.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-muted-foreground
                  sm:px-3
                  sm:py-3
                  sm:text-[11px]
                "
              >
                Period
              </div>

              {/* Days */}
              {workingDays.map(
                (day) => (
                  <div
                    key={day.day}
                    className="
                      border-r border-border/45
                      bg-card
                      px-2 py-2.5
                      text-center
                      text-[11px]
                      font-medium
                      text-muted-foreground
                      last:border-r-0
                      sm:px-3
                      sm:py-3
                      sm:text-[12px]
                    "
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
                    className="
                      grid
                      border-t border-border/45
                      bg-card
                    "
                    style={{
                      gridTemplateColumns,
                    }}
                  >
                    {/* Period number */}
                    <div
                      className="
                        sticky left-0 z-10
                        flex min-h-[92px]
                        flex-col
                        justify-center
                        border-r border-border/45
                        bg-muted/[0.025]
                        px-2 py-2
                        sm:min-h-[112px]
                        sm:px-3
                        sm:py-3
                        dark:bg-muted/[0.06]
                      "
                    >
                      <span className="text-[11px] font-medium text-foreground sm:text-[12px]">
                        Period {periodIndex}
                      </span>
                    </div>

                    {/* Day cells */}
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
        bg-card
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
            flex h-full
            min-h-[78px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-[12px]
            border border-dashed
            border-border/45
            bg-muted/[0.025]
            px-2
            text-center
            text-[10px]
            text-muted-foreground
            transition-all
            duration-200
            hover:border-primary/30
            hover:bg-primary/[0.035]
            hover:text-primary
            sm:min-h-[96px]
            sm:rounded-[15px]
            dark:bg-muted/[0.06]
            dark:hover:bg-primary/[0.08]
          "
        >
          <span
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-full
              border border-border/40
              bg-muted/30
              transition-all
              group-hover:bg-primary/10
              dark:bg-muted/40
            "
          >
            <Plus
              size={13}
              strokeWidth={1.8}
            />
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