import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherAssignmentApi } from "../api/teacherAssignment.api";
import type {
  CreateTeacherAssignmentPayload,
  UpdateTeacherAssignmentPayload,
} from "../types/teacher-assignment.types";

export const teacherAssignmentQueryKey = ["academics", "teacherAssignments"] as const;

export function useTeacherAssignments(teacherIds: string[]) {
  const stableIds = [...teacherIds].sort();

  return useQuery({
    queryKey: [...teacherAssignmentQueryKey, stableIds],
    queryFn: async () => {
      const groups = await Promise.all(
        stableIds.map((teacherId) => teacherAssignmentApi.list(teacherId)),
      );
      return groups.flat();
    },
    enabled: stableIds.length > 0,
  });
}

export function useCreateTeacherAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherAssignmentApi.create,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: teacherAssignmentQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["academics", "teacherWorkloads"] }),
      ]);
    },
  });
}

export function useUpdateTeacherAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherAssignmentPayload }) =>
      teacherAssignmentApi.update(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: teacherAssignmentQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["academics", "teacherWorkloads"] }),
      ]);
    },
  });
}

export function useDeleteTeacherAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, teacherId }: { id: string; teacherId: string }) =>
      teacherAssignmentApi.remove(id, teacherId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: teacherAssignmentQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["academics", "teacherWorkloads"] }),
      ]);
    },
  });
}
