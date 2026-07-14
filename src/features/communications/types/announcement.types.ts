export type AnnouncementAudience = "students" | "staff" | "both";

export interface Announcement {
  id: number | string;
  audience: AnnouncementAudience;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAnnouncementPayload {
  audience: AnnouncementAudience;
  title: string;
  description: string;
}

export interface AnnouncementCreateResponse {
  // backend examples don't provide a full create response; keep minimal
  status?: boolean;
  message?: string;
  data?: Announcement;
}
