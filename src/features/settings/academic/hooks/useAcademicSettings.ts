import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

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

export const academicSettingsQueryKey = [
  "academic-settings",
] as const;

export const academicYearsQueryKey = [
  "academic-settings",
  "years",
] as const;

export const academicTermsQueryKey = [
  "academic-settings",
  "terms",
] as const;

export const academicStagesQueryKey = [
  "academic-settings",
  "stages",
] as const;

export function useAcademicSettings() {
  return useQuery({
    queryKey: academicSettingsQueryKey,

    queryFn:
      academicSettingsApi.getViewData,
  });
}

export function useAcademicYears() {
  return useQuery({
    queryKey: academicYearsQueryKey,

    queryFn:
      academicSettingsApi.getAcademicYears,
  });
}

export function useAcademicYear(
  id: string | null,
) {
  return useQuery({
    queryKey: [
      ...academicYearsQueryKey,
      id,
    ],

    queryFn: () =>
      academicSettingsApi.getAcademicYear(id!),

    enabled: id !== null,
  });
}

export function useAcademicTerms() {
  return useQuery({
    queryKey: academicTermsQueryKey,

    queryFn:
      academicSettingsApi.getAcademicTerms,
  });
}

export function useAcademicTerm(
  id: string | null,
) {
  return useQuery({
    queryKey: [
      ...academicTermsQueryKey,
      id,
    ],

    queryFn: () =>
      academicSettingsApi.getAcademicTerm(id!),

    enabled: id !== null,
  });
}

export function useAcademicStages() {
  return useQuery({
    queryKey: academicStagesQueryKey,

    queryFn:
      academicSettingsApi.getAcademicStages,
  });
}

export function useAcademicStage(
  id: string | null,
) {
  return useQuery({
    queryKey: [
      ...academicStagesQueryKey,
      id,
    ],

    queryFn: () =>
      academicSettingsApi.getAcademicStage(id!),

    enabled: id !== null,
  });
}

function useRefreshAcademicData() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          academicSettingsQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          academicYearsQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          academicTermsQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          academicStagesQueryKey,
      }),
    ]);
  };
}

export function useUpdateAcademicSettings() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (
      payload: UpdateAcademicSettingsPayload,
    ) =>
      academicSettingsApi.updateSettings(
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic settings updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useDeleteAcademicSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      academicSettingsApi.deleteSettings,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          academicSettingsQueryKey,
      });

      toast.success(
        "Academic settings deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useCreateAcademicYear() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicYearPayload,
    ) =>
      academicSettingsApi.createAcademicYear(
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic year created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateAcademicYear() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAcademicYearPayload;
    }) =>
      academicSettingsApi.updateAcademicYear(
        id,
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic year updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useDeleteAcademicYear() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (id: string) =>
      academicSettingsApi.deleteAcademicYear(
        id,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic year deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useCreateAcademicTerm() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicTermPayload,
    ) =>
      academicSettingsApi.createAcademicTerm(
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic term created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateAcademicTerm() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAcademicTermPayload;
    }) =>
      academicSettingsApi.updateAcademicTerm(
        id,
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic term updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useDeleteAcademicTerm() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (id: string) =>
      academicSettingsApi.deleteAcademicTerm(
        id,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic term deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useCreateAcademicStage() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicStagePayload,
    ) =>
      academicSettingsApi.createAcademicStage(
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic stage created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateAcademicStage() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAcademicStagePayload;
    }) =>
      academicSettingsApi.updateAcademicStage(
        id,
        payload,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic stage updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useDeleteAcademicStage() {
  const refresh = useRefreshAcademicData();

  return useMutation({
    mutationFn: (id: string) =>
      academicSettingsApi.deleteAcademicStage(
        id,
      ),

    onSuccess: async () => {
      await refresh();

      toast.success(
        "Academic stage deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}