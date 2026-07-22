import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  gradeSubjectApi,
} from "../api/gradeSubject.api";

import type {
  CreateGradeSubjectPayload,
  UpdateGradeSubjectPayload,
} from "../types/grade-subject.types";

export const gradeSubjectQueryKey = [
  "academics",
  "gradeSubjects",
] as const;

export function useGradeSubjects() {
  return useQuery({
    queryKey:
      gradeSubjectQueryKey,

    queryFn: () =>
      gradeSubjectApi.list(),
  });
}

export function useGradeSubjectDetails(
  gradeSubjectId:
    | string
    | null,
) {
  return useQuery({
    queryKey: [
      ...gradeSubjectQueryKey,
      "details",
      gradeSubjectId,
    ],

    queryFn: () =>
      gradeSubjectApi.getDetails(
        gradeSubjectId!,
      ),

    enabled:
      Boolean(gradeSubjectId),
  });
}

export function useCreateGradeSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        CreateGradeSubjectPayload,
    ) =>
      gradeSubjectApi.create(
        payload,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            gradeSubjectQueryKey,
        });
    },
  });
}

export function useUpdateGradeSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload:
        UpdateGradeSubjectPayload;
    }) =>
      gradeSubjectApi.update(
        id,
        payload,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            gradeSubjectQueryKey,
        });
    },
  });
}

export function useDeleteGradeSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      gradeSubjectId: string,
    ) =>
      gradeSubjectApi.remove(
        gradeSubjectId,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            gradeSubjectQueryKey,
        });
    },
  });
}