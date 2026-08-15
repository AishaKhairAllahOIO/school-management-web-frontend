import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import {
  createExamSchedule,
  deleteExamSchedule,
  getAdminExams,
  getExamSetup,
  updateExamSchedule,
} from "../api/exam-schedule.api";

import type { ExamFormData } from "../types/exam-schedule.types";

export const examScheduleQueryKey = ["exam-schedule"] as const;

export const examSetupQueryKey = ["exam-schedule", "setup"] as const;

export function useAdminExams(
  academicYearId: number | null,
  semesterId: number | null,
) {
  return useQuery({
    queryKey: [...examScheduleQueryKey, "admin", academicYearId, semesterId],

    queryFn: () => {
      if (academicYearId === null || semesterId === null) {
        throw new Error("Academic year and semester are required.");
      }

      return getAdminExams(academicYearId, semesterId);
    },

    enabled: academicYearId !== null && semesterId !== null,

    staleTime: 30_000,

    retry: 1,
  });
}

export function useExamSetup(gradeLevelId: number | null) {
  return useQuery({
    queryKey: [...examSetupQueryKey, gradeLevelId],

    queryFn: () => {
      if (gradeLevelId === null) {
        throw new Error("Grade level is required.");
      }

      return getExamSetup(gradeLevelId);
    },

    enabled: gradeLevelId !== null,

    staleTime: 60_000,

    retry: 1,
  });
}

export function useCreateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExamFormData) => createExamSchedule(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: examScheduleQueryKey,
      });

      toast.success("Exam schedule created successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      payload,
    }: {
      examId: number | string;
      payload: ExamFormData;
    }) => updateExamSchedule(examId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: examScheduleQueryKey,
      });

      toast.success("Exam schedule updated successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: number | string) => deleteExamSchedule(examId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: examScheduleQueryKey,
      });

      toast.success("Exam schedule deleted successfully.");
    },

    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}
