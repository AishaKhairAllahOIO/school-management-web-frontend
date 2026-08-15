import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";

import { schedulingApi } from "../api/scheduling.api";

import type {
  AddScheduleEntryPayload,
  AdminSchedule,
  GenerateSchedulePayload,
  TeacherSchedule,
  UpdateScheduleEntryVariables,
} from "../types/schedule.types";

export const scheduleQueryKey = ["scheduling", "admin-schedule"] as const;

export const teacherScheduleQueryKey = [
  "scheduling",
  "teacher-schedule",
] as const;

function getScheduleErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return "No schedule exists for the current academic year and semester.";
  }

  return getAxiosErrorMessage(error);
}

export function useCurrentAcademicPeriod() {
  const { data, isLoading, isError } = useAcademicSettings();

  const settings = data?.settings;

  if (!settings) {
    return {
      academicYearId: null,
      semesterId: null,
      isReady: false,
      isLoading,
      isError,
    };
  }

  const academicYearId = Number(settings.currentAcademicYearId);

  const semesterId = Number(settings.currentSemesterId);

  return {
    academicYearId:
      Number.isFinite(academicYearId) && academicYearId > 0
        ? academicYearId
        : null,

    semesterId:
      Number.isFinite(semesterId) && semesterId > 0 ? semesterId : null,

    isReady: academicYearId > 0 && semesterId > 0,

    isLoading,
    isError,
  };
}

export function useAdminSchedule(
  academicYearId: number | null,
  semesterId: number | null,
) {
  return useQuery<AdminSchedule, Error>({
    queryKey: [...scheduleQueryKey, academicYearId, semesterId],

    queryFn: () =>
      schedulingApi.getAdminSchedule({
        academic_year_id: academicYearId!,
        semester_id: semesterId!,
      }),

    enabled: academicYearId !== null && semesterId !== null,

    staleTime: 30_000,

    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }

      return failureCount < 1;
    },
  });
}

export function useTeacherSchedule(
  academicYearId: number | null,
  semesterId: number | null,
) {
  return useQuery<TeacherSchedule, Error>({
    queryKey: [...teacherScheduleQueryKey, academicYearId, semesterId],

    queryFn: () =>
      schedulingApi.getTeachersSchedule({
        academic_year_id: academicYearId!,
        semester_id: semesterId!,
      }),

    enabled: academicYearId !== null && semesterId !== null,

    staleTime: 30_000,
  });
}

export function useGenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateSchedulePayload) =>
      schedulingApi.generate(payload),

    onSuccess: async () => {
      toast.success("Schedule generation started successfully.");

      await queryClient.invalidateQueries({
        queryKey: scheduleQueryKey,
      });
    },

    onError: (error) => {
      toast.error(getScheduleErrorMessage(error));
    },
  });
}

export function useRegenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateSchedulePayload) =>
      schedulingApi.regenerate(payload),

    onSuccess: async () => {
      toast.success("Schedule regeneration started successfully.");

      await queryClient.invalidateQueries({
        queryKey: scheduleQueryKey,
      });
    },

    onError: (error) => {
      toast.error(getScheduleErrorMessage(error));
    },
  });
}

export function useUpdateScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, payload }: UpdateScheduleEntryVariables) =>
      schedulingApi.updateEntry(entryId, payload),

    onSuccess: async () => {
      toast.success("Schedule entry updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: scheduleQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: teacherScheduleQueryKey,
      });
    },

    onError: (error) => {
      toast.error(getScheduleErrorMessage(error));
    },
  });
}

export function useAddScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddScheduleEntryPayload) =>
      schedulingApi.addEntry(payload),

    onSuccess: async () => {
      toast.success("Schedule entry added successfully.");

      await queryClient.invalidateQueries({
        queryKey: scheduleQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: teacherScheduleQueryKey,
      });
    },

    onError: (error) => {
      toast.error(getScheduleErrorMessage(error));
    },
  });
}
