import {
  CalendarDays,
  ChevronDown,
  X,
} from "lucide-react";
import {
  useId,
  useState,
} from "react";

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

  const [open, setOpen] =
    useState(false);

  const selected =
    parseApiDate(value);

  const minDate =
    parseApiDate(min);

  const maxDate =
    parseApiDate(max);

  const disabledMatcher =
    minDate || maxDate
      ? {
          before: minDate,
          after: maxDate,
        }
      : undefined;

  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-medium text-foreground"
        >
          {label}

          {required ? (
            <span className="ml-1 text-destructive">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <input
        type="hidden"
        name={name}
        value={value ?? ""}
      />

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (
            disabled ||
            readOnly
          ) {
            return;
          }

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
              "flex h-11 w-full min-w-0 items-center gap-3 rounded-[13px] border bg-background px-3.5 text-left text-sm outline-none transition-all",
              "border-border/70 hover:border-border",
              "focus-visible:border-primary/45 focus-visible:ring-4 focus-visible:ring-primary/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-destructive/55 focus-visible:border-destructive/70 focus-visible:ring-destructive/10",
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
              {icon ?? (
                <CalendarDays
                  size={15}
                  strokeWidth={1.8}
                />
              )}
            </span>

            <span
              className={cn(
                "min-w-0 flex-1 truncate font-normal",
                selected
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {selected
                ? formatDateForDisplay(
                    value,
                  )
                : placeholder}
            </span>

            {selected &&
            !readOnly &&
            !disabled ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                onPointerDown={(
                  event,
                ) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange("");
                  setOpen(false);
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                      "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange("");
                    setOpen(false);
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
          aria-label={
            label ?? "Choose date"
          }
          align="start"
          side="bottom"
          sideOffset={8}
          alignOffset={0}
          collisionPadding={16}
          avoidCollisions
          sticky="always"
          className={[
            "z-[150] w-auto",
            "max-w-[calc(100vw-2rem)]",
            "rounded-[20px]",
            "border border-border/70",
            "bg-popover p-3",
            "text-popover-foreground",
            "shadow-[0_24px_70px_rgba(15,10,40,0.20)]",
          ].join(" ")}
        >
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={
              selected ??
              minDate ??
              new Date()
            }
            disabled={
              disabledMatcher
            }
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange(
                formatDateForApi(
                  date,
                ),
              );

              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {error || helperText ? (
        <p
          className={cn(
            "mt-1.5 text-xs",
            error
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {error ?? helperText}
        </p>
      ) : null}
    </div>
  );
}
