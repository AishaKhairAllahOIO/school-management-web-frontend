export type SystemNoticeMeta = Record<
  string,
  unknown
>;

export type SystemNotice = {
  id: number;
  notifiable_id: number;
  notifiable_type: string;
  type: "system_notice" | string;
  audience: string;
  title: string;
  description: string;
  meta: SystemNoticeMeta | null;
  created_by: number | null;
  is_read?: boolean;
  created_at: string;
  updated_at: string;
};

export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type PaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type SystemNoticesResponse = {
  success: boolean;
  message?: string;
  data: SystemNotice[];
  links: PaginationLinks | null;
  meta: PaginationMeta | null;
};

export type UnreadSystemNoticesCount = {
  unread_count: number;
};
