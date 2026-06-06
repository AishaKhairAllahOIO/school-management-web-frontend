import type { Announcement } from "../types/announcement.types";

export const announcementEndpoints = {
  list: "/announcements",
  create: "/announcements",
  get: (id: string) => `/announcements/${id}`,
  update: (id: string) => `/announcements/${id}`,
  delete: (id: string) => `/announcements/${id}`,
  publish: (id: string) => `/announcements/${id}/publish`,
  unpublish: (id: string) => `/announcements/${id}/unpublish`,
} as const;

export type CreateAnnouncementPayload = Omit<
  Announcement,
  "id" | "delivered" | "opened"
>;

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;
