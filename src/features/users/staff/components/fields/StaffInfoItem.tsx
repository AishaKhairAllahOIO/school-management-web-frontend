import type {
  ReactNode,
} from "react";

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
};

export function StaffInfoItem({
  label,
  value,
  icon,
  direction,
  className = "",
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
        "bg-muted/30",
        "p-4",

        "transition-colors",

        "hover:border-primary/15",
        "hover:bg-primary/[0.025]",

        className,
      ].join(" ")}
    >
      <p
        className={[
          "text-[10px]",
          "font-medium",
          "uppercase",
          "tracking-[0.09em]",
          "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </p>

      <div
        dir={direction}
        className={[
          "mt-2",
          "flex items-center gap-2",

          "text-sm",
          "font-medium",
          "leading-6",

          "text-foreground",
        ].join(" ")}
      >
        {icon ? (
          <span className="shrink-0 text-primary">
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