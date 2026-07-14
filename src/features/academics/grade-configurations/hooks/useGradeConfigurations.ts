import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { gradeConfigurationApi } from "../api/gradeConfiguration.api";
import type {
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

export const gradeConfigurationQueryKey = [
  "academics",
  "gradeConfigurations",
] as const;

export function useGradeConfigurations() {
  return useQuery<GradeConfiguration[], Error>({
    queryKey: gradeConfigurationQueryKey,
    queryFn: gradeConfigurationApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateGradeConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradeConfigurationPayload) =>
      gradeConfigurationApi.create(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeConfigurationQueryKey,
      });

      toast.success("Grade configuration created successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateGradeConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGradeConfigurationPayload;
    }) => gradeConfigurationApi.update(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeConfigurationQueryKey,
      });

      toast.success("Grade configuration updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteGradeConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      gradeConfigurationApi.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeConfigurationQueryKey,
      });

      toast.success("Grade configuration deleted successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}
