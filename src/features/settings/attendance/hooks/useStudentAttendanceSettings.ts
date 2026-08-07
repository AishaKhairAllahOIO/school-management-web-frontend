import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import * as api from "../api/studentAttendanceSettings.api";

import type {
  CreateStudentAttendanceSettingPayload,
  StudentAttendanceSetting,
  UpdateStudentAttendanceSettingPayload,
} from "../types/student-attendance.types";

export const studentAttendanceSettingsQueryKey = [
  "settings",
  "attendance",
  "students",
] as const;

function getErrorMessage(error: unknown): string {
  const candidate = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  };

  return (
    candidate.response?.data?.message ??
    candidate.message ??
    "Something went wrong. Please try again."
  );
}

export function useStudentAttendanceSettings() {
  return useQuery<StudentAttendanceSetting[]>({
    queryKey: studentAttendanceSettingsQueryKey,
    queryFn: api.getStudentAttendanceSettings,
    staleTime: 30_000,
  });
}

export function useCreateStudentAttendanceSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateStudentAttendanceSettingPayload,
    ) => api.createStudentAttendanceSetting(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentAttendanceSettingsQueryKey,
      });

      toast.success(
        "Attendance setting created successfully.",
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateStudentAttendanceSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentAttendanceSettingPayload;
    }) => api.updateStudentAttendanceSetting(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentAttendanceSettingsQueryKey,
      });

      toast.success(
        "Attendance setting updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteStudentAttendanceSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.deleteStudentAttendanceSetting(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentAttendanceSettingsQueryKey,
      });

      toast.success(
        "Attendance setting deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}