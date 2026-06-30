import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherWorkloadApi } from "../api/teacherWorkload.api";
import type { CreateTeacherWorkloadPayload, UpdateTeacherWorkloadPayload } from "../types/teacher-workload.types";

export const teacherWorkloadQueryKey = ["academics", "teacherWorkloads"];

export function useTeacherWorkloads() {
  return useQuery({
    queryKey: teacherWorkloadQueryKey,
    queryFn: teacherWorkloadApi.list,
  });
}

function useRefreshTeacherWorkloads() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: teacherWorkloadQueryKey });
}

export function useCreateTeacherWorkload() {
  const refresh = useRefreshTeacherWorkloads();
  return useMutation({
    mutationFn: (payload: CreateTeacherWorkloadPayload) => teacherWorkloadApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateTeacherWorkload() {
  const refresh = useRefreshTeacherWorkloads();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherWorkloadPayload }) =>
      teacherWorkloadApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteTeacherWorkload() {
  const refresh = useRefreshTeacherWorkloads();
  return useMutation({
    mutationFn: teacherWorkloadApi.remove,
    onSuccess: refresh,
  });
}
