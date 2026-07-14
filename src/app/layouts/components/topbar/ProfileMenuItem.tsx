import type { ProfileMenuItemProps } from "./topbar.types";

export function ProfileMenuItem({
  title,
  icon: Icon,
  onClick,
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-start text-[13px] font-semibold text-topbar-text transition hover:bg-topbar-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-topbar-soft text-topbar-text">
        <Icon
          aria-hidden="true"
          size={16}
          strokeWidth={2.05}
        />
      </span>

      {title}
    </button>
  );
}