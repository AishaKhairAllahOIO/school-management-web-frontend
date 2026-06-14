import { notificationsMock } from "@/app/layouts/app/mocks/notifications.mock";

export function useNotifications() {
  const unreadCount = notificationsMock.filter(
    (notification) => notification.isUnread
  ).length;

  return {
    notifications: notificationsMock,
    unreadCount,
  };
}