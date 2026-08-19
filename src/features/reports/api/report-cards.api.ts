import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiId } from "../../users/shared/types/api.types";

export const reportCardsApi = {


  getList: async (semesterId?: ApiId, gradeId?: ApiId, classRoomId?: ApiId, page: number = 1) => {
  const response = await axiosClient.get(API_ENDPOINTS.REPORT_CARDS.LIST, {
    params: { 
      semester_id: semesterId, 
      grade_id: gradeId, 
      class_room_id: classRoomId,
      page: page
    },
  });
    return response.data?.data; 
},

  generate: async (payload: { semester_id: ApiId; class_room_id?: ApiId }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.GENERATE, payload);
    return response.data;
  },


  togglePublish: async (payload: { semester_id: ApiId;grade_id?: ApiId; class_room_id?: ApiId; is_published: boolean }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.TOGGLE_PUBLISH, payload);
    return response.data;
  },


  promote: async (payload: { from_academic_year_id: ApiId; to_academic_year_id: ApiId }) => {
    const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.PROMOTE, payload);
    return response.data;
  },

  getSingle: async (reportCardId: number | string) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.REPORT_CARDS.LIST}/${reportCardId}`);
    return response.data?.data;
  },
  
};