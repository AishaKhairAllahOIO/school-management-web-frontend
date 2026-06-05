import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAcademicSettings,
  updateAcademicSettings,
} from "@/features/settings/academic/api/academic-settings.api";
import type { UpdateAcademicSettingsPayload } from "@/features/settings/academic/types/academic-settings.types";

export const academicSettingsQueryKey = ["settings", "academic"];

export function useAcademicSettings() {
  return useQuery({
    queryKey: academicSettingsQueryKey,
    queryFn: getAcademicSettings,
  });
}

export function useUpdateAcademicSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAcademicSettingsPayload) =>
      updateAcademicSettings(payload),

    onSuccess: (data) => {
      queryClient.setQueryData(academicSettingsQueryKey, data);
    },
  });
}