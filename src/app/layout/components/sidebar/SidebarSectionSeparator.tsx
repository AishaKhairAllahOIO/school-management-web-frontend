type SidebarSectionSeparatorProps = {
  variant: "icons" | "labels";
  label: string;
  className?: string;
};

const SEPARATOR_LINE_CLASS_NAME = [
  "block h-[4px] shrink-0 border-y border-solid",
  "[border-color:color-mix(in_srgb,var(--sidebar-foreground)_10%,var(--sidebar)_90%)]",
].join(" ");

function SeparatorLines({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        SEPARATOR_LINE_CLASS_NAME,
        compact ? "w-8" : "min-w-0 flex-1",
      ].join(" ")}
    />
  );
}

export function SidebarSectionSeparator({
  variant,
  label,
  className = "",
}: SidebarSectionSeparatorProps) {
  if (variant === "icons") {
    return (
      <div
        aria-hidden="true"
        className={[
          "flex h-6 w-full shrink-0 items-center justify-center",
          className,
        ].join(" ")}
      >
        <SeparatorLines compact />
      </div>
    );
  }

  return (
    <div
      className={[
        "flex h-6 w-full shrink-0 items-center gap-3 px-2",
        className,
      ].join(" ")}
    >
      <span className="shrink-0 text-[9px] font-semibold uppercase leading-none tracking-[0.15em] text-sidebar-muted/58">
        {label}
      </span>

      <SeparatorLines />
    </div>
  );
}
