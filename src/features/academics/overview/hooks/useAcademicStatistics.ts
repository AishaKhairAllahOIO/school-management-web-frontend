import { useQuery } from "@tanstack/react-query";

import { academicStatisticsApi } from "../api/academic-statistics.api";
import type { AcademicStatistics } from "../types/academic-statistics.types";

export const academicStatisticsQueryKey = [
  "academics",
  "overview",
  "statistics",
] as const;

export function useAcademicStatistics() {
  return useQuery<AcademicStatistics, Error>({
    queryKey: academicStatisticsQueryKey,
    queryFn: academicStatisticsApi.get,
    staleTime: 60_000,
    retry: 1,
  });
}
