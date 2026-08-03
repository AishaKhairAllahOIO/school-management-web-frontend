import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  Activity,
  ActivityPayload,
  AdvisorAlertPayload,
  Announcement,
  AnnouncementPayload,
  PaymentAlertPayload,
  StaffAlertPayload,
} from "../types/communication.types";

const WEB_COMMUNICATION_ROUTES = {
  sendStaffAlert: "/auth/alerts/general/staff/send",
  sendPaymentAlert: "/auth/alerts/payments/staff/send",
  sendStudentAlert: "/auth/alerts/for-student/send",
} as const;

const normalizeIds = (ids?: Array<string | number>) =>
  (ids ?? [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));

const normalizePayload = (payload: unknown) => {
  const normalized = {
    ...(payload as Record<string, unknown>),
  };

  if (Array.isArray(normalized.class_room_ids)) {
    normalized.class_room_ids = normalizeIds(
      normalized.class_room_ids as Array<string | number>,
    );
  }

  if (Array.isArray(normalized.staff_ids)) {
    normalized.staff_ids = normalizeIds(
      normalized.staff_ids as Array<string | number>,
    );
  }

  if (Array.isArray(normalized.enrollment_ids)) {
    normalized.enrollment_ids = normalizeIds(
      normalized.enrollment_ids as Array<string | number>,
    );
  }

  return normalized;
};

function unwrapData<T>(response: unknown): T {
  const value = response as any;
  return (value?.data?.data ?? value?.data ?? value) as T;
}

export const communicationService = {
  getAllActivities: async (): Promise<Activity[]> => {
    const response = await axiosClient.get(
      API_ENDPOINTS.COMMUNICATIONS.ALL_ACTIVITIES,
    );

    return unwrapData<Activity[]>(response) ?? [];
  },

  getActivityById: async (
    id: string | number,
  ): Promise<Activity> => {
    const response = await axiosClient.get(
      API_ENDPOINTS.COMMUNICATIONS.ACTIVITY(id),
    );

    return unwrapData<Activity>(response);
  },

  createActivity: async (payload: ActivityPayload) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.COMMUNICATIONS.CREATE_ACTIVITY,
      normalizePayload(payload),
    );

    return response.data;
  },

  updateActivity: async (
    id: string | number,
    payload: Partial<ActivityPayload>,
  ) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.COMMUNICATIONS.UPDATE_ACTIVITY(id),
      normalizePayload(payload),
    );

    return response.data;
  },

  deleteActivity: async (id: string | number) => {
    const response = await axiosClient.delete(
      API_ENDPOINTS.COMMUNICATIONS.DELETE_ACTIVITY(id),
    );

    return response.data;
  },

  getCreatedAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axiosClient.get(
      API_ENDPOINTS.COMMUNICATIONS.CREATOR_ANNOUNCEMENTS,
    );

    return unwrapData<Announcement[]>(response) ?? [];
  },

  getStaffAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axiosClient.get(
      API_ENDPOINTS.COMMUNICATIONS.STAFF_ANNOUNCEMENTS,
    );

    return unwrapData<Announcement[]>(response) ?? [];
  },

  createAnnouncement: async (payload: AnnouncementPayload) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.COMMUNICATIONS.CREATE_ANNOUNCEMENT,
      normalizePayload(payload),
    );

    return response.data;
  },

  updateAnnouncement: async (
    id: string | number,
    payload: Partial<AnnouncementPayload>,
  ) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.COMMUNICATIONS.UPDATE_ANNOUNCEMENT(id),
      normalizePayload(payload),
    );

    return response.data;
  },

  deleteAnnouncement: async (id: string | number) => {
    const response = await axiosClient.delete(
      API_ENDPOINTS.COMMUNICATIONS.DELETE_ANNOUNCEMENT(id),
    );

    return response.data;
  },

  sendPaymentAlert: async (payload: PaymentAlertPayload) => {
    const response = await axiosClient.post(
      WEB_COMMUNICATION_ROUTES.sendPaymentAlert,
      normalizePayload(payload),
    );

    return response.data;
  },

  sendAdvisorAlert: async (payload: AdvisorAlertPayload) => {
    const response = await axiosClient.post(
      WEB_COMMUNICATION_ROUTES.sendStudentAlert,
      normalizePayload(payload),
    );

    return response.data;
  },

  sendStaffAlert: async (payload: StaffAlertPayload) => {
    const response = await axiosClient.post(
      WEB_COMMUNICATION_ROUTES.sendStaffAlert,
      normalizePayload(payload),
    );

    return response.data;
  },

  deleteAlert: async (id: string | number) => {
    const response = await axiosClient.delete(
      API_ENDPOINTS.COMMUNICATIONS.DELETE_ALERT(id),
    );

    return response.data;
  },
};
