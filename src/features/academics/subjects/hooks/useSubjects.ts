import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ApiId,
} from "../../shared/types/api.types";

import {
  subjectApi,
} from "../api/subject.api";

import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "../types/subject.types";

export const subjectQueryKey = [
  "academics",
  "subjects",
] as const;

export function useSubjects() {
  return useQuery({
    queryKey:
      subjectQueryKey,

    queryFn: () =>
      subjectApi.list(),
  });
}

export function useCreateSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        CreateSubjectPayload,
    ) =>
      subjectApi.create(
        payload,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            subjectQueryKey,
        });
    },

    onError: (
      error: unknown,
    ) => {
      console.error(
        "Create subject mutation failed:",
        error,
      );
    },
  });
}

export function useUpdateSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: ApiId;
      payload:
        UpdateSubjectPayload;
    }) =>
      subjectApi.update(
        id,
        payload,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            subjectQueryKey,
        });
    },
  });
}

export function useDeleteSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      subjectId: ApiId,
    ) =>
      subjectApi.remove(
        subjectId,
      ),

    onSuccess: async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            subjectQueryKey,
        });
    },
  });
}