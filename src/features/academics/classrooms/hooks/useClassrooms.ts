import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createClassroom,
  deleteClassroom,
  getClassrooms,
  updateClassroom,
} from "@/features/academics/classrooms/api/classrooms.api";
import type {
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "@/features/academics/classrooms/types/classroom.types";

export const classroomsQueryKey = ["academics", "classrooms"];

export function useClassrooms() {
  return useQuery({
    queryKey: classroomsQueryKey,
    queryFn: getClassrooms,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassroomPayload) => createClassroom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey });
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      payload,
    }: {
      classroomId: string;
      payload: UpdateClassroomPayload;
    }) => updateClassroom(classroomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey });
    },
  });
}