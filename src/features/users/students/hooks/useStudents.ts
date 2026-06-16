import { useQuery } from "@tanstack/react-query";

import { studentsMock } from "@/features/users/students/mocks/students.mock";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => studentsMock,
  });
}