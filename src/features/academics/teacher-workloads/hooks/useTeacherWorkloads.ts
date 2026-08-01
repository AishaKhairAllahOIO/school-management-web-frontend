import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherWorkloadApi } from "../api/teacherWorkload.api";
import type {
  CreateTeacherWorkloadPayload,
  UpdateTeacherWorkloadPayload,
} from "../types/teacher-workload.types";

export const teacherWorkloadQueryKey = ["academics", "teacherWorkloads"] as const;

export function useTeacherWorkloads(teacherIds: string[]) {
  const stableIds = [...teacherIds].sort();

  return useQuery({
    queryKey: [...teacherWorkloadQueryKey, stableIds],
    queryFn: async () => {
      const groups = await Promise.all(
        stableIds.map((teacherId) => teacherWorkloadApi.list(teacherId)),
      );
      return groups.flat();
    },
    enabled: stableIds.length > 0,
  });
}

export function useCreateTeacherWorkload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherWorkloadApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teacherWorkloadQueryKey });
    },
  });
}

export function useUpdateTeacherWorkload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherWorkloadPayload }) =>
      teacherWorkloadApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teacherWorkloadQueryKey });
    },
  });
}

export function useDeleteTeacherWorkload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, teacherId }: { id: string; teacherId: string }) =>
      teacherWorkloadApi.remove(id, teacherId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teacherWorkloadQueryKey });
    },
  });
}
