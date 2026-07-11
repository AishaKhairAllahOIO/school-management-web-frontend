import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

import { createEmptyGeneralSettings } from "../lib/general-settings.defaults";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { generalSettingsApi } from "../api/general-settings.api";
import type {
  CreateSchoolImagePayload,
  GeneralSettings,
  UpdateGeneralSettingsPayload,
  UpdateSchoolImagePayload,
} from "../types/general-settings.types";

export const generalSettingsQueryKey = [
  "settings",
  "general",
] as const;

function isSettingsNotInitializedError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const responseData = error.response?.data;

  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("message" in responseData)
  ) {
    return false;
  }

  const message = responseData.message;

  return (
    status === 404 &&
    typeof message === "string" &&
    message === "School settings have not been initialized yet."
  );
}

export function useGeneralSettings() {
  return useQuery({
    queryKey: generalSettingsQueryKey,

    queryFn: async (): Promise<GeneralSettings> => {
      try {
        const response = await generalSettingsApi.get();
        const settings = response.data.data;

        if (!settings) {
          throw new Error(
            "General settings data was not returned by the server.",
          );
        }

        return settings;
      } catch (error) {
        if (isSettingsNotInitializedError(error)) {
          return createEmptyGeneralSettings();
        }

        throw error;
      }
    },

    retry: (failureCount, error) => {
      if (isSettingsNotInitializedError(error)) {
        return false;
      }

      return failureCount < 1;
    },
  });
}


export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateGeneralSettingsPayload,
    ): Promise<GeneralSettings> => {
      const response = await generalSettingsApi.update(payload);
      const settings = response.data.data;

      if (!settings) {
        throw new Error(
          "Updated general settings were not returned by the server.",
        );
      }

      return settings;
    },

    onSuccess: (settings, _variables, _context) => {
      queryClient.setQueryData(
        generalSettingsQueryKey,
        settings,
      );

      toast.success("School settings updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
  
}
export function useAddSchoolImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSchoolImagePayload) => {
      const response = await generalSettingsApi.addImages(payload);
      return response.data.data ?? [];
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: generalSettingsQueryKey,
      });

      toast.success("School image added successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateSchoolImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSchoolImagePayload) => {
      const response = await generalSettingsApi.updateImage(payload);
      const image = response.data.data;

      if (!image) {
        throw new Error(
          "Updated school image was not returned by the server.",
        );
      }

      return image;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: generalSettingsQueryKey,
      });

      toast.success("School image updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteSchoolImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      generalSettingsApi.deleteImage(imageId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: generalSettingsQueryKey,
      });

      toast.success("School image deleted successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}