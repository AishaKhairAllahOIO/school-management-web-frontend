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
  return useQuery({
    queryKey: classroomQueryKey,
    queryFn: classroomApi.list,
    staleTime: Infinity,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateClassroomPayload,
    ) => classroomApi.create(payload),

    onSuccess: (classroom) => {
      queryClient.setQueryData<Classroom[]>(
        classroomQueryKey,
        (currentClassrooms = []) => [
          classroom,
          ...currentClassrooms.filter(
            (item) => item.id !== classroom.id,
          ),
        ],
      );

      toast.success(
        "Classroom created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
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

    onSuccess: (classroom) => {
      queryClient.setQueryData<Classroom[]>(
        classroomQueryKey,
        (currentClassrooms = []) =>
          currentClassrooms.map((item) =>
            item.id === classroom.id
              ? classroom
              : item,
          ),
      );

      toast.success(
        "Classroom updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}