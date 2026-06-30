import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { studentEnrollmentApi, type CreateStudentEnrollmentPayload, type UpdateStudentEnrollmentPayload } from "../api/studentEnrollment.api";

export const studentEnrollmentQueryKey = ["academics", "studentEnrollments"];

export function useStudentEnrollments() {
  return useQuery({ queryKey: studentEnrollmentQueryKey, queryFn: studentEnrollmentApi.list });
}

function useRefreshStudentEnrollments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: studentEnrollmentQueryKey });
}

export function useCreateStudentEnrollment() {
  const refresh = useRefreshStudentEnrollments();
  return useMutation({ mutationFn: (payload: CreateStudentEnrollmentPayload) => studentEnrollmentApi.create(payload), onSuccess: refresh });
}

export function useUpdateStudentEnrollment() {
  const refresh = useRefreshStudentEnrollments();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentEnrollmentPayload }) => studentEnrollmentApi.update(id, payload), onSuccess: refresh });
}

export function useDeleteStudentEnrollment() {
  const refresh = useRefreshStudentEnrollments();
  return useMutation({ mutationFn: studentEnrollmentApi.remove, onSuccess: refresh });
}
