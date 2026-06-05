import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGradeSubject,
  deleteGradeSubject,
  getGradeSubjects,
  updateGradeSubject,
} from "@/features/academics/grade-subjects/api/grade-subjects.api";
import type {
  UpdateGradeSubjectPayload,
} from "@/features/academics/grade-subjects/types/grade-subject.types";

export const gradeSubjectsQueryKey = ["academics", "grade-subjects"];

export function useGradeSubjects() {
  return useQuery({
    queryKey: gradeSubjectsQueryKey,
    queryFn: getGradeSubjects,
  });
}

export function useCreateGradeSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGradeSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeSubjectsQueryKey });
    },
  });
}

export function useUpdateGradeSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gradeSubjectId,
      payload,
    }: {
      gradeSubjectId: string;
      payload: UpdateGradeSubjectPayload;
    }) => updateGradeSubject(gradeSubjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeSubjectsQueryKey });
    },
  });
}

export function useDeleteGradeSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGradeSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeSubjectsQueryKey });
    },
  });
}