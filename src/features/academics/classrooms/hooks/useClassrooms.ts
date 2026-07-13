import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { classroomApi } from "../api/classroom.api";
import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types/classroom.types";

export const classroomQueryKey = [
  "academics",
  "classrooms",
] as const;

export function useClassrooms() {
  return useQuery<Classroom[], Error>({
    queryKey: classroomQueryKey,
    queryFn: classroomApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassroomPayload) =>
      classroomApi.create(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomQueryKey,
      });

      toast.success("Classroom created successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClassroomPayload;
    }) => classroomApi.update(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomQueryKey,
      });

      toast.success("Classroom updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classroomApi.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomQueryKey,
      });

      toast.success("Classroom deleted successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}
