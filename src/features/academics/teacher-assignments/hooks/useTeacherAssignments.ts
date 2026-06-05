import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTeacherAssignment,
  deleteTeacherAssignment,
  getTeacherAssignments,
  updateTeacherAssignment,
} from "@/features/academics/teacher-assignments/api/teacher-assignments.api";
import type {
  UpdateTeacherAssignmentPayload,
} from "@/features/academics/teacher-assignments/types/teacher-assignment.types";

export const teacherAssignmentsQueryKey = [
  "academics",
  "teacher-assignments",
];

export function useTeacherAssignments() {
  return useQuery({
    queryKey: teacherAssignmentsQueryKey,
    queryFn: getTeacherAssignments,
  });
}

export function useCreateTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacherAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentsQueryKey,
      });
    },
  });
}

export function useUpdateTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      payload,
    }: {
      assignmentId: string;
      payload: UpdateTeacherAssignmentPayload;
    }) => updateTeacherAssignment(assignmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentsQueryKey,
      });
    },
  });
}

export function useDeleteTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacherAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentsQueryKey,
      });
    },
  });
}