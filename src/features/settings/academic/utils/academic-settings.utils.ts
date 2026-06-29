import type { AcademicStageType, SchoolDay, SchoolDayScheduleSettings } from "../types/academic-settings.types";

export const schoolDays: SchoolDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const schoolDayLabels: Record<SchoolDay, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

export const academicStageLabels: Record<AcademicStageType, string> = {
  primary: "Primary",
  middle: "Middle",
  secondary: "Secondary",
};

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function getAcademicYearName(startDate: string, endDate: string) {
  return `${startDate.slice(0, 4)} - ${endDate.slice(0, 4)}`;
}

export function formatDateTime(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
}

export function buildSchedulePreview(schedule: SchoolDayScheduleSettings) {
  const firstDay = schedule.workingDays[0];
  if (!firstDay) return { items: [], endTime: schedule.dayStartTime };

  let currentTime = schedule.dayStartTime;
  const items: Array<{ time: string; label: string; type: "period" | "break" }> = [];

  for (let index = 1; index <= firstDay.periodsCount; index += 1) {
    items.push({ time: currentTime, label: `Period ${index}`, type: "period" });
    currentTime = addMinutes(currentTime, schedule.periodDurationMinutes);

    const breakItem = schedule.breaks.find((item) => item.afterPeriodIndex === index);
    if (breakItem) {
      items.push({
        time: currentTime,
        label: `Break (${breakItem.durationMinutes}m)`,
        type: "break",
      });
      currentTime = addMinutes(currentTime, breakItem.durationMinutes);
    }
  }

  return { items, endTime: currentTime };
}
