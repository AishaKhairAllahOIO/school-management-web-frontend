import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { academicSettingsApi } from "../api/academicSettings.api";
import type {
  AcademicSettingsViewData,
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

export function useAcademicSettings() {
  return useQuery({
    queryKey: academicSettingsQueryKey,
    queryFn: academicSettingsApi.getViewData,
  });
}

function useAcademicSettingsCache() {
  const queryClient = useQueryClient();

  function updateCache(
    updater: (
      current: AcademicSettingsViewData,
    ) => AcademicSettingsViewData,
  ) {
    queryClient.setQueryData<AcademicSettingsViewData>(
      academicSettingsQueryKey,
      (current) => {
        if (!current) {
          return current;
        }

        return updater(current);
      },
    );
  }

  return {
    queryClient,
    updateCache,
  };
}

export function useUpdateAcademicSettings() {
  const { updateCache } = useAcademicSettingsCache();

  return useMutation({
    mutationFn: (
      payload: UpdateAcademicSettingsPayload,
    ) => academicSettingsApi.updateSettings(payload),

    onSuccess: (settings) => {
      updateCache((current) => ({
        ...current,
        settings,
      }));

      toast.success(
        "Academic settings updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useCreateAcademicYear() {
  const { updateCache } = useAcademicSettingsCache();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicYearPayload,
    ) =>
      academicSettingsApi.createAcademicYear(payload),

    onSuccess: (year) => {
      updateCache((current) => ({
        ...current,

        settings: year.isCurrent
          ? {
              ...current.settings,
              currentAcademicYearId: year.id,
            }
          : current.settings,

        academicYears: [
          year,
          ...current.academicYears
            .filter((item) => item.id !== year.id)
            .map((item) =>
              year.isCurrent
                ? { ...item, isCurrent: false }
                : item,
            ),
        ],
      }));

      toast.success(
        "Academic year created successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateAcademicYear() {
  const { updateCache } = useAcademicSettingsCache();

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

    onSuccess: (year) => {
      updateCache((current) => ({
        ...current,

        settings: year.isCurrent
          ? {
              ...current.settings,
              currentAcademicYearId: year.id,
            }
          : current.settings,

        academicYears: current.academicYears.map(
          (item) => {
            if (item.id === year.id) {
              return year;
            }

            return year.isCurrent
              ? { ...item, isCurrent: false }
              : item;
          },
        ),
      }));

      toast.success(
        "Academic year updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useCreateAcademicTerm() {
  const { updateCache } = useAcademicSettingsCache();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicTermPayload,
    ) =>
      academicSettingsApi.createAcademicTerm(payload),

    onSuccess: (term) => {
      updateCache((current) => ({
        ...current,

        settings: term.isCurrent
          ? {
              ...current.settings,
              currentSemesterId: term.id,
            }
          : current.settings,

        academicTerms: [
          term,
          ...current.academicTerms
            .filter((item) => item.id !== term.id)
            .map((item) =>
              term.isCurrent
                ? { ...item, isCurrent: false }
                : item,
            ),
        ],
      }));

      toast.success(
        "Academic term created successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateAcademicTerm() {
  const { updateCache } = useAcademicSettingsCache();

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

    onSuccess: (term) => {
      updateCache((current) => ({
        ...current,

        settings: term.isCurrent
          ? {
              ...current.settings,
              currentSemesterId: term.id,
            }
          : current.settings,

        academicTerms: current.academicTerms.map(
          (item) => {
            if (item.id === term.id) {
              return term;
            }

            return term.isCurrent
              ? { ...item, isCurrent: false }
              : item;
          },
        ),
      }));

      toast.success(
        "Academic term updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useCreateAcademicStage() {
  const { updateCache } = useAcademicSettingsCache();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicStagePayload,
    ) =>
      academicSettingsApi.createAcademicStage(
        payload,
      ),

    onSuccess: (stage) => {
      updateCache((current) => ({
        ...current,

        academicStages: [
          stage,
          ...current.academicStages.filter(
            (item) => item.id !== stage.id,
          ),
        ],
      }));

      toast.success(
        "Academic stage created successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateAcademicStage() {
  const { updateCache } = useAcademicSettingsCache();

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

    onSuccess: (stage) => {
      updateCache((current) => ({
        ...current,

        academicStages:
          current.academicStages.map((item) =>
            item.id === stage.id ? stage : item,
          ),
      }));

      toast.success(
        "Academic stage updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}