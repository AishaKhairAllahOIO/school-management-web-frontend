import { httpService } from "@/services/api/httpService";
import { apiEndpoints } from "@/services/api/apiEndpoints";

import type {
  Announcement,
  CreateAnnouncementPayload,
  AnnouncementCreateResponse,
} from "../types/announcement.types";

import type { DeviceTokenPayload, DeviceTokenResponse } from "../types/deviceToken.types";
import type { NotificationsResponse } from "../types/notification.types";

export const communicationsService = {
  // Admin create announcement (protected)
  createAnnouncement(payload: CreateAnnouncementPayload) {
    return httpService.post<AnnouncementCreateResponse>(
      apiEndpoints.COMMUNICATIONS.AUTH_ANNOUNCEMENTS,
      payload
    );
  },

  // User announcements
  getUserAnnouncements(params?: object) {
    return httpService.get<Announcement[]>(
      apiEndpoints.COMMUNICATIONS.USER_ANNOUNCEMENTS,
      params
    );
  },

  // User alerts/notifications
  getUserAlerts(params?: object) {
    return httpService.get<NotificationsResponse>(
      apiEndpoints.COMMUNICATIONS.USER_ALERTS,
      params
    );
  },

  // Store device token (fcm)
  storeDeviceToken(payload: DeviceTokenPayload) {
    // Postman shows fcm_token as query param; backend should accept body as well.
    return httpService.post<DeviceTokenResponse>(
      apiEndpoints.COMMUNICATIONS.USER_DEVICE_TOKENS,
      payload
    );
  },
};
