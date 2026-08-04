import {
  Bell,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useMarkAllUnifiedNotificationsRead,
  useUnifiedNotifications,
  useUnifiedUnreadCount,
} from "@/features/unified-notifications";
import type {
  UnifiedNotificationFilter,
} from "@/features/unified-notifications";
import { Button } from "@/shared/ui/button";

import { UnifiedNotificationCard } from "../components/UnifiedNotificationCard";

const filters: Array<{
  value: UnifiedNotificationFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "system", label: "System" },
  { value: "announcement", label: "Announcements" },
  { value: "alert", label: "Alerts" },
];

export function NotificationsPage() {
  const [filter, setFilter] =
    useState<UnifiedNotificationFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const notificationsQuery = useUnifiedNotifications();
  const unreadQuery = useUnifiedUnreadCount();
  const markAll = useMarkAllUnifiedNotificationsRead();

  const notifications = notificationsQuery.data ?? [];

  const visible = useMemo(
    () =>
      notifications.filter((notification) => {
        const typeMatches =
          filter === "all" || notification.type === filter;
        const readMatches = !unreadOnly || !notification.isRead;
        return typeMatches && readMatches;
      }),
    [filter, notifications, unreadOnly],
  );

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 rounded-[24px] border border-border/60 bg-card p-5 shadow-[0_10px_34px_rgba(38,24,84,0.045)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
            <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold text-foreground">
              Notifications
            </h1>
            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
              Review system notices, announcements, and alerts in one place.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => markAll.mutate()}
          disabled={markAll.isPending || (unreadQuery.data ?? 0) === 0}
          className="h-10 rounded-[13px] border-primary/20 px-4 text-[11px] font-semibold text-primary hover:bg-primary/[0.06] hover:text-primary"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </header>

      <div className="flex flex-col gap-3 rounded-[22px] border border-border/60 bg-card p-2 shadow-[0_8px_28px_rgba(38,24,84,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={[
                  "relative inline-flex h-10 items-center justify-center rounded-[13px] px-4 text-[11px] font-medium transition-colors",
                  filter === item.value
                    ? "bg-primary/[0.08] text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-[13px] px-3 text-[11px] font-medium text-muted-foreground hover:bg-muted/40">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Unread only
        </label>
      </div>

      {notificationsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[110px] animate-pulse rounded-[18px] border border-border/60 bg-card"
            />
          ))}
        </div>
      ) : notificationsQuery.isError ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[22px] border border-destructive/15 bg-destructive/[0.025] p-8 text-center">
          <p className="text-[14px] font-semibold text-foreground">
            Notifications could not be loaded
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Check the connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void notificationsQuery.refetch()}
            className="mt-4 h-9 rounded-[12px]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      ) : visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((notification) => (
            <UnifiedNotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[22px] border border-dashed border-border/70 bg-card p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.07] text-primary">
            <Bell className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-[15px] font-semibold text-foreground">
            No notifications found
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            New system notices, announcements, and alerts will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
