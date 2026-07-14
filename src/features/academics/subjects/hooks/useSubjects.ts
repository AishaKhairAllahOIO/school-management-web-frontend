import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { subjectApi } from "../api/subject.api";
import type { CreateSubjectPayload, UpdateSubjectPayload } from "../types/subject.types";

export const subjectQueryKey = ["academics", "subjects"];

export function useSubjects() {
  return useQuery({
    queryKey: subjectQueryKey,
    queryFn: subjectApi.list,
  });
}

function useRefreshSubjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: subjectQueryKey });
}

export function useCreateSubject() {
  const refresh = useRefreshSubjects();
  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => subjectApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateSubject() {
  const refresh = useRefreshSubjects();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSubjectPayload }) =>
      subjectApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteSubject() {
  const refresh = useRefreshSubjects();
  return useMutation({
    mutationFn: subjectApi.remove,
    onSuccess: refresh,
  });
}
