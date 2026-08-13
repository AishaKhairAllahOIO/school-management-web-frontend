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

const dayLabels: Record<
  SchoolDay,
  string
> = {
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
  const workingDays =
    settings.workingDays
      .filter(
        (day) => day.periodsCount > 0,
      )
      .sort(
        (a, b) =>
          dayOrder.indexOf(
            a.day,
          ) -
          dayOrder.indexOf(
            b.day,
          ),
      );

  const periodsCount = Math.max(
    ...workingDays.map(
      (day) => day.periodsCount,
    ),
    0,
  );

  if (!workingDays.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-border/60 p-10 text-center">
        <p className="text-sm font-medium">
          No working days configured.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Configure the school schedule settings first.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/55">
      <div
        className="grid bg-muted/[0.18]"
        style={{
          gridTemplateColumns: `110px repeat(${workingDays.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="border-r border-border/45 px-3 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Period
        </div>

        {workingDays.map(
          (day, index) => (
            <div
              key={day.day}
              className={[
                "border-r border-border/45 px-3 py-3 text-center text-[12px] font-medium last:border-r-0",
                dayColors[
                  index %
                    dayColors.length
                ],
              ].join(" ")}
            >
              {
                dayLabels[
                  day.day
                ]
              }
            </div>
          ),
        )}
      </div>

      {Array.from(
        { length: periodsCount },
        (_, index) => {
          const periodIndex =
            index + 1;

          return (
            <div
              key={periodIndex}
              className="grid border-t border-border/45"
              style={{
                gridTemplateColumns: `110px repeat(${workingDays.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="flex min-h-[112px] flex-col justify-center border-r border-border/45 bg-muted/[0.10] px-3 py-3">
                <span className="text-[12px] font-medium">
                  Period{" "}
                  {periodIndex}
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
                  />
                ),
              )}
            </div>
          );
        },
      )}
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
  const lessons =
    classes.flatMap(
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
    <div className="min-h-[112px] border-r border-border/45 p-2 last:border-r-0">
      {lessons.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-[15px] border border-dashed border-border/45 text-[10px] text-muted-foreground">
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
                period={
                  period
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}