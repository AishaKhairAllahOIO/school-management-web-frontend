import type { ProfileMenuItemProps } from "../topbar.types";

export function ProfileMenuItem({
  title,
  description,
  icon: Icon,
  onClick,
  tone = "default",
}: ProfileMenuItemProps) {
  const isPrimary = tone === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex min-h-[52px] w-full items-center gap-3",
        "rounded-[15px] border px-3 text-start",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
        isPrimary
          ? "border-primary/10 bg-primary/[0.045] hover:border-primary/20 hover:bg-primary/[0.075]"
          : "border-transparent hover:border-topbar-border/70 hover:bg-topbar-soft",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]",
          "transition-colors duration-200",
          isPrimary
            ? "bg-primary/[0.10] text-primary"
            : "bg-topbar-soft text-topbar-text group-hover:bg-topbar-surface",
        ].join(" ")}
      >
        <Icon aria-hidden="true" size={16} strokeWidth={1.9} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold leading-5 text-topbar-text">
          {title}
        </span>

        {description ? (
          <span className="mt-0.5 block truncate text-[11px] font-normal leading-4 text-topbar-subtle">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
