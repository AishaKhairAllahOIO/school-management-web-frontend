import type {
  SchoolDay,
  SchoolDayConfiguration,
  SchoolScheduleSettings,
} from "@/features/settings/academic/types/academic-settings.types";

import type {
  ScheduleClass,
  ScheduleDay,
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
};

export function ScheduleGrid({
  classes,
  settings,
}: Props) {
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

  /*
   * Desktop:
   * - Keeps the existing grid proportions.
   *
   * Mobile:
   * - The grid gets a minimum width.
   * - Horizontal scrolling happens INSIDE this container.
   * - The page itself will not overflow horizontally.
   */
  const gridTemplateColumns = `110px repeat(${workingDays.length}, minmax(150px, 1fr))`;

  return (
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
          minWidth:
            `${110 + workingDays.length * 150}px`,
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

          {workingDays.map((day, index) => (
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
          ))}
        </div>

        {/* Period rows */}
        {Array.from(
          { length: periodsCount },
          (_, index) => {
            const periodIndex = index + 1;

            return (
              <div
                key={periodIndex}
                className="grid border-t border-border/45"
                style={{
                  gridTemplateColumns,
                }}
              >
                {/* Period label */}
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

                {/* Days */}
                {workingDays.map((day) => (
                  <ScheduleCell
                    key={day.day}
                    day={day}
                    periodIndex={periodIndex}
                    classes={classes}
                  />
                ))}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

function ScheduleCell({
  day,
  periodIndex,
  classes,
}: {
  day: SchoolDayConfiguration;
  periodIndex: number;
  classes: ScheduleClass[];
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
        <div
          className="
            flex h-full min-h-[78px]
            items-center justify-center
            rounded-[12px]
            border border-dashed border-border/45
            px-2
            text-center
            text-[10px]
            text-muted-foreground
            sm:min-h-[96px]
            sm:rounded-[15px]
          "
        >
          Free
        </div>
      ) : (
        <div className="space-y-1.5">
          {lessons.map(
            ({
              classItem,
              period,
            }) => (
              <ScheduleClassCard
                key={`${classItem.class_room_name}-${period.period_index}`}
                period={period}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
