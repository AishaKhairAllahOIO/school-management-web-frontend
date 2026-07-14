import { httpService } from "@/services/api/httpService";
import { apiEndpoints } from "@/services/api/apiEndpoints";
import {
  type CreateAnnouncementPayload,
  type UpdateAnnouncementPayload,
} from "./announcementEndpoints";
import type { Announcement } from "../types/announcement.types";

export const announcementService = {
  async listAnnouncements(): Promise<Announcement[]> {
    return httpService.get<Announcement[]>(
      apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS
    );
  },

  async createAnnouncement(
    payload: CreateAnnouncementPayload
  ): Promise<Announcement> {
    return httpService.post<Announcement>(
      apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS,
      payload
    );
  },

  async getAnnouncement(id: string): Promise<Announcement> {
    return httpService.get<Announcement>(
      `${apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS}/${id}`
    );
  },

  async updateAnnouncement(
    id: string,
    payload: UpdateAnnouncementPayload
  ): Promise<Announcement> {
    return httpService.put<Announcement>(
      `${apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS}/${id}`,
      payload
    );
  },

  async deleteAnnouncement(id: string): Promise<void> {
    return httpService.delete<void>(
      `${apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS}/${id}`
    );
  },

  async publishAnnouncement(id: string): Promise<Announcement> {
    return httpService.post<Announcement>(
      `${apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS}/${id}/publish`
    );
  },

  async unpublishAnnouncement(id: string): Promise<Announcement> {
    return httpService.post<Announcement>(
      `${apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS}/${id}/unpublish`
    );
  },
};
