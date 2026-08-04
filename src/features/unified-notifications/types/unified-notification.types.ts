export type UnifiedNotificationType =
  | "system"
  | "announcement"
  | "alert";

export type UnifiedNotification = {
  id: string;
  sourceId: string | number;
  type: UnifiedNotificationType;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  meta?: Record<string, unknown> | null;
};

export type BellUnreadCountResponse = {
  total_unread?: number;
  totalUnread?: number;
};

export type UnifiedNotificationFilter =
  | "all"
  | UnifiedNotificationType;
