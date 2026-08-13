import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  GenerateScheduleResponse,
  RegenerateScheduleResponse,
} from "../types/schedule-generator.types";

function requireResponseData<T>(
  data: T | undefined,
  errorMessage: string,
): T {
  if (data === undefined) {
    throw new Error(errorMessage);
  }

  return data;
}

export const scheduleGenerationApi = {
  async generate(): Promise<GenerateScheduleResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<GenerateScheduleResponse>
      >(
        API_ENDPOINTS.SCHEDULING.GENERATE,
      );

    return requireResponseData(
      response.data.data,
      "Schedule generation result was not returned by the server.",
    );
  },

  async regenerate(): Promise<RegenerateScheduleResponse> {
    const response =
      await axiosClient.post<
        ApiResponse<RegenerateScheduleResponse>
      >(
        API_ENDPOINTS.SCHEDULING.REGENERATE,
      );

    return requireResponseData(
      response.data.data,
      "Schedule regeneration result was not returned by the server.",
    );
  },
};