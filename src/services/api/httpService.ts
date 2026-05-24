import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse, PaginatedResponse } from "./apiResponse";

export const httpService = {
  get: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    const response = await axiosClient.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  },

  getPaginated: async <T>(url: string, params?: Record<string, any>): Promise<PaginatedResponse<T>> => {
    const response = await axiosClient.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.post<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.put<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosClient.patch<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosClient.delete<ApiResponse<T>>(url);
    return response.data.data;
  },
};


