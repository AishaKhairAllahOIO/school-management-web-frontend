import { useQuery } from "@tanstack/react-query";

import { getStudents } from "@/features/users/students/api/students.api";

export const studentsQueryKey = ["users", "students"];

export function useStudents() {
  return useQuery({
    queryKey: studentsQueryKey,
    queryFn: getStudents,
  });
}