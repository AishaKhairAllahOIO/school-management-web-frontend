import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  assessmentComponentApi,
} from "../api/assessment-component.api";

import type {
  CreateAssessmentComponentPayload,
  UpdateAssessmentComponentPayload,
} from "../types/assessment-component.types";

export const assessmentComponentKeys = {
  all: [
    "assessment-components",
  ] as const,

  list: () =>
    [
      ...assessmentComponentKeys.all,
      "list",
    ] as const,

  details: (id: string) =>
    [
      ...assessmentComponentKeys.all,
      "details",
      id,
    ] as const,

  grouped: () =>
    [
      ...assessmentComponentKeys.all,
      "grouped",
    ] as const,
};

export function useAssessmentComponents() {
  return useQuery({
    queryKey:
      assessmentComponentKeys.list(),

    queryFn: () =>
      assessmentComponentApi.getAll(),
  });
}

export function useAssessmentComponent(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey:
      assessmentComponentKeys.details(
        id,
      ),

    queryFn: () =>
      assessmentComponentApi.getDetails(
        id,
      ),

    enabled:
      enabled && Boolean(id),
  });
}

export function useGroupedAssessmentComponents() {
  return useQuery({
    queryKey:
      assessmentComponentKeys.grouped(),

    queryFn: () =>
      assessmentComponentApi.getGrouped(),
  });
}

export function useCreateAssessmentComponent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateAssessmentComponentPayload,
    ) =>
      assessmentComponentApi.create(
        payload,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.grouped(),
        }),
      ]);
    },
  });
}

type UpdateAssessmentComponentVariables = {
  id: string;

  payload: UpdateAssessmentComponentPayload;
};

export function useUpdateAssessmentComponent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateAssessmentComponentVariables) =>
      assessmentComponentApi.update(
        id,
        payload,
      ),

    onSuccess: async (
      updatedComponent,
    ) => {
      queryClient.setQueryData(
        assessmentComponentKeys.details(
          updatedComponent.id,
        ),
        updatedComponent,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.grouped(),
        }),
      ]);
    },
  });
}

export function useDeleteAssessmentComponent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      assessmentComponentApi.delete(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            assessmentComponentKeys.grouped(),
        }),
      ]);
    },
  });
}