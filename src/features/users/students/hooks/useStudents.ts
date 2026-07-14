import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { studentApi } from "../api/student.api";
import type {
  EntityId,
  RegisterStudentPayload,
  StudentListFilters,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
} from "../types/student-api.types";
import { studentKeys } from "./student.keys";

export const studentsQueryKey =
  studentKeys.all;

export function useStudents(
  filters: StudentListFilters = {},
) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentApi.list(filters),
    placeholderData: (previousData) =>
      previousData,
  });
}

export function useStudentDetails(
  studentId: EntityId | null,
) {
  return useQuery({
    queryKey: studentKeys.detail(
      studentId ?? "disabled",
    ),
    queryFn: () =>
      studentApi.getDetails(studentId!),
    enabled: studentId !== null,
  });
}

export function useStudentFullProfile(
  enrollmentId: EntityId | null,
) {
  return useQuery({
    queryKey: studentKeys.fullProfile(
      enrollmentId ?? "disabled",
    ),
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
        queryKey: studentKeys.lists(),
      });

      toast.success(
        "تم تسجيل الطالب وربطه بولي الأمر والقيد الدراسي بنجاح.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateStudentPersonal(
  enrollmentId?: EntityId,
) {
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      if (enrollmentId !== undefined) {
        await queryClient.invalidateQueries({
          queryKey:
            studentKeys.fullProfile(
              enrollmentId,
            ),
        });
      }

      toast.success(
        "تم تحديث بيانات الطالب بنجاح.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}

export function useUpdateGuardian(
  enrollmentId?: EntityId,
) {
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
      if (enrollmentId !== undefined) {
        await queryClient.invalidateQueries({
          queryKey:
            studentKeys.fullProfile(
              enrollmentId,
            ),
        });
      }

      toast.success(
        "تم تحديث بيانات ولي الأمر بنجاح.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
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
      payload: UpdateStudentEnrollmentPayload;
    }) =>
      studentApi.updateEnrollment(
        enrollmentId,
        payload,
      ),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey:
            studentKeys.fullProfile(
              variables.enrollmentId,
            ),
        }),
      ]);

      toast.success(
        "تم تحديث القيد الدراسي بنجاح.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}

export function useToggleStudentAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      enrollmentId: EntityId,
    ) =>
      studentApi.toggleAccountStatus(
        enrollmentId,
      ),

    onSuccess: async (_, enrollmentId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey:
            studentKeys.fullProfile(
              enrollmentId,
            ),
        }),
      ]);

      toast.success(
        "تم تغيير حالة حساب الطالب بنجاح.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}

export function useWithdrawStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      enrollmentId: EntityId,
    ) => studentApi.remove(enrollmentId),

    onSuccess: async (_, enrollmentId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey:
            studentKeys.fullProfile(
              enrollmentId,
            ),
        }),
      ]);

      toast.success(
        "تم سحب ملف الطالب من النظام بنجاح.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}
