import {
  ChevronDown,
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
  useRef,
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

type CalendarDropdownProps = {
  value: string | number;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  onChange: (value: string) => void;
  className?: string;
};

function CalendarDropdown({
  value,
  options,
  onChange,
  className,
}: CalendarDropdownProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) =>
      String(option.value) === String(value),
  );

  /*
   * Close dropdown when clicking/tapping outside.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const element = containerRef.current;
      const target = event.target;

      if (
        !element ||
        !(target instanceof Node) ||
        element.contains(target)
      ) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  function selectOption(
    nextValue: string | number,
  ) {
    onChange(String(nextValue));
    setOpen(false);
  }

  function toggleDropdown() {
    setOpen((previous) => !previous);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "school-calendar-dropdown",
        className,
      )}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleDropdown}
        className={cn(
          "school-calendar-dropdown-trigger",
          open &&
            "school-calendar-dropdown-trigger-open",
        )}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label}
        </span>

        <ChevronDown
          className={cn(
            "school-calendar-dropdown-chevron shrink-0",
            open && "rotate-180",
          )}
          size={13}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Choose option"
          className="school-calendar-dropdown-menu"
        >
          {options.map((option) => {
            const selected =
              String(option.value) ===
              String(value);

            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() =>
                  selectOption(option.value)
                }
                className={cn(
                  "school-calendar-dropdown-option",
                  selected &&
                    "school-calendar-dropdown-option-selected",
                )}
              >
                <span className="min-w-0 truncate">
                  {option.label}
                </span>

                {selected ? (
                  <span
                    aria-hidden="true"
                    className="school-calendar-dropdown-check"
                  >
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
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
    controlledMonth ??
      defaultMonth ??
      new Date(),
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
  }, [
    controlledMonth,
    startMonth,
    endMonth,
  ]);

  const years = useMemo(() => {
    const firstYear = getYear(
      startMonth ??
        subMonths(
          new Date(),
          12 * 100,
        ),
    );

    const lastYear = getYear(
      endMonth ??
        addMonths(
          new Date(),
          12 * 20,
        ),
    );

    return Array.from(
      {
        length:
          lastYear -
            firstYear +
            1,
      },
      (_, index) =>
        firstYear + index,
    );
  }, [startMonth, endMonth]);

  function updateMonth(
    nextMonth: Date,
  ) {
    const clamped = clampMonth(
      nextMonth,
      startMonth,
      endMonth,
    );

    setVisibleMonth(clamped);
    onMonthChange?.(clamped);
  }

  const previousMonth =
    subMonths(visibleMonth, 1);

  const nextMonth =
    addMonths(visibleMonth, 1);

  const previousDisabled =
    Boolean(
      startMonth &&
        isBefore(
          startOfMonth(
            previousMonth,
          ),
          startOfMonth(startMonth),
        ),
    );

  const nextDisabled =
    Boolean(
      endMonth &&
        isAfter(
          startOfMonth(nextMonth),
          startOfMonth(endMonth),
        ),
    );

  function handleMonthChange(
    value: string,
  ) {
    updateMonth(
      setMonth(
        visibleMonth,
        Number(value),
      ),
    );
  }

  function handleYearChange(
    value: string,
  ) {
    updateMonth(
      setYear(
        visibleMonth,
        Number(value),
      ),
    );
  }

  const monthOptions =
    MONTHS.map(
      (monthName, index) => ({
        value: index,
        label: monthName,
      }),
    );

  const yearOptions =
    years.map((year) => ({
      value: year,
      label: String(year),
    }));

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
          onClick={() =>
            updateMonth(
              previousMonth,
            )
          }
          className="school-calendar-nav-button"
        >
          <ChevronLeft
            aria-hidden="true"
            size={16}
            strokeWidth={2}
          />
        </button>

        <div className="school-calendar-jump-controls">
          <CalendarDropdown
            value={getMonth(
              visibleMonth,
            )}
            options={monthOptions}
            onChange={
              handleMonthChange
            }
            className="school-calendar-month-dropdown"
          />

          <CalendarDropdown
            value={getYear(
              visibleMonth,
            )}
            options={yearOptions}
            onChange={
              handleYearChange
            }
            className="school-calendar-year-dropdown"
          />
        </div>

        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() =>
            updateMonth(nextMonth)
          }
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