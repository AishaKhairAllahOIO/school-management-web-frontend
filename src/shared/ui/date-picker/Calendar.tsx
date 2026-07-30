import { DayPicker, type DayPickerProps } from "@daypicker/react";
import "@daypicker/react/style.css";

import { cn } from "@/shared/lib/utils";
import "./date-picker.css";

export function Calendar({ className, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn("school-calendar-picker", className)}
      showOutsideDays
      {...props}
    />
  );
}
