import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherAssignmentApi } from "../api/teacherAssignment.api";
import type { CreateTeacherAssignmentPayload, UpdateTeacherAssignmentPayload } from "../types/teacher-assignment.types";

export const teacherAssignmentQueryKey = ["academics", "teacherAssignments"];

export function useTeacherAssignments() {
  return useQuery({
    queryKey: teacherAssignmentQueryKey,
    queryFn: teacherAssignmentApi.list,
  });
}

function useRefreshTeacherAssignments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: teacherAssignmentQueryKey });
}

export function useCreateTeacherAssignment() {
  const refresh = useRefreshTeacherAssignments();
  return useMutation({
    mutationFn: (payload: CreateTeacherAssignmentPayload) => teacherAssignmentApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateTeacherAssignment() {
  const refresh = useRefreshTeacherAssignments();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherAssignmentPayload }) =>
      teacherAssignmentApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteTeacherAssignment() {
  const refresh = useRefreshTeacherAssignments();
  return useMutation({
    mutationFn: teacherAssignmentApi.remove,
    onSuccess: refresh,
  });
}
