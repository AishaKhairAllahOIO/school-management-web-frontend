import { axiosClient } from "@/services/axios/axiosClient";

import { announcementEndpoints } from "./announcementEndpoints";
import type {
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "./announcementEndpoints";
import type { Announcement } from "../types/announcement.types";

export const announcementService = {
  async listAnnouncements(): Promise<Announcement[]> {
    const response = await axiosClient.get<Announcement[]>(
      announcementEndpoints.list,
    );

    return response.data;
  },

  async createAnnouncement(
    payload: CreateAnnouncementPayload,
  ): Promise<Announcement> {
    const response = await axiosClient.post<Announcement>(
      announcementEndpoints.create,
      payload,
    );

    return response.data;
  },

  async getAnnouncement(
    id: string,
  ): Promise<Announcement> {
    const response = await axiosClient.get<Announcement>(
      announcementEndpoints.get(id),
    );

    return response.data;
  },

  async updateAnnouncement(
    id: string,
    payload: UpdateAnnouncementPayload,
  ): Promise<Announcement> {
    const response = await axiosClient.put<Announcement>(
      announcementEndpoints.update(id),
      payload,
    );

    return response.data;
  },

  async deleteAnnouncement(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      announcementEndpoints.delete(id),
    );
  },

  async publishAnnouncement(
    id: string,
  ): Promise<Announcement> {
    const response = await axiosClient.post<Announcement>(
      announcementEndpoints.publish(id),
    );

    return response.data;
  },

  async unpublishAnnouncement(
    id: string,
  ): Promise<Announcement> {
    const response = await axiosClient.post<Announcement>(
      announcementEndpoints.unpublish(id),
    );

    return response.data;
  },
};