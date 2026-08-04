import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DayPicker,
  type DayPickerProps,
} from "@daypicker/react";
import {
  addMonths,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  setMonth,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import "@daypicker/react/style.css";

import { cn } from "@/shared/lib/utils";
import "./date-picker.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function clampMonth(
  date: Date,
  startMonth?: Date,
  endMonth?: Date,
) {
  const normalized = startOfMonth(date);
  const minimum = startMonth
    ? startOfMonth(startMonth)
    : undefined;
  const maximum = endMonth
    ? startOfMonth(endMonth)
    : undefined;

  if (minimum && isBefore(normalized, minimum)) {
    return minimum;
  }

  if (maximum && isAfter(normalized, maximum)) {
    return maximum;
  }

  return normalized;
}

export function Calendar({
  className,
  month: controlledMonth,
  defaultMonth,
  startMonth,
  endMonth,
  onMonthChange,
  ...props
}: DayPickerProps) {
  const initialMonth = clampMonth(
    controlledMonth ?? defaultMonth ?? new Date(),
    startMonth,
    endMonth,
  );

  const [visibleMonth, setVisibleMonth] =
    useState(initialMonth);

  useEffect(() => {
    if (!controlledMonth) return;

    setVisibleMonth(
      clampMonth(
        controlledMonth,
        startMonth,
        endMonth,
      ),
    );
  }, [controlledMonth, startMonth, endMonth]);

  const years = useMemo(() => {
    const firstYear = getYear(
      startMonth ?? subMonths(new Date(), 12 * 100),
    );
    const lastYear = getYear(
      endMonth ?? addMonths(new Date(), 12 * 20),
    );

    return Array.from(
      { length: lastYear - firstYear + 1 },
      (_, index) => firstYear + index,
    );
  }, [startMonth, endMonth]);

  function updateMonth(nextMonth: Date) {
    const clamped = clampMonth(
      nextMonth,
      startMonth,
      endMonth,
    );

    setVisibleMonth(clamped);
    onMonthChange?.(clamped);
  }

  const previousMonth = subMonths(visibleMonth, 1);
  const nextMonth = addMonths(visibleMonth, 1);

  const previousDisabled = Boolean(
    startMonth &&
      isBefore(
        startOfMonth(previousMonth),
        startOfMonth(startMonth),
      ),
  );

  const nextDisabled = Boolean(
    endMonth &&
      isAfter(
        startOfMonth(nextMonth),
        startOfMonth(endMonth),
      ),
  );

  function handleMonthChange(value: string) {
    updateMonth(
      setMonth(visibleMonth, Number(value)),
    );
  }

  function handleYearChange(value: string) {
    updateMonth(
      setYear(visibleMonth, Number(value)),
    );
  }

  return (
    <div
      className={cn(
        "school-calendar-shell",
        className,
      )}
    >
      <div className="school-calendar-toolbar">
        <button
          type="button"
          aria-label="Previous month"
          disabled={previousDisabled}
          onClick={() => updateMonth(previousMonth)}
          className="school-calendar-nav-button"
        >
          <ChevronLeft
            aria-hidden="true"
            size={16}
            strokeWidth={2}
          />
        </button>

        <div className="school-calendar-jump-controls">
          <label className="school-calendar-select-shell">
            <span className="sr-only">Month</span>
            <select
              aria-label="Month"
              value={getMonth(visibleMonth)}
              onChange={(event) =>
                handleMonthChange(event.target.value)
              }
              className="school-calendar-select school-calendar-month-select"
            >
              {MONTHS.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </label>

          <label className="school-calendar-select-shell">
            <span className="sr-only">Year</span>
            <select
              aria-label="Year"
              value={getYear(visibleMonth)}
              onChange={(event) =>
                handleYearChange(event.target.value)
              }
              className="school-calendar-select school-calendar-year-select"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => updateMonth(nextMonth)}
          className="school-calendar-nav-button"
        >
          <ChevronRight
            aria-hidden="true"
            size={16}
            strokeWidth={2}
          />
        </button>
      </div>

      <DayPicker
        className="school-calendar-picker"
        showOutsideDays
        fixedWeeks
        hideNavigation
        captionLayout="label"
        month={visibleMonth}
        startMonth={startMonth}
        endMonth={endMonth}
        onMonthChange={updateMonth}
        {...props}
      />
    </div>
  );
}
