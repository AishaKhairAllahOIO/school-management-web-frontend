import {
  Bell,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import {
  useRef,
} from "react";

import {
  TOPBAR_ICON_BUTTON_CLASS_NAME,
} from "@/app/layout/components/topbar/topbar.constants";
import type {
  TopbarMenuProps,
} from "@/app/layout/components/topbar/topbar.types";
import {
  useLocale,
} from "@/app/providers/locale";
import {
  useMarkAllSystemNoticesRead,
  useSystemNotices,
  useUnreadSystemNoticesCount,
} from "@/features/system-notices";
import {
  useDismissibleLayer,
} from "@/shared/hooks/use-dismissible-layer";

import {
  NotificationItem,
} from "./NotificationItem";
import {
  NotificationsEmptyState,
} from "./NotificationsEmptyState";
import {
  NotificationsSkeleton,
} from "./NotificationsSkeleton";

export function NotificationsMenu({
  isOpen,
  onToggle,
  onClose,
}: TopbarMenuProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const {
    locale,
    t,
  } = useLocale();

  const noticesQuery =
    useSystemNotices({
      enabled: isOpen,
    });

  const unreadQuery =
    useUnreadSystemNoticesCount();

  const markAllMutation =
    useMarkAllSystemNoticesRead();

  const notices =
    noticesQuery.data?.data ?? [];

  const unreadCount =
    unreadQuery.data ?? 0;

  useDismissibleLayer({
    ref: containerRef,
    enabled: isOpen,
    onDismiss: onClose,
  });

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.notifications
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={
          TOPBAR_ICON_BUTTON_CLASS_NAME
        }
      >
        <Bell
          aria-hidden="true"
          size={17}
          strokeWidth={2.1}
        />

        {unreadCount > 0 ? (
          <span className="absolute -end-[7px] -top-[5px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-[4px] text-[10px] font-semibold leading-none text-primary-foreground shadow-[0_4px_10px_rgb(99_102_241_/_0.22)]">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="topbar-menu-shadow absolute end-0 top-full z-50 mt-3 w-[360px] max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-24px)] overflow-hidden rounded-[18px] border border-topbar-border/80 bg-topbar-surface/95 backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-topbar-divider px-3 py-3">
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-topbar-title">
                {
                  t.layout.topbar
                    .notificationsTitle
                }
              </h2>

              <p className="mt-1 text-[12px] text-topbar-subtle">
                {t.layout.topbar.unreadUpdates.replace(
                  "{{count}}",
                  String(unreadCount),
                )}
              </p>
            </div>

            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() =>
                  markAllMutation.mutate()
                }
                disabled={
                  markAllMutation.isPending
                }
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[11px] px-2.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/[0.07] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <CheckCheck
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.9}
                />

                {t.layout.topbar.markAllRead}
              </button>
            ) : null}
          </div>

          <div className="max-h-[330px] overflow-y-auto p-2 pe-1 sm:p-3 sm:pe-2">
            {noticesQuery.isLoading ? (
              <NotificationsSkeleton />
            ) : noticesQuery.isError ? (
              <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
                <p className="text-[12px] font-medium text-topbar-text">
                  {
                    t.layout.topbar
                      .notificationsLoadErrorTitle
                  }
                </p>

                <p className="mt-1 text-[11px] leading-5 text-topbar-subtle">
                  {
                    t.layout.topbar
                      .notificationsLoadErrorDescription
                  }
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void noticesQuery.refetch();
                  }}
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-[11px] bg-topbar-soft px-3 text-[11px] font-medium text-topbar-text transition hover:bg-topbar-soft-hover"
                >
                  <RefreshCw
                    aria-hidden="true"
                    size={13}
                    strokeWidth={1.9}
                  />

                  {t.common.tryAgain}
                </button>
              </div>
            ) : notices.length > 0 ? (
              <div className="space-y-2">
                {notices.map((notice) => (
                  <NotificationItem
                    key={notice.id}
                    notice={notice}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <NotificationsEmptyState />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
