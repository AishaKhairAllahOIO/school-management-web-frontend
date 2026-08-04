import {
  Check,
  ChevronDown,
  ChevronDown as StepDown,
  ChevronUp,
  Clock3,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

type Period = "AM" | "PM";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  minuteStep?: 1 | 5 | 10 | 15 | 30;
};

function parseTime(value: string) {
  const [hoursString, minutesString] = value.split(":");
  const hours24 = Number(hoursString);
  const minutes = Number(minutesString);

  const safeHours24 = Number.isFinite(hours24)
    ? Math.min(23, Math.max(0, hours24))
    : 8;
  const safeMinutes = Number.isFinite(minutes)
    ? Math.min(59, Math.max(0, minutes))
    : 0;

  return {
    hours12: safeHours24 % 12 || 12,
    minutes: safeMinutes,
    period: (safeHours24 >= 12 ? "PM" : "AM") as Period,
  };
}

function formatValue(hours12: number, minutes: number, period: Period) {
  let hours24 = hours12 % 12;
  if (period === "PM") hours24 += 12;

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function displayValue(value: string) {
  const parsed = parseTime(value);
  return `${String(parsed.hours12).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")} ${parsed.period}`;
}

function wrap(value: number, min: number, max: number) {
  if (value < min) return max;
  if (value > max) return min;
  return value;
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  className,
  label = "Select time",
  placeholder = "Choose a time",
  minuteStep = 1,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseTime(value), [value]);
  const [draft, setDraft] = useState(parsed);

  function openPicker(nextOpen: boolean) {
    if (nextOpen) setDraft(parsed);
    setOpen(nextOpen);
  }

  function applyTime() {
    onChange(formatValue(draft.hours12, draft.minutes, draft.period));
    setOpen(false);
  }

  function clearTime() {
    onChange("");
    setOpen(false);
  }

  function setNow() {
    const now = new Date();
    setDraft(parseTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    ));
  }

  function changeHour(direction: 1 | -1) {
    setDraft((current) => ({
      ...current,
      hours12: wrap(current.hours12 + direction, 1, 12),
    }));
  }

  function changeMinute(direction: 1 | -1) {
    setDraft((current) => ({
      ...current,
      minutes: wrap(current.minutes + direction * minuteStep, 0, 59),
    }));
  }

  function updateHour(rawValue: string) {
    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) return;
    setDraft((current) => ({
      ...current,
      hours12: Math.min(12, Math.max(1, numeric)),
    }));
  }

  function updateMinute(rawValue: string) {
    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) return;
    setDraft((current) => ({
      ...current,
      minutes: Math.min(59, Math.max(0, numeric)),
    }));
  }

  return (
    <Popover open={open} onOpenChange={openPicker}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-3 rounded-[13px] border border-border/70 bg-background px-3.5",
            "text-sm font-normal text-foreground outline-none transition-all",
            "hover:border-primary/30 focus-visible:border-primary/45 focus-visible:ring-4 focus-visible:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-45",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
              <Clock3 size={15} strokeWidth={1.8} />
            </span>
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value ? displayValue(value) : placeholder}
            </span>
          </span>

          <span className="flex items-center gap-1.5">
            {value ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear time"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  clearTime();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X size={14} />
              </span>
            ) : null}
            <ChevronDown
              size={15}
              className={cn(
                "text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        collisionPadding={10}
        className="w-[min(18.5rem,calc(100vw-1rem))] overflow-hidden rounded-[18px] border-border/70 p-0 shadow-[0_18px_55px_rgba(20,15,60,0.16)]"
      >
        <div className="p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{label}</p>

            <div className="flex rounded-[10px] bg-muted/55 p-0.5">
              {(["AM", "PM"] as Period[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, period }))}
                  className={cn(
                    "h-7 rounded-[8px] px-2.5 text-[10px] font-semibold transition-colors",
                    draft.period === period
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-[16px] border border-border/60 bg-muted/[0.14] p-2.5">
            <TimeUnit
              label="Hour"
              value={draft.hours12}
              min={1}
              max={12}
              onIncrement={() => changeHour(1)}
              onDecrement={() => changeHour(-1)}
              onInput={updateHour}
            />

            <span className="mt-4 text-xl font-semibold text-muted-foreground">:</span>

            <TimeUnit
              label="Minute"
              value={draft.minutes}
              min={0}
              max={59}
              onIncrement={() => changeMinute(1)}
              onDecrement={() => changeMinute(-1)}
              onInput={updateMinute}
            />
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[0, 15, 30, 45].map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, minutes: minute }))}
                className={cn(
                  "h-7 shrink-0 rounded-[9px] px-2.5 text-[10px] font-medium tabular-nums transition-colors",
                  draft.minutes === minute
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/45 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                :{String(minute).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/55 bg-muted/[0.14] px-2.5 py-2">
          <button
            type="button"
            onClick={setNow}
            className="inline-flex h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={13} />
            Now
          </button>

          <button
            type="button"
            onClick={applyTime}
            className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-primary px-3.5 text-[11px] font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Check size={13} />
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type TimeUnitProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onInput: (value: string) => void;
};

function TimeUnit({
  label,
  value,
  min,
  max,
  onIncrement,
  onDecrement,
  onInput,
}: TimeUnitProps) {
  return (
    <div className="grid min-w-0 justify-items-center gap-1">
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>

      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={onIncrement}
        className="flex h-7 w-9 items-center justify-center rounded-[9px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <ChevronUp size={14} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onInput(event.target.value)}
        className="h-10 w-[4.25rem] rounded-[12px] border border-border/60 bg-background text-center text-xl font-semibold tabular-nums text-foreground outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={onDecrement}
        className="flex h-7 w-9 items-center justify-center rounded-[9px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <StepDown size={14} />
      </button>
    </div>
  );
}
