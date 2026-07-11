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

export const gradeQueryKey = [
  "academics",
  "grades",
] as const;

export function useGrades() {
  return useQuery({
    queryKey: gradeQueryKey,
    queryFn: gradeApi.list,

    /**
     * We keep created rows in the Query cache
     * during the current application session.
     */
    staleTime: Infinity,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradePayload) =>
      gradeApi.create(payload),

    onSuccess: (grade) => {
      queryClient.setQueryData<Grade[]>(
        gradeQueryKey,
        (currentGrades = []) => [
          grade,
          ...currentGrades.filter(
            (item) => item.id !== grade.id,
          ),
        ],
      );

      toast.success(
        "Grade created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
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

    onSuccess: (grade) => {
      queryClient.setQueryData<Grade[]>(
        gradeQueryKey,
        (currentGrades = []) =>
          currentGrades.map((item) =>
            item.id === grade.id
              ? grade
              : item,
          ),
      );

      toast.success(
        "Grade updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}