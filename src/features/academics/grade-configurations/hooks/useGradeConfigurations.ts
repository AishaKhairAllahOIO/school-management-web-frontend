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
  return useQuery({
    queryKey: gradeConfigurationQueryKey,
    queryFn: gradeConfigurationApi.list,
    staleTime: Infinity,
  });
}

export function useCreateGradeConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateGradeConfigurationPayload,
    ) =>
      gradeConfigurationApi.create(payload),

    onSuccess: (configuration) => {
      queryClient.setQueryData<
        GradeConfiguration[]
      >(
        gradeConfigurationQueryKey,
        (currentConfigurations = []) => [
          configuration,

          ...currentConfigurations.filter(
            (item) =>
              item.id !== configuration.id,
          ),
        ],
      );

      toast.success(
        "Grade configuration created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
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
    }) =>
      gradeConfigurationApi.update(
        id,
        payload,
      ),

    onSuccess: (configuration) => {
      queryClient.setQueryData<
        GradeConfiguration[]
      >(
        gradeConfigurationQueryKey,
        (currentConfigurations = []) =>
          currentConfigurations.map((item) =>
            item.id === configuration.id
              ? configuration
              : item,
          ),
      );

      toast.success(
        "Grade configuration updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}