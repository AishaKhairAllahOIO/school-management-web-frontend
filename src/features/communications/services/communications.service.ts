import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type {
  Activity,
  ActivityPayload,
  Announcement,
  AnnouncementPayload,
  PaymentAlertPayload,
  AdvisorAlertPayload,
  StaffAlertPayload,
} from "../types/communication.types";

const normalizeIds = (ids?: Array<string | number>) =>
  (ids ?? []).map((id) => Number(id)).filter((id) => Number.isFinite(id));

const normalizePayload = (payload: unknown) => {
  const normalized = { ...(payload as Record<string, unknown>) };

  if (Array.isArray((normalized as any).class_room_ids)) {
    (normalized as any).class_room_ids = normalizeIds((normalized as any).class_room_ids);
  }

  if (Array.isArray((normalized as any).staff_ids)) {
    (normalized as any).staff_ids = normalizeIds((normalized as any).staff_ids);
  }

  if (Array.isArray((normalized as any).enrollement_ids)) {
    (normalized as any).enrollement_ids = normalizeIds((normalized as any).enrollement_ids);
  }

  return normalized;
};

export const communicationService = {
  // ==========================================
  // 1. خدمات الأنشطة (Activities Services)
  // ==========================================
  getAllActivities: async (): Promise<Activity[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMMUNICATIONS.ACTIVITIES);
    return response.data?.data ?? response.data ?? [];
  },

  getActivityById: async (id: string | number): Promise<Activity> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMMUNICATIONS.ACTIVITY(id));
    return response.data?.data ?? response.data;
  },

  createActivity: async (payload: ActivityPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.CREATE_ACTIVITY, normalizePayload(payload));
    return response.data;
  },

  updateActivity: async (id: string | number, payload: Partial<ActivityPayload>) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.UPDATE_ACTIVITY(id), normalizePayload(payload));
    return response.data;
  },

deleteActivity: async (id: string | number) => {

  const response = await axiosClient.delete(API_ENDPOINTS.COMMUNICATIONS.DELETE_ACTIVITY(id));
    return response.data;
  },

  // ==========================================
  // 2. خدمات الإعلانات (Announcements Services)
  // ==========================================
  getCreatedAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMMUNICATIONS.MY_ANNOUNCEMENTS);
    return response.data?.data ?? response.data ?? [];
  },

  getStaffAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMMUNICATIONS.STAFF_ANNOUNCEMENTS);
    return response.data?.data ?? response.data ?? [];
  },


  createAnnouncement: async (payload: AnnouncementPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.CREATE_ANNOUNCEMENT, normalizePayload(payload));
    return response.data;
  },
  
 

  updateAnnouncement: async (id: string | number, payload: Partial<AnnouncementPayload>) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.UPDATE_ANNOUNCEMENT(id), normalizePayload(payload));
    return response.data;
  },

  deleteAnnouncement: async (id: string | number) => {
    const response = await axiosClient.delete(API_ENDPOINTS.COMMUNICATIONS.DELETE_ANNOUNCEMENT(id));
    return response.data;
  },

  // ==========================================
  // 3. خدمات التنبيهات الجماعية (Bulk Alerts Services)
  // ==========================================
  sendPaymentAlert: async (payload: PaymentAlertPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.PAYMENT_ALERTS, normalizePayload(payload));
    return response.data;
  },

  sendAdvisorAlert: async (payload: AdvisorAlertPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.ADVISOR_ALERTS, normalizePayload(payload));
    return response.data;
  },

  sendStaffAlert: async (payload: StaffAlertPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.STAFF_ALERTS, normalizePayload(payload));
    return response.data;
  },

  deleteAlert: async (id: string | number) => {
    const response = await axiosClient.delete(API_ENDPOINTS.COMMUNICATIONS.DELETE_ALERT(id));
    return response.data;
  },
};