import type {
  ReactNode,
} from "react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

import {
  defaultStaffSectionColor,
} from "../theme/staff-theme";

type StaffInfoItemProps = {
  label: string;

  value:
    | string
    | number
    | null
    | undefined;

  icon?: ReactNode;

  direction?: "ltr" | "rtl";

  className?: string;

  color?: StaffSectionColor;
};


export function StaffInfoItem({
  label,
  value,
  icon,
  direction,
  className = "",
  color = defaultStaffSectionColor,
}: StaffInfoItemProps) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "Not specified"
      : value;

  return (
    <article
      className={[
        "group rounded-[18px]",
        "border border-border/60",
        "bg-muted/30 p-4",
        "transition-colors",
        color.itemHover,
        className,
      ].join(" ")}
    >
      <p
        className={[
          "text-[10px] font-medium",
          "uppercase tracking-[0.09em]",
          "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </p>

      <div
        dir={direction}
        className={[
          "mt-2 flex items-center gap-2",
          "text-sm font-medium leading-6",
          "text-foreground",
        ].join(" ")}
      >
        {icon ? (
          <span
            className={[
              "shrink-0",
              color.text,
            ].join(" ")}
          >
            {icon}
          </span>
        ) : null}

        <span className="break-words">
          {displayValue}
        </span>
      </div>
    </article>
  );
}
