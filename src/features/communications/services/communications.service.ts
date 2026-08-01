import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; // 👈 استيراد مساراتك المركزية
import type {
  Activity,
  ActivityPayload,
  Announcement,
  AnnouncementPayload,
  PaymentAlertPayload,
  AdvisorAlertPayload,
  StaffAlertPayload,
} from "../types/communication.types";

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

  createActivity: async (payload: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.CREATE_ACTIVITY, payload);
    return response.data;
  },

  updateActivity: async (id: string | number, payload: Partial<ActivityPayload>) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.UPDATE_ACTIVITY(id), payload);
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


  createAnnouncement: async (payload: any) => {
    // استخدمنا CREATE_ANNOUNCEMENT أو ANNOUNCEMENTS حسب ما عرفناه في ملف endpoints
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.CREATE_ANNOUNCEMENT, payload);
    return response.data;
  },
  
 

  updateAnnouncement: async (id: string | number, payload: Partial<AnnouncementPayload>) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.UPDATE_ANNOUNCEMENT(id), payload);
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
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.PAYMENT_ALERTS, payload);
    return response.data;
  },

  sendAdvisorAlert: async (payload: AdvisorAlertPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.ADVISOR_ALERTS, payload);
    return response.data;
  },

  sendStaffAlert: async (payload: StaffAlertPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.COMMUNICATIONS.STAFF_ALERTS, payload);
    return response.data;
  },

  deleteAlert: async (id: string | number) => {
    const response = await axiosClient.delete(API_ENDPOINTS.COMMUNICATIONS.DELETE_ALERT(id));
    return response.data;
  },
};