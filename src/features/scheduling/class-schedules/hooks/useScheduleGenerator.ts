import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scheduleGenerationApi } from "../api/schedule-generator.api";

export function useGenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleGenerationApi.generate,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["class-schedules"],
      });
    },
  });
}

export function useRegenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleGenerationApi.regenerate,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["class-schedules"],
      });
    },
  });
}