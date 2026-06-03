import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteSchoolImage,
  deleteSchoolLogo,
  getGeneralSettings,
  updateGeneralSettings,
  uploadSchoolImage,
  uploadSchoolLogo,
} from "@/features/settings/general/api/general-settings.api";

import type { UpdateGeneralSettingsPayload } from "@/features/settings/general/types/general-settings.types";

export const generalSettingsQueryKey = ["settings", "general"];

export function useGeneralSettings() {
  return useQuery({
    queryKey: generalSettingsQueryKey,
    queryFn: getGeneralSettings,
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGeneralSettingsPayload) =>
      updateGeneralSettings(payload),

    onSuccess: (data) => {
      queryClient.setQueryData(generalSettingsQueryKey, data);
    },
  });
}

export function useUploadSchoolLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSchoolLogo,

    onSuccess: (data) => {
      queryClient.setQueryData(generalSettingsQueryKey, data);
    },
  });
}

export function useDeleteSchoolLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchoolLogo,

    onSuccess: (data) => {
      queryClient.setQueryData(generalSettingsQueryKey, data);
    },
  });
}

export function useUploadSchoolImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSchoolImage,

    onSuccess: (data) => {
      queryClient.setQueryData(generalSettingsQueryKey, data);
    },
  });
}

export function useDeleteSchoolImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchoolImage,

    onSuccess: (data) => {
      queryClient.setQueryData(generalSettingsQueryKey, data);
    },
  });
}