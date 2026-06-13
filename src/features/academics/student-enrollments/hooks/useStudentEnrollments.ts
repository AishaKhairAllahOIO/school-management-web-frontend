import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudentEnrollment,
  deleteStudentEnrollment,
  getStudentEnrollments,
  updateStudentEnrollment,
} from "@/features/academics/student-enrollments/api/student-enrollments.api";
<<<<<<< HEAD
import type {
  UpdateStudentEnrollmentPayload,
} from "@/features/academics/student-enrollments/types/student-enrollment.types";
=======
import type { UpdateStudentEnrollmentPayload } from "@/features/academics/student-enrollments/types/student-enrollment.types";
>>>>>>> eda85da6a42b280ef2904d76f2bf1c05c3269c29

export const studentEnrollmentsQueryKey = [
  "academics",
  "student-enrollments",
];

export function useStudentEnrollments() {
  return useQuery({
    queryKey: studentEnrollmentsQueryKey,
    queryFn: getStudentEnrollments,
  });
}

export function useCreateStudentEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentEnrollmentsQueryKey,
      });
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
      enrollmentId: string;
      payload: UpdateStudentEnrollmentPayload;
    }) => updateStudentEnrollment(enrollmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentEnrollmentsQueryKey,
      });
    },
  });
}

export function useDeleteStudentEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentEnrollmentsQueryKey,
      });
    },
  });
}