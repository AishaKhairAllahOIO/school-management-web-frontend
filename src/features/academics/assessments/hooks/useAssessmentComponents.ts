import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { assessmentComponentApi } from "../api/assessmentComponent.api";
import type { CreateAssessmentComponentPayload, UpdateAssessmentComponentPayload } from "../types/assessment-component.types";

export const assessmentComponentQueryKey = ["academics", "assessmentComponents"];

export function useAssessmentComponents() {
  return useQuery({
    queryKey: assessmentComponentQueryKey,
    queryFn: assessmentComponentApi.list,
  });
}

function useRefreshAssessmentComponents() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: assessmentComponentQueryKey });
}

export function useCreateAssessmentComponent() {
  const refresh = useRefreshAssessmentComponents();
  return useMutation({
    mutationFn: (payload: CreateAssessmentComponentPayload) => assessmentComponentApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateAssessmentComponent() {
  const refresh = useRefreshAssessmentComponents();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAssessmentComponentPayload }) =>
      assessmentComponentApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteAssessmentComponent() {
  const refresh = useRefreshAssessmentComponents();
  return useMutation({
    mutationFn: assessmentComponentApi.remove,
    onSuccess: refresh,
  });
}
