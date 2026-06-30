import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { gradeSubjectApi } from "../api/gradeSubject.api";
import type { CreateGradeSubjectPayload, UpdateGradeSubjectPayload } from "../types/grade-subject.types";

export const gradeSubjectQueryKey = ["academics", "gradeSubjects"];

export function useGradeSubjects() {
  return useQuery({
    queryKey: gradeSubjectQueryKey,
    queryFn: gradeSubjectApi.list,
  });
}

function useRefreshGradeSubjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: gradeSubjectQueryKey });
}

export function useCreateGradeSubject() {
  const refresh = useRefreshGradeSubjects();
  return useMutation({
    mutationFn: (payload: CreateGradeSubjectPayload) => gradeSubjectApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateGradeSubject() {
  const refresh = useRefreshGradeSubjects();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradeSubjectPayload }) =>
      gradeSubjectApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteGradeSubject() {
  const refresh = useRefreshGradeSubjects();
  return useMutation({
    mutationFn: gradeSubjectApi.remove,
    onSuccess: refresh,
  });
}
