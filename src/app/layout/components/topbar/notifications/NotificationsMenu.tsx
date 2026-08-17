import {
  Bell,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TOPBAR_ICON_BUTTON_CLASS_NAME } from "@/app/layout/components/topbar/topbar.constants";
import type { TopbarMenuProps } from "@/app/layout/components/topbar/topbar.types";
import { useLocale } from "@/app/providers/locale";
import {
  useMarkAllUnifiedNotificationsRead,
  useUnifiedNotifications,
  useUnifiedUnreadCount,
} from "@/features/unified-notifications";
import { UnifiedNotificationCard } from "@/features/unified-notifications/components/UnifiedNotificationCard";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import { NotificationsEmptyState } from "./NotificationsEmptyState";
import { NotificationsSkeleton } from "./NotificationsSkeleton";

export function NotificationsMenu({
  isOpen,
  onToggle,
  onClose,
}: TopbarMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { t } = useLocale();

  const [mobileMenuTop, setMobileMenuTop] = useState<number | null>(null);

  const notificationsQuery = useUnifiedNotifications({
    enabled: isOpen,
  });

  const unreadQuery = useUnifiedUnreadCount();
  const markAllMutation = useMarkAllUnifiedNotificationsRead();

  const notifications = (notificationsQuery.data ?? []).slice(0, 6);
  const unreadCount = unreadQuery.data ?? 0;

  useDismissibleLayer({
    ref: containerRef,
    enabled: isOpen,
    onDismiss: onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      setMobileMenuTop(null);
      return;
    }

    const updatePosition = () => {
      const button = triggerRef.current;

      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();

      setMobileMenuTop(rect.bottom + 8);
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  function openNotificationCenter() {
    onClose();
    navigate("/view/notifications");
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        data-onboarding-target="notifications"
        id="topbar-notifications"
        type="button"
        onClick={onToggle}
        aria-label={t.layout.topbar.notifications}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={TOPBAR_ICON_BUTTON_CLASS_NAME}
      >
        <Bell
          aria-hidden="true"
          size={17}
          strokeWidth={2.1}
        />

        {unreadCount > 0 ? (
          <span className="absolute -end-[7px] -top-[5px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-[4px] text-[10px] font-semibold leading-none text-primary-foreground shadow-[0_4px_10px_rgb(99_102_241_/_0.22)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          role="menu"
          style={
            mobileMenuTop !== null
              ? {
                  top: mobileMenuTop,
                }
              : undefined
          }
className="
  topbar-menu-shadow
  fixed
  inset-x-3
  z-[100]
  mt-0
  max-h-[calc(100dvh-88px)]
  overflow-hidden
  rounded-[18px]
  border
  border-topbar-border/80
  bg-topbar-surface/95
  backdrop-blur-2xl
  origin-top
  animate-in
  fade-in-0
  zoom-in-95
  slide-in-from-top-1
  duration-150

  sm:inset-x-auto
  sm:end-3
  sm:w-[320px]

  lg:fixed
  lg:inset-x-auto
  lg:end-auto
  lg:mt-0
  lg:w-[278px]
  lg:max-h-[calc(100dvh-88px)]
"        >
          <div className="flex items-start justify-between gap-3 border-b border-topbar-divider px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-topbar-title">
                {t.layout.topbar.notificationsTitle}
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
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
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

          <div className="max-h-[calc(100dvh-220px)] overflow-y-auto p-2.5 sm:max-h-[390px] sm:p-3">
            {notificationsQuery.isLoading ? (
              <NotificationsSkeleton />
            ) : notificationsQuery.isError ? (
              <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
                <p className="text-[12px] font-medium text-topbar-text">
                  {t.layout.topbar.notificationsLoadErrorTitle}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-topbar-subtle">
                  {t.layout.topbar.notificationsLoadErrorDescription}
                </p>

                <button
                  type="button"
                  onClick={() => void notificationsQuery.refetch()}
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
            ) : notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <UnifiedNotificationCard
                    key={notification.id}
                    notification={notification}
                    compact
                  />
                ))}
              </div>
            ) : (
              <NotificationsEmptyState />
            )}
          </div>

          <div className="border-t border-topbar-divider p-2">
            <button
              type="button"
              onClick={openNotificationCenter}
              className="flex h-10 w-full items-center justify-center rounded-[12px] text-[11px] font-semibold text-primary transition-colors hover:bg-primary/[0.07]"
            >
              {t.layout.topbar.viewAllNotifications}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}