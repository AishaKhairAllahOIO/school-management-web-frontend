import {
  BellOff,
} from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-9 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-topbar-soft text-topbar-muted">
        <BellOff
          aria-hidden="true"
          size={18}
          strokeWidth={1.8}
        />
      </span>

      <p className="mt-3 text-[12px] font-medium text-topbar-text">
        No system notifications
      </p>

      <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-topbar-subtle">
        New system updates will appear here.
      </p>
    </div>
  );
}
