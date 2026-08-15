import { axiosClient } from "@/services/axios/axiosClient";

import { API_ENDPOINTS } from "@/services/api/endpoints";

import type { AllMarksResponse } from "../types/marks.types";

export const marksApi = {
  getAllMarks: async (
    academicYearId: number,
    semesterId: number,
  ): Promise<AllMarksResponse> => {
    const response = await axiosClient.get(
      API_ENDPOINTS.MARKS.ALL(academicYearId, semesterId),
    );

    return response.data.data;
  },
};
