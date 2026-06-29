import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { academicSettingsApi } from "../api/academicSettings.api";
import type {
  CreateAcademicStagePayload,
  CreateAcademicTermPayload,
  CreateAcademicYearPayload,
  UpdateAcademicSettingsPayload,
  UpdateAcademicStagePayload,
  UpdateAcademicTermPayload,
  UpdateAcademicYearPayload,
} from "../types/academic-settings.types";

export const academicSettingsQueryKey = ["academic-settings"];

export function useAcademicSettings() {
  return useQuery({
    queryKey: academicSettingsQueryKey,
    queryFn: academicSettingsApi.getViewData,
  });
}

function useRefreshAcademicSettings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: academicSettingsQueryKey });
}

export function useUpdateAcademicSettings() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: (payload: UpdateAcademicSettingsPayload) => academicSettingsApi.updateSettings(payload), onSuccess: refresh });
}

export function useCreateAcademicYear() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: (payload: CreateAcademicYearPayload) => academicSettingsApi.createAcademicYear(payload), onSuccess: refresh });
}

export function useUpdateAcademicYear() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateAcademicYearPayload }) => academicSettingsApi.updateAcademicYear(id, payload), onSuccess: refresh });
}

export function useDeleteAcademicYear() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: academicSettingsApi.deleteAcademicYear, onSuccess: refresh });
}

export function useCreateAcademicTerm() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: (payload: CreateAcademicTermPayload) => academicSettingsApi.createAcademicTerm(payload), onSuccess: refresh });
}

export function useUpdateAcademicTerm() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateAcademicTermPayload }) => academicSettingsApi.updateAcademicTerm(id, payload), onSuccess: refresh });
}

export function useDeleteAcademicTerm() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: academicSettingsApi.deleteAcademicTerm, onSuccess: refresh });
}

export function useCreateAcademicStage() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: (payload: CreateAcademicStagePayload) => academicSettingsApi.createAcademicStage(payload), onSuccess: refresh });
}

export function useUpdateAcademicStage() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateAcademicStagePayload }) => academicSettingsApi.updateAcademicStage(id, payload), onSuccess: refresh });
}

export function useDeleteAcademicStage() {
  const refresh = useRefreshAcademicSettings();
  return useMutation({ mutationFn: academicSettingsApi.deleteAcademicStage, onSuccess: refresh });
}
