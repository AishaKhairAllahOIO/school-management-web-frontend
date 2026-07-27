 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type { ActivityPayload } from "../types/communication.types";

export function useActivities() {
  const queryClient = useQueryClient();


  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: () => communicationService.getAllActivities(),
  });


  const createActivityMutation = useMutation({
    mutationFn: (payload: ActivityPayload) => communicationService.createActivity(payload),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });


  const updateActivityMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<ActivityPayload> }) =>
      communicationService.updateActivity(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", variables.id] });
    },
  });


  const deleteActivityMutation = useMutation({
    mutationFn: (id: string | number) => communicationService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    activities: activitiesQuery.data ?? [],
    isLoading: activitiesQuery.isLoading,
    isError: activitiesQuery.isError,
    refetch: activitiesQuery.refetch,
    createActivity: createActivityMutation,
    updateActivity: updateActivityMutation,
    deleteActivity: deleteActivityMutation,
  };
}