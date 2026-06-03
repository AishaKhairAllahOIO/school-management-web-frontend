import { useQuery } from "@tanstack/react-query";

import { attendanceMock }
from "../mocks/attendance.mock";

export const useStudentAttendance =
() => {
  return useQuery({
    queryKey: [
      "student-attendance",
    ],

    queryFn: async () => {
      return attendanceMock;
    },
  });
};