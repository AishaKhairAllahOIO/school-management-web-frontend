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

import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { TimePicker } from "@/shared/ui/time-picker";

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

  const [pendingBreakDelete, setPendingBreakDelete] =
    useState<SchoolBreak | null>(null);

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
    <section>
      <SectionHeader
        title="School Calendar"
        description="Set working days, lesson duration and break timing for the daily school routine."
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <SchedulePanel
            icon={<Clock3 size={17} />}
            title="Working Days"
            description="Select active days and periods."
          >
            <div className="grid gap-2 sm:grid-cols-2">
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
                      "flex min-w-0 items-center justify-between",
                      "gap-3 rounded-[14px] border px-3 py-2.5",
                      "transition-colors",
                      checked
                        ? "border-primary/15 bg-primary/[0.035]"
                        : "border-border/55 bg-background hover:bg-muted/[0.16]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleWorkingDay(day)
                      }
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <span
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center",
                          "rounded-[7px] border transition-colors",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background",
                        ].join(" ")}
                      >
                        {checked ? (
                          <Check
                            size={12}
                            strokeWidth={2}
                          />
                        ) : null}
                      </span>

                      <span
                        className={[
                          "truncate text-[13px] font-medium",
                          checked
                            ? "text-foreground"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {schoolDayLabels[day]}
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <Select
                        value={
                          dayConfiguration
                            ? String(dayConfiguration.periodsCount)
                            : "none"
                        }
                        disabled={!checked}
                        onValueChange={(value) => {
                          if (value === "none") {
                            return;
                          }

                          updateDayPeriods(
                            day,
                            Number(value),
                          );
                        }}
                      >
                        <SelectTrigger className="h-8 w-[62px] rounded-[10px] px-2.5">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="none">
                            —
                          </SelectItem>

                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                            (count) => (
                              <SelectItem
                                key={count}
                                value={String(count)}
                              >
                                {count}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      <span className="hidden text-[11px] text-muted-foreground 2xl:inline">
                        periods
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SchedulePanel>

          <SchedulePanel
            icon={<Clock3 size={17} />}
            title="Day Timing"
            description="Set the starting time and lesson length."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <ScheduleField label="Day Starts At">
                <TimePicker
                  value={schedule.dayStartTime}
                  onChange={(dayStartTime) =>
                    setSchedule(
                      (previousSchedule) => ({
                        ...previousSchedule,
                        dayStartTime,
                      }),
                    )
                  }
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

            <div className="mt-3 flex items-start gap-2.5 rounded-[13px] border border-primary/10 bg-primary/[0.04] px-3 py-2.5 text-primary">
              <Info
                size={15}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0"
              />

              <p className="text-[12px] leading-5">
                End time is calculated automatically from periods and breaks.
              </p>
            </div>
          </SchedulePanel>

          <SchedulePanel
            icon={<Coffee size={17} />}
            title="Breaks"
            description="Add break periods between lessons."
          >
            <div className="space-y-2.5">
              {schedule.breaks.map(
                (breakItem, index) => (
                  <div
                    key={breakItem.id}
                    className={[
                      "grid gap-3 rounded-[14px]",
                      "border border-border/55 bg-background p-3",
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
                        setPendingBreakDelete(
                          breakItem,
                        )
                      }
                      className={[
                        "mt-auto flex h-10 w-10 items-center justify-center",
                        "rounded-[11px] border border-destructive/18",
                        "bg-background text-destructive",
                        "transition-colors hover:bg-destructive/[0.06]",
                      ].join(" ")}
                    >
                      <Trash2
                        size={15}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>
                ),
              )}

              {schedule.breaks.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-border/70 bg-muted/[0.1] p-5 text-center">
                  <p className="text-[13px] font-medium text-foreground">
                    No breaks added
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Add a break when needed.
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={addBreak}
              className={[
                "mt-3 inline-flex h-9 items-center gap-2",
                "rounded-full border border-primary/18",
                "bg-background px-4",
                "text-[13px] font-medium text-primary",
                "transition-colors hover:bg-primary/[0.05]",
              ].join(" ")}
            >
              <Plus size={14} strokeWidth={1.8} />
              Add Break
            </button>
          </SchedulePanel>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={updateSettings.isPending}
              onClick={saveSchedule}
              className={[
                "inline-flex h-10 items-center gap-2 rounded-full",
                "bg-primary px-5",
                "text-[13px] font-medium text-primary-foreground",
                "shadow-[0_8px_20px_rgba(98,74,180,0.16)]",
                "transition hover:-translate-y-0.5 hover:bg-primary/90",
                "disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
              ].join(" ")}
            >
              <Save size={15} strokeWidth={1.8} />
              {updateSettings.isPending
                ? "Saving..."
                : "Save Calendar"}
            </button>
          </div>
        </div>

        <aside className="min-w-0 self-start">
          <SchedulePanel
            icon={<Clock3 size={17} />}
            title="Day Preview"
            description="Live generated schedule."
          >
            <SchedulePreview schedule={schedule} />
          </SchedulePanel>
        </aside>
      </div>

      <ConfirmationDialog
        open={Boolean(pendingBreakDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingBreakDelete(null);
          }
        }}
        title="Delete this break?"
        description="The break will be removed from the current calendar draft. Save the calendar to persist the change."
        itemName={
          pendingBreakDelete
            ? `Break after period ${pendingBreakDelete.afterPeriodIndex} · ${pendingBreakDelete.durationMinutes} minutes`
            : undefined
        }
        onConfirm={() => {
          if (!pendingBreakDelete) {
            return;
          }

          deleteBreak(pendingBreakDelete.id);
          setPendingBreakDelete(null);
        }}
      />
    </section>
  );
}

const inputClassName = [
  "h-10 w-full rounded-[12px]",
  "border border-border/65",
  "bg-background px-3.5",
  "text-[13px] font-normal text-foreground",
  "outline-none transition-all",
  "hover:border-border",
  "focus:border-primary/40 focus:ring-4 focus:ring-primary/10",
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
      <span className="mb-1.5 block text-[12px] font-medium text-foreground/85">
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
    <div className="rounded-[18px] border border-border/55 bg-muted/[0.08] p-4">
      <div className="flex items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.07] text-primary">
          {icon}
        </span>

        <div className="min-w-0 pt-0.5">
          <h3 className="text-[15px] font-medium text-foreground">
            {title}
          </h3>

          {description ? (
            <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
