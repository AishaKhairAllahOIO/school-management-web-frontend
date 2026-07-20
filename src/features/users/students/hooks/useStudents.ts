import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import type { ApiId } from "../../shared/types/api.types";

import { studentApi } from "../api/student.api";

import type {
  RegisterStudentPayload,
  StudentListFilters,
  StudentSearchParams,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

import { studentKeys } from "./student.keys";

export const studentsQueryKey =
  studentKeys.all;

/*
|--------------------------------------------------------------------------
| Queries
|--------------------------------------------------------------------------
*/

export function useStudents(
  filters: StudentListFilters = {},
) {
  return useQuery({
    queryKey:
      studentKeys.list(filters),

    queryFn: () =>
      studentApi.list(filters),

    placeholderData: (
      previousData,
    ) => previousData,
  });
}

export function useStudentSearch(
  params: StudentSearchParams,
) {
  const normalizedQuery =
    params.q.trim();

  return useQuery({
    queryKey:
      studentKeys.search({
        ...params,
        q: normalizedQuery,
      }),

    queryFn: () =>
      studentApi.search({
        ...params,
        q: normalizedQuery,
      }),

    enabled:
      normalizedQuery.length >= 2,

    placeholderData: (
      previousData,
    ) => previousData,
  });
}

export function useStudentDetails(
  studentId: ApiId | null | undefined,
) {
  return useQuery({
    queryKey:
      studentKeys.detail(
        studentId ?? "disabled",
      ),

    queryFn: () =>
      studentApi.getDetails(
        studentId!,
      ),

    enabled:
      studentId !== null &&
      studentId !== undefined,
  });
}

export function useStudentFullProfile(
  enrollmentId:
    | ApiId
    | null
    | undefined,
) {
  return useQuery({
    queryKey:
      studentKeys.fullProfile(
        enrollmentId ?? "disabled",
      ),

    queryFn: () =>
      studentApi.getFullProfile(
        enrollmentId!,
      ),

    enabled:
      enrollmentId !== null &&
      enrollmentId !== undefined,
  });
}

/*
|--------------------------------------------------------------------------
| Registration
|--------------------------------------------------------------------------
*/

export function useRegisterStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: RegisterStudentPayload,
    ) =>
      studentApi.register(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          studentKeys.lists(),
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

/*
|--------------------------------------------------------------------------
| Personal data
|--------------------------------------------------------------------------
*/

export function useUpdateStudentPersonal(
  enrollmentId?: ApiId,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: ApiId;
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
      const invalidations = [
        queryClient.invalidateQueries({
          queryKey:
            studentKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            studentKeys.detail(
              variables.studentId,
            ),
        }),
      ];

      if (
        enrollmentId !== undefined
      ) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey:
              studentKeys.fullProfile(
                enrollmentId,
              ),
          }),
        );
      }

      await Promise.all(
        invalidations,
      );

      toast.success(
        "تم تحديث بيانات الطالب بنجاح.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useUpdateGuardian(
  enrollmentId?: ApiId,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      guardianId,
      payload,
    }: {
      guardianId: ApiId;
      payload: UpdateGuardianPersonalPayload;
    }) =>
      studentApi.updateGuardian(
        guardianId,
        payload,
      ),

    onSuccess: async () => {
      if (
        enrollmentId !== undefined
      ) {
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

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Enrollment
|--------------------------------------------------------------------------
*/

export function useUpdateStudentEnrollment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      payload,
    }: {
      enrollmentId: ApiId;
      payload: UpdateStudentEnrollmentPayload;
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
          queryKey:
            studentKeys.lists(),
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

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Account status
|--------------------------------------------------------------------------
*/

export function useToggleStudentAccount() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      enrollmentId: ApiId,
    ) =>
      studentApi.toggleAccountStatus(
        enrollmentId,
      ),

    onSuccess: async (
      _data,
      enrollmentId,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            studentKeys.lists(),
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

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete / withdraw
|--------------------------------------------------------------------------
*/

export function useDeleteStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      studentId: ApiId,
    ) =>
      studentApi.remove(studentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          studentKeys.lists(),
      });

      toast.success(
        "تم حذف الطالب من النظام بنجاح.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Backward-compatible alias
|--------------------------------------------------------------------------
|
| هذا الاسم موجود في بعض الواجهات القديمة.
| يمكن حذفه بعد استبدال الاستخدامات بـ useDeleteStudent.
|
*/

export const useWithdrawStudent =
  useDeleteStudent;