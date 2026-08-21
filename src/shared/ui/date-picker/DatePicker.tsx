import {
  CalendarDays,
  ChevronDown,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useId,
  useMemo,
  useState,
} from "react";
import {
  addYears,
  endOfDay,
  startOfDay,
  subYears,
} from "date-fns";

import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

import { Calendar } from "./Calendar";
import type { DatePickerProps } from "./date-picker.types";
import {
  formatDateForApi,
  formatDateForDisplay,
  parseApiDate,
} from "./date-picker.utils";

export function DatePicker({
  value,
  onChange,
  name,
  id,
  label,
  placeholder = "Select date",
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  min,
  max,
  className,
  icon,
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);

  const selected = parseApiDate(value);
  const minDate = parseApiDate(min);
  const maxDate = parseApiDate(max);
  const today = startOfDay(new Date());

  const calendarBounds = useMemo(() => ({
    startMonth: minDate ?? subYears(today, 100),
    endMonth: maxDate ?? addYears(today, 20),
  }), [minDate, maxDate, today]);

  const disabledMatchers = useMemo(() => {
    const matchers = [];

    if (minDate) matchers.push({ before: startOfDay(minDate) });
    if (maxDate) matchers.push({ after: endOfDay(maxDate) });

    return matchers.length ? matchers : undefined;
  }, [minDate, maxDate]);

  const todayIsAllowed =
    (!minDate || today >= startOfDay(minDate)) &&
    (!maxDate || today <= endOfDay(maxDate));

  function selectDate(date?: Date) {
    if (!date) return;
    onChange(formatDateForApi(date));
    setOpen(false);
  }

  function clearDate() {
    onChange("");
    setOpen(false);
  }

  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-medium text-foreground"
        >
          {label}
          {required ? <span className="ms-1 text-destructive">*</span> : null}
        </label>
      ) : null}

      <input type="hidden" name={name} value={value ?? ""} />

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled || readOnly) return;
          setOpen(nextOpen);
        }}
      >
        <PopoverTrigger asChild>
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-invalid={Boolean(error)}
            className={cn(
              "flex h-11 w-full min-w-0 items-center gap-3 rounded-[13px] border bg-background px-3.5 text-start text-sm outline-none transition-all",
              "border-border/70 hover:border-primary/30",
              "focus-visible:border-primary/45 focus-visible:ring-4 focus-visible:ring-primary/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive/55 focus-visible:border-destructive/70 focus-visible:ring-destructive/10",
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
              {icon ?? <CalendarDays size={15} strokeWidth={1.8} />}
            </span>

            <span className={cn(
              "min-w-0 flex-1 truncate font-normal",
              selected ? "text-foreground" : "text-muted-foreground",
            )}>
              {selected ? formatDateForDisplay(value) : placeholder}
            </span>

            {selected && !readOnly && !disabled ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  clearDate();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    clearDate();
                  }
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X size={14} />
              </span>
            ) : null}

            <ChevronDown
              size={15}
              className={cn(
                "shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          role="dialog"
          aria-label={label ?? "Choose date"}
          align="start"
          side="bottom"
          sideOffset={8}
          collisionPadding={16}
          sticky="always"
          hideWhenDetached
          className="school-date-popover w-[min(18.5rem,calc(100vw-1rem))] overflow-hidden rounded-[18px] border-border/70 bg-card p-0 shadow-[0_18px_55px_rgba(20,15,60,0.16)]"
        >
          <div className="p-2.5 sm:p-3">
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected ?? minDate ?? today}
              startMonth={calendarBounds.startMonth}
              endMonth={calendarBounds.endMonth}
              disabled={disabledMatchers}
              onSelect={selectDate}
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border/55 bg-muted/[0.14] px-2.5 py-2">
            <button
              type="button"
              disabled={!todayIsAllowed}
              onClick={() => selectDate(today)}
              className="inline-flex h-9 items-center gap-2 rounded-[11px] px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CalendarDays size={14} />
              Today
            </button>

            {selected ? (
              <button
                type="button"
                onClick={clearDate}
                className="inline-flex h-9 items-center gap-2 rounded-[11px] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw size={14} />
                Clear
              </button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      {error ? (
        <p className="mt-1.5 text-[11px] text-destructive">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-[11px] text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
