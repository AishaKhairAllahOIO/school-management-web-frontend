type SidebarSectionSeparatorProps = {
  variant: "icons" | "labels";
  label: string;
  className?: string;
};

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
        <span className="h-px w-8 bg-sidebar-foreground/[0.09]" />
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

      <span
        aria-hidden="true"
        className="h-px min-w-0 flex-1 bg-sidebar-foreground/[0.07]"
      />
    </div>
  );
}