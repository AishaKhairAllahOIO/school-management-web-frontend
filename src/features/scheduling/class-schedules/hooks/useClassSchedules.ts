import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createClassSchedule,
  deleteClassSchedule,
  getClassSchedules,
  updateClassSchedule,
} from "@/features/scheduling/class-schedules/api/class-schedules.api";
import type { UpdateClassSchedulePayload } from "@/features/scheduling/class-schedules/types/class-schedule.types";

export const classSchedulesQueryKey = ["scheduling", "class-schedules"];

export function useClassSchedules() {
  return useQuery({
    queryKey: classSchedulesQueryKey,
    queryFn: getClassSchedules,
  });
}

export function useCreateClassSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSchedulesQueryKey });
    },
  });
}

export function useUpdateClassSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      payload,
    }: {
      scheduleId: string;
      payload: UpdateClassSchedulePayload;
    }) => updateClassSchedule(scheduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSchedulesQueryKey });
    },
  });
}

export function useDeleteClassSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSchedulesQueryKey });
    },
  });
}