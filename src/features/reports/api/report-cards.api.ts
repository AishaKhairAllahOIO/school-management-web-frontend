import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiId } from "../../users/shared/types/api.types";
import type { ReportCardRecord } from "../types/report-cards.types";

export const reportCardsApi = {
  // 1. استعراض الجلاءات
 getList: async (semesterId?: ApiId, classRoomId?: ApiId): Promise<ReportCardRecord[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.REPORT_CARDS.LIST, {
      params: { semester_id: semesterId, class_room_id: classRoomId },
    });
    
    // 🔥 التعديل هنا: الوصول إلى مصفوفة الطلاب الداخلية وعمل حماية في حال كانت فارغة
    return response.data?.data?.data ?? [];
  },

  // 2. توليد الجلاءات
  generate: async (payload: { semester_id: ApiId; class_room_id?: ApiId }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.GENERATE, payload);
    return response.data;
  },

  // 3. نشر / إلغاء النشر
  togglePublish: async (payload: { semester_id: ApiId; class_room_id?: ApiId; is_published: boolean }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.TOGGLE_PUBLISH, payload);
    return response.data;
  },

  // 4. الترفيع السنوي
  promote: async (payload: { from_academic_year_id: ApiId; to_academic_year_id: ApiId }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.PROMOTE, payload);
    return response.data;
  },
  // استعراض جلاء طالب واحد
  getSingle: async (reportCardId: number | string) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.REPORT_CARDS.LIST}/${reportCardId}`);
    return response.data?.data;
  },
  
};