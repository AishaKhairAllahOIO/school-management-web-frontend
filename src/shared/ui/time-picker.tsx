import {
  Check,
  Clock3,
  RotateCcw,
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

  const period: Period = safeHours24 >= 12 ? "PM" : "AM";
  const hours12 = safeHours24 % 12 || 12;

  return { hours12, minutes: safeMinutes, period };
}

function formatValue(
  hours12: number,
  minutes: number,
  period: Period,
) {
  let hours24 = hours12 % 12;
  if (period === "PM") hours24 += 12;

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function displayValue(value: string) {
  const parsed = parseTime(value);

  return `${String(parsed.hours12).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")} ${parsed.period}`;
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  className,
  label = "Select time",
  placeholder = "Choose a time",
  minuteStep = 5,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseTime(value), [value]);

  const [draft, setDraft] = useState(parsed);

  const minutes = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(60 / minuteStep) },
        (_, index) => index * minuteStep,
      ).filter((minute) => minute < 60),
    [minuteStep],
  );

  function openPicker(nextOpen: boolean) {
    if (nextOpen) setDraft(parsed);
    setOpen(nextOpen);
  }

  function applyTime() {
    onChange(formatValue(draft.hours12, draft.minutes, draft.period));
    setOpen(false);
  }

  function setNow() {
    const now = new Date();
    const roundedMinutes =
      Math.round(now.getMinutes() / minuteStep) * minuteStep;
    const normalizedDate = new Date(now);

    if (roundedMinutes >= 60) {
      normalizedDate.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      normalizedDate.setMinutes(roundedMinutes, 0, 0);
    }

    const next = parseTime(
      `${String(normalizedDate.getHours()).padStart(2, "0")}:${String(
        normalizedDate.getMinutes(),
      ).padStart(2, "0")}`,
    );

    setDraft(next);
  }

  return (
    <Popover open={open} onOpenChange={openPicker}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
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
            <span className="truncate">
              {value ? displayValue(value) : placeholder}
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground">HH:MM</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        className="z-[150] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[20px] border border-border/70 bg-popover p-0 shadow-[0_22px_64px_rgba(15,10,40,0.16)]"
      >
        <div className="border-b border-border/55 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Choose the hour and minute, then confirm.
          </p>
        </div>

        <div className="p-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="rounded-[14px] bg-primary/[0.07] px-4 py-2 text-2xl font-semibold tabular-nums text-primary">
              {String(draft.hours12).padStart(2, "0")}
              <span className="mx-1 text-muted-foreground">:</span>
              {String(draft.minutes).padStart(2, "0")}
            </div>

            <div className="grid rounded-[12px] border border-border/65 bg-muted/20 p-1">
              {(["AM", "PM"] as Period[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, period }))}
                  className={cn(
                    "h-8 rounded-[9px] px-3 text-[11px] font-semibold transition-colors",
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Hour
              </p>
              <div className="grid max-h-[176px] grid-cols-3 gap-1.5 overflow-y-auto pe-1 [scrollbar-width:thin]">
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({ ...current, hours12: hour }))
                      }
                      className={cn(
                        "h-9 rounded-[10px] text-xs font-medium tabular-nums transition-colors",
                        draft.hours12 === hour
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 text-foreground hover:bg-muted",
                      )}
                    >
                      {String(hour).padStart(2, "0")}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Minute
              </p>
              <div className="grid max-h-[176px] grid-cols-3 gap-1.5 overflow-y-auto pe-1 [scrollbar-width:thin]">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({ ...current, minutes: minute }))
                    }
                    className={cn(
                      "h-9 rounded-[10px] text-xs font-medium tabular-nums transition-colors",
                      draft.minutes === minute
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-foreground hover:bg-muted",
                    )}
                  >
                    {String(minute).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/55 bg-muted/[0.18] px-3 py-2.5">
          <button
            type="button"
            onClick={setNow}
            className="inline-flex h-9 items-center gap-2 rounded-[11px] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={14} />
            Now
          </button>

          <button
            type="button"
            onClick={applyTime}
            className="inline-flex h-9 items-center gap-2 rounded-[11px] bg-primary px-4 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Check size={14} />
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
