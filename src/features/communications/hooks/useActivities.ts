import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  toast,
} from "sonner";

import {
  getAxiosErrorMessage,
} from "@/services/axios/axiosError";

import {
  communicationService,
} from "../services/communications.service";
import type {
  ActivityPayload,
} from "../types/communication.types";

const activitiesKey = ["communications", "activities"] as const;

function extractArray(response: unknown): any[] {
  const value = response as any;
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.data?.data)) return value.data.data;
  return [];
}

export function useActivities() {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: activitiesKey,
    queryFn: async () =>
      extractArray(
        await communicationService.getAllActivities(),
      ),
  });

  const createActivity = useMutation({
    mutationFn: (payload: ActivityPayload) =>
      communicationService.createActivity(payload),
    onSuccess: async () => {
      toast.success("Activity created successfully.");
      await queryClient.invalidateQueries({ queryKey: activitiesKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const updateActivity = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<ActivityPayload> }) =>
      communicationService.updateActivity(id, payload),
    onSuccess: async () => {
      toast.success("Activity updated successfully.");
      await queryClient.invalidateQueries({ queryKey: activitiesKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const deleteActivity = useMutation({
    mutationFn: (id: string | number) => communicationService.deleteActivity(id),
    onSuccess: async () => {
      toast.success("Activity deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: activitiesKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  return {
    activities: activitiesQuery.data ?? [],
    isLoading: activitiesQuery.isLoading,
    isError: activitiesQuery.isError,
    refetch: activitiesQuery.refetch,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
