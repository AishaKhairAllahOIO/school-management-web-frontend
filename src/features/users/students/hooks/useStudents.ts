import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { studentApi } from "../api/student.api";
import type {
  RegisterStudentPayload,
  StudentListFilters,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
} from "../types/student-api.types";

export const studentsQueryKey = [
  "users",
  "students",
] as const;

export function useStudents(
  filters: StudentListFilters = {},
) {
  return useQuery({
    queryKey: [
      ...studentsQueryKey,
      filters,
    ],

    queryFn: () => studentApi.list(filters),
  });
}

export function useStudentDetails(
  studentId: number | string | null,
) {
  return useQuery({
    queryKey: [
      ...studentsQueryKey,
      "details",
      studentId,
    ],

    queryFn: () =>
      studentApi.getDetails(studentId!),

    enabled: studentId !== null,
  });
}

export function useStudentFullProfile(
  enrollmentId: number | string | null,
) {
  return useQuery({
    queryKey: [
      ...studentsQueryKey,
      "full-profile",
      enrollmentId,
    ],

    queryFn: () =>
      studentApi.getFullProfile(enrollmentId!),

    enabled: enrollmentId !== null,
  });
}

export function useRegisterStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: RegisterStudentPayload,
    ) => studentApi.register(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
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
      studentId: number | string;
      payload: UpdateStudentPersonalPayload;
    }) =>
      studentApi.updatePersonal(
        studentId,
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
      });

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
      guardianId: number | string;
      payload: UpdateGuardianPersonalPayload;
    }) =>
      studentApi.updateGuardian(
        guardianId,
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
      });

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
      enrollmentId: number | string;
      payload: UpdateStudentEnrollmentPayload;
    }) =>
      studentApi.updateEnrollment(
        enrollmentId,
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
      });

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
      studentId: number | string,
    ) => studentApi.remove(studentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
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
      studentId: number | string,
    ) =>
      studentApi.toggleAccountStatus(
        studentId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
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