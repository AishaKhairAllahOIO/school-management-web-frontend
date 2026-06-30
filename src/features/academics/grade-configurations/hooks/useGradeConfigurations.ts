import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { gradeConfigurationApi } from "../api/gradeConfiguration.api";
import type { CreateGradeConfigurationPayload, UpdateGradeConfigurationPayload } from "../types/grade-configuration.types";

export const gradeConfigurationQueryKey = ["academics", "gradeConfigurations"];

export function useGradeConfigurations() {
  return useQuery({
    queryKey: gradeConfigurationQueryKey,
    queryFn: gradeConfigurationApi.list,
  });
}

function useRefreshGradeConfigurations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: gradeConfigurationQueryKey });
}

export function useCreateGradeConfiguration() {
  const refresh = useRefreshGradeConfigurations();
  return useMutation({
    mutationFn: (payload: CreateGradeConfigurationPayload) => gradeConfigurationApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateGradeConfiguration() {
  const refresh = useRefreshGradeConfigurations();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradeConfigurationPayload }) =>
      gradeConfigurationApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteGradeConfiguration() {
  const refresh = useRefreshGradeConfigurations();
  return useMutation({
    mutationFn: gradeConfigurationApi.remove,
    onSuccess: refresh,
  });
}
