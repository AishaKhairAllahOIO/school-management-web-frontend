import { Check, Info, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useUpdateAcademicSettings } from "../../hooks/useAcademicSettings";
import type { AcademicSettings, SchoolBreak, SchoolDay, SchoolDayScheduleSettings } from "../../types/academic-settings.types";
import { schoolDayLabels, schoolDays } from "../../utils/academic-settings.utils";
import { SchedulePreview } from "../preview/SchedulePreview";
import { SectionHeader } from "../shared/SectionHeader";

export function SchoolScheduleSection({ settings }: { settings: AcademicSettings }) {
  const [schedule, setSchedule] = useState<SchoolDayScheduleSettings>(settings.scheduleSettings);
  const updateSettings = useUpdateAcademicSettings();

  const workingDaysMap = useMemo(() => new Map(schedule.workingDays.map((item) => [item.day, item])), [schedule.workingDays]);

  function saveSchedule() {
    updateSettings.mutate({
      currentAcademicYearId: settings.currentAcademicYearId,
      currentAcademicTermId: settings.currentAcademicTermId,
      scheduleSettings: schedule,
    });
  }

  function toggleWorkingDay(day: SchoolDay) {
    const exists = workingDaysMap.has(day);
    setSchedule((prev) => ({
      ...prev,
      workingDays: exists
        ? prev.workingDays.filter((item) => item.day !== day)
        : [...prev.workingDays, { day, periodsCount: 7 }],
    }));
  }

  function updateDayPeriods(day: SchoolDay, periodsCount: number) {
    setSchedule((prev) => ({
      ...prev,
      workingDays: prev.workingDays.map((item) => (item.day === day ? { ...item, periodsCount } : item)),
    }));
  }

  function addBreak() {
    setSchedule((prev) => ({
      ...prev,
      breaks: [...prev.breaks, { id: crypto.randomUUID(), afterPeriodIndex: 3, durationMinutes: 15 }],
    }));
  }

  function updateBreak(id: string, field: keyof Pick<SchoolBreak, "afterPeriodIndex" | "durationMinutes">, value: number) {
    setSchedule((prev) => ({
      ...prev,
      breaks: prev.breaks.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }

  function deleteBreak(id: string) {
    setSchedule((prev) => ({ ...prev, breaks: prev.breaks.filter((item) => item.id !== id) }));
  }

  return (
    <>
      <SectionHeader title="School Schedule" description="Configure working days, periods and breaks.">
        <button
          type="button"
          onClick={saveSchedule}
          disabled={updateSettings.isPending}
          className="mt-5 flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white disabled:opacity-60"
        >
          <Save size={16} />
          Save Schedule
        </button>
      </SectionHeader>

      <div className="grid grid-cols-[1.05fr_0.9fr] gap-6">
        <div className="space-y-6">
          <SchedulePanel title="Working Days & Periods">
            <div className="space-y-3">
              {schoolDays.map((day) => {
                const item = workingDaysMap.get(day);
                const checked = Boolean(item);
                return (
                  <div key={day} className="grid grid-cols-[24px_minmax(120px,1fr)_90px_56px] items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleWorkingDay(day)}
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-md border",
                        checked ? "border-primary bg-primary text-white" : "border-slate-300 bg-white",
                      ].join(" ")}
                    >
                      {checked && <Check size={13} />}
                    </button>
                    <span className="text-sm font-bold text-slate-900">{schoolDayLabels[day]}</span>
                    <select
                      disabled={!checked}
                      value={item?.periodsCount ?? ""}
                      onChange={(event) => updateDayPeriods(day, Number(event.target.value))}
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none disabled:text-slate-300"
                    >
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                    <span className="text-xs font-medium text-slate-500">periods</span>
                  </div>
                );
              })}
            </div>
          </SchedulePanel>

          <SchedulePanel title="Day Configuration">
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="mb-2 block text-xs font-black text-slate-500">Day Starts At</span>
                <input
                  type="time"
                  value={schedule.dayStartTime}
                  onChange={(event) => setSchedule((prev) => ({ ...prev, dayStartTime: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none"
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-black text-slate-500">Period Duration</span>
                <input
                  type="number"
                  min={1}
                  value={schedule.periodDurationMinutes}
                  onChange={(event) => setSchedule((prev) => ({ ...prev, periodDurationMinutes: Number(event.target.value) }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none"
                />
              </label>
            </div>
            <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-xs font-semibold leading-5 text-primary">
              <Info size={15} className="mb-1" />
              The end time is calculated automatically based on periods and breaks.
            </div>
          </SchedulePanel>

          <SchedulePanel title="Breaks">
            <div className="mb-3 grid grid-cols-[1fr_1fr_40px] gap-2 text-xs font-black text-slate-500">
              <span>After Period</span>
              <span>Duration</span>
              <span />
            </div>
            <div className="space-y-3">
              {schedule.breaks.map((breakItem) => (
                <div key={breakItem.id} className="grid grid-cols-[1fr_1fr_40px] gap-2">
                  <input
                    type="number"
                    min={1}
                    value={breakItem.afterPeriodIndex}
                    onChange={(event) => updateBreak(breakItem.id, "afterPeriodIndex", Number(event.target.value))}
                    className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    value={breakItem.durationMinutes}
                    onChange={(event) => updateBreak(breakItem.id, "durationMinutes", Number(event.target.value))}
                    className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => deleteBreak(breakItem.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addBreak} className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-primary px-4 text-xs font-black text-primary">
              <Plus size={15} />
              Add Break
            </button>
          </SchedulePanel>
        </div>

        <SchedulePanel title="Preview">
          <SchedulePreview schedule={schedule} />
        </SchedulePanel>
      </div>
    </>
  );
}

function SchedulePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#FCFDFF] p-4">
      <h3 className="mb-4 text-sm font-black tracking-[-0.03em] text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
