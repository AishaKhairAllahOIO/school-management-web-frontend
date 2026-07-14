import { notificationsMock } from "@/app/layouts/mocks/notifications.mock";

export function useNotifications() {
  const unreadCount = notificationsMock.filter(
    (notification) => notification.isUnread
  ).length;

  return {
    notifications: notificationsMock,
    unreadCount,
  };
}