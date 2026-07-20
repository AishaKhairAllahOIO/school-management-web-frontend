import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { studentApi } from "../api/student.api";
import type {
  RegisterStudentFormValues,
  StudentFilters,
  UpdateEnrollmentPayload,
  UpdateGuardianPersonalPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

import { studentKeys } from "./student.keys";

type EntityId = string | number;

export function useStudents(
  filters: StudentFilters = {},
) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentApi.list(filters),

    placeholderData: (previousData) => previousData,

    staleTime: 30_000,
  });
}

export function useStudentSearch(
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim();

  return useQuery({
    queryKey: studentKeys.search(normalizedSearchQuery),

    queryFn: () =>
      studentApi.search(normalizedSearchQuery),

    enabled: normalizedSearchQuery.length > 0,

    staleTime: 30_000,
  });
}

export function useStudentDetails(
  studentId: EntityId | null | undefined,
) {
  return useQuery({
    queryKey: studentKeys.detail(
      studentId ?? "disabled",
    ),

    queryFn: () =>
      studentApi.getDetails(studentId!),

    enabled:
      studentId !== null &&
      studentId !== undefined &&
      studentId !== "",
  });
}

export function useStudentFullProfile(
  enrollmentId: EntityId | null | undefined,
) {
  return useQuery({
    queryKey: studentKeys.fullProfile(
      enrollmentId ?? "disabled",
    ),

    queryFn: () =>
      studentApi.getFullProfile(enrollmentId!),

    enabled:
      enrollmentId !== null &&
      enrollmentId !== undefined &&
      enrollmentId !== "",
  });
}

export function useRegisterStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: RegisterStudentFormValues,
    ) => studentApi.register(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      toast.success(
        "Student registered successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateStudentPersonal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: EntityId;
      payload: UpdateStudentPersonalPayload;
    }) =>
      studentApi.updatePersonal(
        studentId,
        payload,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.detail(
            variables.studentId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.fullProfiles(),
        }),
      ]);

      toast.success(
        "Student information updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateStudentGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      guardianId,
      payload,
    }: {
      guardianId: EntityId;
      payload: UpdateGuardianPersonalPayload;
    }) =>
      studentApi.updateGuardian(
        guardianId,
        payload,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.details(),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.fullProfiles(),
        }),
      ]);

      toast.success(
        "Guardian information updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateStudentEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      payload,
    }: {
      enrollmentId: EntityId;
      payload: UpdateEnrollmentPayload;
    }) =>
      studentApi.updateEnrollment(
        enrollmentId,
        payload,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.details(),
        }),

        queryClient.invalidateQueries({
          queryKey: studentKeys.fullProfile(
            variables.enrollmentId,
          ),
        }),
      ]);

      toast.success(
        "Student enrollment updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      enrollmentId: EntityId,
    ) => studentApi.remove(enrollmentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.all,
      });

      toast.success(
        "Student removed successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useToggleStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      enrollmentId: EntityId,
    ) =>
      studentApi.toggleAccount(
        enrollmentId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.all,
      });

      toast.success(
        "Student status updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}