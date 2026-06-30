import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { classroomApi } from "../api/classroom.api";
import type { CreateClassroomPayload, UpdateClassroomPayload } from "../types/classroom.types";

export const classroomQueryKey = ["academics", "classrooms"];

export function useClassrooms() {
  return useQuery({
    queryKey: classroomQueryKey,
    queryFn: classroomApi.list,
  });
}

function useRefreshClassrooms() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: classroomQueryKey });
}

export function useCreateClassroom() {
  const refresh = useRefreshClassrooms();
  return useMutation({
    mutationFn: (payload: CreateClassroomPayload) => classroomApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateClassroom() {
  const refresh = useRefreshClassrooms();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClassroomPayload }) =>
      classroomApi.update(id, payload),
    onSuccess: refresh,
  });
}

export function useDeleteClassroom() {
  const refresh = useRefreshClassrooms();
  return useMutation({
    mutationFn: classroomApi.remove,
    onSuccess: refresh,
  });
}
