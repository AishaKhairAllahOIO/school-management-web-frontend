import { useQuery } from "@tanstack/react-query";

import { marksApi } from "../api/marks.api";

import type { AllMarksResponse } from "../types/marks.types";

export const marksQueryKey = ["marks"] as const;

export function useAllMarks(
  academicYearId: number | null,
  semesterId: number | null,
) {
  return useQuery<AllMarksResponse, Error>({
    queryKey: [...marksQueryKey, academicYearId, semesterId],

    queryFn: () => marksApi.getAllMarks(academicYearId!, semesterId!),

    enabled: academicYearId !== null && semesterId !== null,

    staleTime: 30_000,
  });
}
