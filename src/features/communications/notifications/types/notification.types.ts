export type NotificationCategory =
  | "System"
  | "Attendance"
  | "Finance"
  | "Academics"
  | "General";

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  date: string;
  isUnread: boolean;
}
