import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/features/academics/subjects/api/subjects.api";
import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "@/features/academics/subjects/types/subject.types";

export const subjectsQueryKey = ["academics", "subjects"];

export function useSubjects() {
  return useQuery({
    queryKey: subjectsQueryKey,
    queryFn: getSubjects,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createSubject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKey });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      payload,
    }: {
      subjectId: string;
      payload: UpdateSubjectPayload;
    }) => updateSubject(subjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKey });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKey });
    },
  });
}