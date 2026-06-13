import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGradeBookEntry,
  deleteGradeBookEntry,
  getGradeBookEntries,
  updateGradeBookEntry,
} from "@/features/academics/grade-book/api/grade-book.api";
<<<<<<< HEAD
import type {
  UpdateGradeBookEntryPayload,
} from "@/features/academics/grade-book/types/grade-book.types";
=======
import type { UpdateGradeBookEntryPayload } from "@/features/academics/grade-book/types/grade-book.types";
>>>>>>> eda85da6a42b280ef2904d76f2bf1c05c3269c29

export const gradeBookQueryKey = ["academics", "grade-book"];

export function useGradeBookEntries() {
  return useQuery({
    queryKey: gradeBookQueryKey,
    queryFn: getGradeBookEntries,
  });
}

export function useCreateGradeBookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGradeBookEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeBookQueryKey });
    },
  });
}

export function useUpdateGradeBookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      payload,
    }: {
      entryId: string;
      payload: UpdateGradeBookEntryPayload;
    }) => updateGradeBookEntry(entryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeBookQueryKey });
    },
  });
}

export function useDeleteGradeBookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGradeBookEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeBookQueryKey });
    },
  });
}