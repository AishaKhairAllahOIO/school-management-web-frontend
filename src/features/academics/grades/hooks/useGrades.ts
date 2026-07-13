import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { gradeApi } from "../api/grade.api";
import type {
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "../types/grade.types";

export const gradeQueryKey = ["academics", "grades"] as const;

export function useGrades() {
  return useQuery<Grade[], Error>({
    queryKey: gradeQueryKey,
    queryFn: gradeApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradePayload) =>
      gradeApi.create(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeQueryKey,
      });

      toast.success("Grade created successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGradePayload;
    }) => gradeApi.update(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeQueryKey,
      });

      toast.success("Grade updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gradeApi.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gradeQueryKey,
      });

      toast.success("Grade deleted successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}
