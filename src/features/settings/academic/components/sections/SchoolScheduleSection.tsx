import {
  Check,
  Info,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUpdateAcademicSettings } from "../../hooks/useAcademicSettings";
import type {
  AcademicSettings,
  SchoolBreak,
  SchoolDay,
  SchoolScheduleSettings,
} from "../../types/academic-settings.types";
import {
  schoolDayLabels,
  schoolDays,
} from "../../utils/academic-settings.utils";
import { SchedulePreview } from "../preview/SchedulePreview";
import { SectionHeader } from "../shared/SectionHeader";

type SchoolScheduleSectionProps = {
  settings: AcademicSettings;
};

export function SchoolScheduleSection({
  settings,
}: SchoolScheduleSectionProps) {
  const [schedule, setSchedule] =
    useState<SchoolScheduleSettings>(
      settings.scheduleSettings,
    );

  const updateSettings =
    useUpdateAcademicSettings();

  useEffect(() => {
    setSchedule(settings.scheduleSettings);
  }, [settings.scheduleSettings]);

  const workingDaysMap = useMemo(
    () =>
      new Map(
        schedule.workingDays.map((item) => [
          item.day,
          item,
        ]),
      ),
    [schedule.workingDays],
  );

  function saveSchedule() {
    updateSettings.mutate({
      currentAcademicYearId: Number(
        settings.currentAcademicYearId,
      ),

      currentSemesterId: Number(
        settings.currentSemesterId,
      ),

      scheduleSettings: schedule,
    });
  }

  function toggleWorkingDay(day: SchoolDay) {
    const exists = workingDaysMap.has(day);

    setSchedule((previousSchedule) => ({
      ...previousSchedule,

      workingDays: exists
        ? previousSchedule.workingDays.filter(
            (item) => item.day !== day,
          )
        : [
            ...previousSchedule.workingDays,
            {
              day,
              periodsCount: 7,
            },
          ],
    }));
  }

  function updateDayPeriods(
    day: SchoolDay,
    periodsCount: number,
  ) {
    setSchedule((previousSchedule) => ({
      ...previousSchedule,

      workingDays:
        previousSchedule.workingDays.map((item) =>
          item.day === day
            ? {
                ...item,
                periodsCount,
              }
            : item,
        ),
    }));
  }

  function addBreak() {
    setSchedule((previousSchedule) => ({
      ...previousSchedule,

      breaks: [
        ...previousSchedule.breaks,
        {
          id: crypto.randomUUID(),
          afterPeriodIndex: 3,
          durationMinutes: 15,
        },
      ],
    }));
  }

  function updateBreak(
    id: string,
    field: keyof Pick<
      SchoolBreak,
      "afterPeriodIndex" | "durationMinutes"
    >,
    value: number,
  ) {
    setSchedule((previousSchedule) => ({
      ...previousSchedule,

      breaks: previousSchedule.breaks.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item,
      ),
    }));
  }

  function deleteBreak(id: string) {
    setSchedule((previousSchedule) => ({
      ...previousSchedule,

      breaks: previousSchedule.breaks.filter(
        (item) => item.id !== id,
      ),
    }));
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
      <SectionHeader
        title="School Schedule"
        description="Configure working days, periods and breaks."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <SchedulePanel title="Working Days">
            <div className="space-y-3">
              {schoolDays.map((day) => {
                const dayConfiguration =
                  workingDaysMap.get(day);

                const checked = Boolean(
                  dayConfiguration,
                );

                return (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleWorkingDay(day)
                      }
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <span
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          checked
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card",
                        ].join(" ")}
                      >
                        {checked ? (
                          <Check size={13} />
                        ) : null}
                      </span>

                      <span className="truncate text-sm font-bold text-foreground">
                        {schoolDayLabels[day]}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <select
                        value={
                          dayConfiguration?.periodsCount ??
                          ""
                        }
                        disabled={!checked}
                        onChange={(event) =>
                          updateDayPeriods(
                            day,
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        className="h-9 rounded-xl border border-border/70 bg-card px-3 text-sm font-bold outline-none disabled:text-muted-foreground"
                      >
                        <option value="">—</option>

                        {[
                          1, 2, 3, 4, 5, 6, 7, 8,
                          9,
                        ].map((count) => (
                          <option
                            key={count}
                            value={count}
                          >
                            {count}
                          </option>
                        ))}
                      </select>

                      <span className="text-xs font-semibold text-muted-foreground">
                        periods
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SchedulePanel>

          <SchedulePanel title="Timing">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-foreground">
                  Day Starts At
                </span>

                <input
                  type="time"
                  value={schedule.dayStartTime}
                  onChange={(event) =>
                    setSchedule(
                      (previousSchedule) => ({
                        ...previousSchedule,
                        dayStartTime:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-sm font-bold outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-foreground">
                  Period Duration
                </span>

                <input
                  type="number"
                  min={1}
                  value={
                    schedule.periodDurationMinutes
                  }
                  onChange={(event) =>
                    setSchedule(
                      (previousSchedule) => ({
                        ...previousSchedule,

                        periodDurationMinutes:
                          Number(
                            event.target.value,
                          ),
                      }),
                    )
                  }
                  className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-sm font-bold outline-none"
                />
              </label>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-primary/5 p-4 text-primary">
              <Info
                size={17}
                className="mt-0.5 shrink-0"
              />

              <p className="text-xs font-semibold leading-5">
                The end time is calculated
                automatically based on periods and
                breaks.
              </p>
            </div>
          </SchedulePanel>

          <SchedulePanel title="Breaks">
            <div className="space-y-3">
              {schedule.breaks.map(
                (breakItem) => (
                  <div
                    key={breakItem.id}
                    className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <label>
                      <span className="mb-2 block text-xs font-bold text-foreground">
                        After Period
                      </span>

                      <input
                        type="number"
                        min={1}
                        value={
                          breakItem.afterPeriodIndex
                        }
                        onChange={(event) =>
                          updateBreak(
                            breakItem.id,
                            "afterPeriodIndex",
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm font-bold outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block text-xs font-bold text-foreground">
                        Duration
                      </span>

                      <input
                        type="number"
                        min={1}
                        value={
                          breakItem.durationMinutes
                        }
                        onChange={(event) =>
                          updateBreak(
                            breakItem.id,
                            "durationMinutes",
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm font-bold outline-none"
                      />
                    </label>

                    <button
                      type="button"
                      aria-label="Delete break"
                      onClick={() =>
                        deleteBreak(breakItem.id)
                      }
                      className="mt-auto flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 bg-card text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ),
              )}

              {schedule.breaks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-5 text-center text-xs font-semibold text-muted-foreground">
                  No breaks added.
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={addBreak}
              className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-border/70 px-4 text-xs font-bold text-foreground transition hover:bg-muted"
            >
              <Plus size={15} />
              Add Break
            </button>
          </SchedulePanel>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={updateSettings.isPending}
              onClick={saveSchedule}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {updateSettings.isPending
                ? "Saving..."
                : "Save Schedule"}
            </button>
          </div>
        </div>

        <aside>
          <SchedulePanel title="Schedule Preview">
            <SchedulePreview
              schedule={schedule}
            />
          </SchedulePanel>
        </aside>
      </div>
    </section>
  );
}

function SchedulePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/20 p-5">
      <h3 className="text-sm font-bold text-foreground">
        {title}
      </h3>

      <div className="mt-4">{children}</div>
    </div>
  );
}