export interface Notification {
  id: number | string;
  title: string;
  body: string;
  read?: boolean;
  created_at?: string;
}

export interface NotificationsResponse {
  status?: boolean;
  message?: string;
  data?: Notification[];
}
