import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  CreateSchoolImagePayload,
  GeneralSettings,
  SchoolImage,
  UpdateGeneralSettingsPayload,
  UpdateSchoolImagePayload,
} from "../types/general-settings.types";

export const generalSettingsApi = {
  get() {
    return axiosClient.get<ApiResponse<GeneralSettings>>(
      API_ENDPOINTS.SETTINGS.GENERAL,
    );
  },

  update(payload: UpdateGeneralSettingsPayload) {
    return axiosClient.put<ApiResponse<GeneralSettings>>(
      API_ENDPOINTS.SETTINGS.GENERAL,
      payload,
    );
  },

  addImages(payload: CreateSchoolImagePayload) {
    return axiosClient.post<ApiResponse<SchoolImage[]>>(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGES,
      payload,
    );
  },

  updateImage({
    imageId,
    data,
  }: UpdateSchoolImagePayload) {
    return axiosClient.post<ApiResponse<SchoolImage>>(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGE(imageId),
      data,
    );
  },

  deleteImage(imageId: string) {
    return axiosClient.delete<ApiResponse>(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGE(imageId),
    );
  },
};