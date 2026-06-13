import { Bell, Dot } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";

const statusClasses = (isUnread: boolean) =>
  isUnread
    ? "text-foreground font-semibold"
    : "text-muted-foreground";

export function NotificationsPage() {
  const notifications = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            All school notifications in one place.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Bell size={18} />
          {notifications.filter((item) => item.isUnread).length} unread
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card">
        <div className="grid grid-cols-[4rem_auto_10rem_10rem] gap-4 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span />
          <span>Notification</span>
          <span>Category</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-border/70">
          {notifications.map((notification: Notification) => (
            <div
              key={notification.id}
              className="grid grid-cols-[4rem_auto_10rem_10rem] gap-4 px-6 py-5 items-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/5">
                <Dot
                  className={notification.isUnread ? "text-primary" : "text-muted-foreground"}
                  size={16}
                />
              </div>
              <div>
                <p className={statusClasses(notification.isUnread)}>
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <div className="text-sm text-foreground">{notification.category}</div>
              <div className="text-sm text-muted-foreground">{notification.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
