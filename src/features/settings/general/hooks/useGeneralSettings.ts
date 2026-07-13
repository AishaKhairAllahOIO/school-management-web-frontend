import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { generalSettingsApi } from "../api/general-settings.api";
import { createEmptyGeneralSettings } from "../lib/general-settings.defaults";
import type {
  CreateSchoolImagesPayload,
  GeneralSettings,
  SchoolImage,
  UpdateGeneralSettingsPayload,
  UpdateSchoolImagePayload,
} from "../types/general-settings.types";

export const generalSettingsQueryKey = [
  "settings",
  "general",
] as const;

export const schoolImagesQueryKey = [
  "settings",
  "general",
  "images",
] as const;

export function useGeneralSettings() {
  return useQuery<GeneralSettings, Error>({
    queryKey: generalSettingsQueryKey,
    queryFn: generalSettingsApi.get,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSchoolImages(
  initialImages: SchoolImage[] = [],
) {
  return useQuery<SchoolImage[], Error>({
    queryKey: schoolImagesQueryKey,
    queryFn: generalSettingsApi.listImages,
    initialData: initialImages,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSchoolImage(
  imageId: string | null,
) {
  return useQuery<SchoolImage, Error>({
    queryKey: [
      ...schoolImagesQueryKey,
      imageId,
    ],
    queryFn: () =>
      generalSettingsApi.getImage(imageId!),
    enabled: imageId !== null,
    retry: 1,
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateGeneralSettingsPayload,
    ) => generalSettingsApi.update(payload),

    onSuccess: (settings) => {
      queryClient.setQueryData(
        generalSettingsQueryKey,
        settings,
      );

      queryClient.setQueryData(
        schoolImagesQueryKey,
        settings.images,
      );

      toast.success(
        "School settings updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generalSettingsApi.delete,

    onSuccess: async () => {
      const emptySettings =
        createEmptyGeneralSettings();

      queryClient.setQueryData(
        generalSettingsQueryKey,
        emptySettings,
      );

      queryClient.setQueryData(
        schoolImagesQueryKey,
        [],
      );

      queryClient.removeQueries({
        queryKey: schoolImagesQueryKey,
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: generalSettingsQueryKey,
      });

      toast.success(
        "School settings were reset successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

async function refreshGeneralSettingsData(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: generalSettingsQueryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: schoolImagesQueryKey,
    }),
  ]);
}

export function useAddSchoolImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateSchoolImagesPayload,
    ) => generalSettingsApi.addImages(payload),

    onSuccess: async () => {
      await refreshGeneralSettingsData(
        queryClient,
      );

      toast.success(
        "School images uploaded successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateSchoolImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateSchoolImagePayload,
    ) => generalSettingsApi.updateImage(payload),

    onSuccess: async (image) => {
      queryClient.setQueryData(
        [
          ...schoolImagesQueryKey,
          image.id,
        ],
        image,
      );

      await refreshGeneralSettingsData(
        queryClient,
      );

      toast.success(
        "School image updated successfully.",
      );
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

    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<SchoolImage[]>(
        schoolImagesQueryKey,
        (current = []) =>
          current.filter(
            (image) => image.id !== deletedId,
          ),
      );

      queryClient.removeQueries({
        queryKey: [
          ...schoolImagesQueryKey,
          deletedId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: generalSettingsQueryKey,
      });

      toast.success(
        "School image deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}
