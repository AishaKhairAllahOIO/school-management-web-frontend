import { axiosClient } from "@/services/axios/axiosClient";

export const httpService = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    const response = await axiosClient.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.put<T>(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.patch<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosClient.delete<T>(url);
    return response.data;
  },
};