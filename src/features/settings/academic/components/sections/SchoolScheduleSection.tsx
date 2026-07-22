import {
  Check,
  Clock3,
  Coffee,
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

      breaks:
        previousSchedule.breaks.filter(
          (item) => item.id !== id,
        ),
    }));
  }

  return (
    <section>
      <SectionHeader
        title="School Calendar"
        description="Set working days, lesson duration and break timing for the daily school routine."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <SchedulePanel
            icon={<Clock3 size={18} />}
            title="Working Days"
            description="Choose active days and the number of periods for each one."
          >
            <div className="space-y-2.5">
              {schoolDays.map((day) => {
                const dayConfiguration =
                  workingDaysMap.get(day);

                const checked = Boolean(
                  dayConfiguration,
                );

                return (
                  <div
                    key={day}
                    className={[
                      "flex items-center justify-between",
                      "gap-4 rounded-[16px]",
                      "border px-4 py-3.5",
                      "transition-colors",
                      checked
                        ? "border-primary/15 bg-primary/[0.035]"
                        : "border-border/60 bg-card hover:bg-muted/20",
                    ].join(" ")}
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
                          "flex h-5 w-5 shrink-0",
                          "items-center justify-center",
                          "rounded-md border",
                          "transition-colors",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background",
                        ].join(" ")}
                      >
                        {checked ? (
                          <Check
                            size={13}
                            strokeWidth={2}
                          />
                        ) : null}
                      </span>

                      <span
                        className={[
                          "truncate text-sm font-medium",
                          checked
                            ? "text-foreground"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {schoolDayLabels[day]}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <select
                        value={
                          dayConfiguration
                            ?.periodsCount ?? ""
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
                        className={[
                          "h-9 rounded-xl",
                          "border border-border/70",
                          "bg-background px-3",
                          "text-sm font-normal",
                          "text-foreground outline-none",
                          "transition-all",
                          "focus:border-primary/40",
                          "focus:ring-4",
                          "focus:ring-primary/10",
                          "disabled:cursor-not-allowed",
                          "disabled:opacity-50",
                        ].join(" ")}
                      >
                        <option value="">
                          —
                        </option>

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

                      <span className="text-[11px] font-normal text-muted-foreground">
                        periods
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SchedulePanel>

          <SchedulePanel
            icon={<Clock3 size={18} />}
            title="Day Timing"
            description="Define when the school day begins and how long each period lasts."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ScheduleField label="Day Starts At">
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
                  className={inputClassName}
                />
              </ScheduleField>

              <ScheduleField label="Period Duration">
                <div className="relative">
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
                    className={`${inputClassName} pr-16`}
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                    minutes
                  </span>
                </div>
              </ScheduleField>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-primary/10 bg-primary/[0.045] p-4 text-primary">
              <Info
                size={17}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0"
              />

              <p className="text-xs font-normal leading-5">
                The end time is calculated
                automatically from working periods
                and breaks.
              </p>
            </div>
          </SchedulePanel>

          <SchedulePanel
            icon={<Coffee size={18} />}
            title="Breaks"
            description="Insert break periods between lessons."
          >
            <div className="space-y-3">
              {schedule.breaks.map(
                (breakItem, index) => (
                  <div
                    key={breakItem.id}
                    className={[
                      "grid gap-3",
                      "rounded-[16px]",
                      "border border-border/60",
                      "bg-card p-4",
                      "sm:grid-cols-[1fr_1fr_auto]",
                    ].join(" ")}
                  >
                    <ScheduleField
                      label={`Break ${index + 1} · After Period`}
                    >
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
                        className={inputClassName}
                      />
                    </ScheduleField>

                    <ScheduleField label="Duration">
                      <div className="relative">
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
                          className={`${inputClassName} pr-16`}
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                          minutes
                        </span>
                      </div>
                    </ScheduleField>

                    <button
                      type="button"
                      aria-label="Delete break"
                      onClick={() =>
                        deleteBreak(breakItem.id)
                      }
                      className={[
                        "mt-auto flex h-11 w-11",
                        "items-center justify-center",
                        "rounded-xl border",
                        "border-destructive/20",
                        "bg-card text-destructive",
                        "transition-colors",
                        "hover:bg-destructive/[0.07]",
                      ].join(" ")}
                    >
                      <Trash2
                        size={16}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>
                ),
              )}

              {schedule.breaks.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-border bg-muted/10 p-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No breaks added
                  </p>

                  <p className="mt-1 text-xs font-normal text-muted-foreground">
                    Add a break between school
                    periods when needed.
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={addBreak}
              className={[
                "mt-4 inline-flex h-10",
                "items-center gap-2",
                "rounded-xl border",
                "border-primary/20",
                "bg-card px-4",
                "text-xs font-medium",
                "text-primary transition-colors",
                "hover:bg-primary/[0.055]",
              ].join(" ")}
            >
              <Plus
                size={15}
                strokeWidth={1.8}
              />

              Add Break
            </button>
          </SchedulePanel>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={
                updateSettings.isPending
              }
              onClick={saveSchedule}
              className={[
                "inline-flex h-11 items-center",
                "gap-2 rounded-[14px]",
                "bg-primary px-6",
                "text-sm font-medium",
                "text-primary-foreground",
                "shadow-sm transition",
                "hover:bg-primary/90",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              ].join(" ")}
            >
              <Save
                size={16}
                strokeWidth={1.8}
              />

              {updateSettings.isPending
                ? "Saving..."
                : "Save Calendar"}
            </button>
          </div>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <SchedulePanel
            icon={<Clock3 size={18} />}
            title="Day Preview"
            description="A live view of the generated school day."
          >
            <SchedulePreview
              schedule={schedule}
            />
          </SchedulePanel>
        </aside>
      </div>
    </section>
  );
}

const inputClassName = [
  "h-11 w-full rounded-xl",
  "border border-border/70",
  "bg-background px-3.5",
  "text-sm font-normal",
  "text-foreground outline-none",
  "transition-all",
  "focus:border-primary/40",
  "focus:ring-4",
  "focus:ring-primary/10",
].join(" ");

function ScheduleField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}

function SchedulePanel({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-border/60 bg-muted/[0.12] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.075] text-primary">
          {icon}
        </span>

        <div>
          <h3 className="text-sm font-medium text-foreground">
            {title}
          </h3>

          {description ? (
            <p className="mt-1 text-[11px] font-normal leading-4 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}