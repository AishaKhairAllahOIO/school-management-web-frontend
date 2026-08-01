import { Clock3 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

type Period = "AM" | "PM";

function parseTime(value: string) {
  const [hoursString, minutesString] =
    value.split(":");

  const hours24 = Number(hoursString);
  const minutes = Number(minutesString);

  const safeHours24 = Number.isFinite(hours24)
    ? hours24
    : 8;
  const safeMinutes = Number.isFinite(minutes)
    ? minutes
    : 0;

  const period: Period =
    safeHours24 >= 12 ? "PM" : "AM";

  const hours12 = safeHours24 % 12 || 12;

  return {
    hours12,
    minutes: safeMinutes,
    period,
  };
}

function formatValue(
  hours12: number,
  minutes: number,
  period: Period,
) {
  let hours24 = hours12 % 12;

  if (period === "PM") {
    hours24 += 12;
  }

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
  className = "",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const parsed = useMemo(
    () => parseTime(value),
    [value],
  );

  function updateTime(
    next: Partial<{
      hours12: number;
      minutes: number;
      period: Period;
    }>,
  ) {
    onChange(
      formatValue(
        next.hours12 ?? parsed.hours12,
        next.minutes ?? parsed.minutes,
        next.period ?? parsed.period,
      ),
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={[
            "flex h-10 w-full items-center justify-between rounded-[12px] border border-border/65 bg-background px-3.5",
            "text-[12px] font-normal text-foreground outline-none transition-all",
            "hover:border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-45",
            className,
          ].join(" ")}
        >
          <span>{displayValue(value)}</span>
          <Clock3
            size={15}
            strokeWidth={1.8}
            className="text-muted-foreground"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-4">
        <div className="mb-3">
          <p className="text-[13px] font-medium text-foreground">
            Select start time
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Choose hour, minute and period.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_1fr_88px] gap-2">
          <Select
            value={String(parsed.hours12)}
            onValueChange={(nextValue) =>
              updateTime({
                hours12: Number(nextValue),
              })
            }
          >
            <SelectTrigger aria-label="Hour">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 12 },
                (_, index) => index + 1,
              ).map((hour) => (
                <SelectItem
                  key={hour}
                  value={String(hour)}
                >
                  {String(hour).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(parsed.minutes)}
            onValueChange={(nextValue) =>
              updateTime({
                minutes: Number(nextValue),
              })
            }
          >
            <SelectTrigger aria-label="Minute">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 60 },
                (_, minute) => minute,
              ).map((minute) => (
                <SelectItem
                  key={minute}
                  value={String(minute)}
                >
                  {String(minute).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={parsed.period}
            onValueChange={(nextValue) =>
              updateTime({
                period: nextValue as Period,
              })
            }
          >
            <SelectTrigger aria-label="Period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-full bg-primary px-4 text-[11px] font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Done
        </button>
      </PopoverContent>
    </Popover>
  );
}
