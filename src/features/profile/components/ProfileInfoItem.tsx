import type {
  LucideIcon,
} from "lucide-react";

type ProfileInfoItemProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  compact?: boolean;
  className?: string;
};

export function ProfileInfoItem({
  label,
  value,
  icon: Icon,
  compact = false,
  className = "",
}: ProfileInfoItemProps) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : value;

  return (
    <div
      className={[
        "group flex min-w-0 items-center",
        compact
          ? "gap-3 rounded-[16px] px-3 py-2.5"
          : "gap-3 rounded-[18px] px-3.5 py-3",
        "border border-border/60",
        "bg-card",
        "transition-colors",
        "hover:border-primary/20",
        "hover:bg-primary/[0.025]",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "flex shrink-0 items-center",
          "justify-center",
          "bg-primary/[0.08]",
          "text-primary",
          "transition-colors",
          "group-hover:bg-primary/[0.12]",
          compact
            ? "h-9 w-9 rounded-[12px]"
            : "h-10 w-10 rounded-[14px]",
        ].join(" ")}
      >
        <Icon
          className={
            compact
              ? "h-4 w-4"
              : "h-[17px] w-[17px]"
          }
          strokeWidth={2}
        />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate font-medium",
            "text-muted-foreground",
            compact
              ? "text-[10px]"
              : "text-[11px]",
          ].join(" ")}
        >
          {label}
        </p>

        <p
          className={[
            "mt-0.5 truncate",
            "font-semibold",
            "text-foreground",
            compact
              ? "text-[13px]"
              : "text-sm",
          ].join(" ")}
          title={String(
            displayValue,
          )}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}