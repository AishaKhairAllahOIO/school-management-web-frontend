export type CurrentUser = {
  id: string;
  fullName: string;
  role: string;
  avatarUrl: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
};