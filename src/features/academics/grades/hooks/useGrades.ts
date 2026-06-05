import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGrade,
  deleteGrade,
  getGrades,
  updateGrade,
} from "@/features/academics/grades/api/grades.api";
import type {
  CreateGradePayload,
  UpdateGradePayload,
} from "@/features/academics/grades/types/grade.types";

export const gradesQueryKey = ["academics", "grades"];

export function useGrades() {
  return useQuery({
    queryKey: gradesQueryKey,
    queryFn: getGrades,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradePayload) => createGrade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradesQueryKey });
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gradeId,
      payload,
    }: {
      gradeId: string;
      payload: UpdateGradePayload;
    }) => updateGrade(gradeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradesQueryKey });
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradesQueryKey });
    },
  });
}
