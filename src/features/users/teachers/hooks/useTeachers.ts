import { useQuery } from "@tanstack/react-query";

import { teachersMock } from "@/features/users/teachers/mocks/teachers.mock";

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => teachersMock,
  });
}