import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const userActivitiesService = {

    getMyActivities: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PORTAL.MY_ACTIVITIES);
    return response.data?.data ?? response.data ?? [];
  },


  getChildActivities: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PORTAL.CHILD_ACTIVITIES);
    return response.data?.data ?? response.data ?? [];
  },


  getUnreadCount: async (): Promise<number> => {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PORTAL.ACTIVITY_UNREAD_COUNT);
    return response.data?.count ?? response.data ?? 0;
  },


  markAllAsRead: async () => {

    const response = await axiosClient.post(API_ENDPOINTS.USER_PORTAL.MARK_ALL_ACTIVITIES_READ);
    return response.data;
  },
};