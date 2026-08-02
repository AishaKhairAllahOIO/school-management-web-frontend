import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { SchoolLaw, LawPayload } from "../types/school-laws.types";

export const schoolLawsService = {

    getAllLaws: async (): Promise<SchoolLaw[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.SCHOOL_LAWS.GET_ALL);

    return response.data.data || [];
  },


  getLawById: async (id: string | number): Promise<SchoolLaw> => {
    const response = await axiosClient.get(API_ENDPOINTS.SCHOOL_LAWS.GET_ONE(id));
    return response.data.data;
  },


  createLaw: async (payload: LawPayload) => {
    const response = await axiosClient.post(API_ENDPOINTS.SCHOOL_LAWS.CREATE, payload);
    return response.data;
  },


  updateLaw: async (id: string | number, payload: Partial<LawPayload>) => {
    const response = await axiosClient.post(API_ENDPOINTS.SCHOOL_LAWS.UPDATE(id), payload);
    return response.data;
  },


  deleteLaw: async (id: string | number) => {
    const response = await axiosClient.delete(API_ENDPOINTS.SCHOOL_LAWS.DELETE(id));
    return response.data;
  },
};