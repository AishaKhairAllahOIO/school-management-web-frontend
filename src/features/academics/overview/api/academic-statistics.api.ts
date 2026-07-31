import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type { AcademicStatistics } from "../types/academic-statistics.types";

const EMPTY_STATISTICS: AcademicStatistics = {
  subjectsCount: 0,
  gradeLevelsCount: 0,
  classRoomsCount: 0,
};

function normalizeStatistics(
  statistics: AcademicStatistics | null | undefined,
): AcademicStatistics {
  if (!statistics) {
    return EMPTY_STATISTICS;
  }

  return {
    subjectsCount: Number(statistics.subjectsCount ?? 0),
    gradeLevelsCount: Number(statistics.gradeLevelsCount ?? 0),
    classRoomsCount: Number(statistics.classRoomsCount ?? 0),
  };
}

export const academicStatisticsApi = {
  async get(): Promise<AcademicStatistics> {
    const response = await axiosClient.get<
      ApiResponse<AcademicStatistics>
    >(API_ENDPOINTS.SETTINGS.ACADEMIC_STATISTICS);

    return normalizeStatistics(response.data.data);
  },
};
