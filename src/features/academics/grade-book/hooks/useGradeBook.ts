import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGradeBookEntry,
  deleteGradeBookEntry,
  getGradeBookEntries,
  updateGradeBookEntry,
} from "@/features/academics/grade-book/api/grade-book.api";
import type { UpdateGradeBookEntryPayload } from "@/features/academics/grade-book/types/grade-book.types";

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