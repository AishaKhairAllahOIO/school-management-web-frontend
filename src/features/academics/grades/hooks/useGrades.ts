import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { gradeApi } from "../api/grade.api";
import type { CreateGradePayload, UpdateGradePayload } from "../types/grade.types";

export const gradeQueryKey = ["academics", "grades"];

export function useGrades() {
  return useQuery({
    queryKey: gradeQueryKey,
    queryFn: gradeApi.list,
  });
}

function useRefreshGrades() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: gradeQueryKey });
}

export function useCreateGrade() {
  const refresh = useRefreshGrades();
  return useMutation({
    mutationFn: (payload: CreateGradePayload) => gradeApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateGrade() {
  const refresh = useRefreshGrades();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradePayload }) =>
      gradeApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteGrade() {
  const refresh = useRefreshGrades();
  return useMutation({
    mutationFn: gradeApi.remove,
    onSuccess: refresh,
  });
}
