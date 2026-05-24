import type { NotificationItem } from "../types/dashboard.types";

export const notificationsMock: NotificationItem[] = [
  {
    id: "notification-001",
    title: "New student registration",
    description: "A new student account needs review.",
    time: "5 min ago",
    isUnread: true,
  },
  {
    id: "notification-002",
    title: "Payment reminder",
    description: "Some invoices are still pending.",
    time: "18 min ago",
    isUnread: true,
  },
  {
    id: "notification-003",
    title: "Attendance alert",
    description: "One class has repeated absences.",
    time: "1 hour ago",
    isUnread: true,
  },
];